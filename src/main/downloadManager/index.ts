import { ChildProcess, spawn } from 'node:child_process';
import { NewDownloadHistoryItem } from '../types/db';
import { downloadHistoryOperations } from '../utils/dbUtils';
import { mainWindow } from '..';
import { ProgressDetails } from '@shared/types/download';
import { getFileExtension } from '../utils/fsUtils';
import Settings from '../settings';
import logger from '@shared/logger';
import { terminateProcess } from '../utils/appUtils';
import { PendingQueue } from './pendingQueue';

type RunningDownload = {
  downloadingItem: NewDownloadHistoryItem;
  downloadProcess: ChildProcess;
};

export class DownloadManager {
  private static instance: DownloadManager | null = null;
  currentlyRunningDownloads: RunningDownload[];
  pendingQueue: PendingQueue;

  private constructor() {
    this.currentlyRunningDownloads = [];
    this.pendingQueue = new PendingQueue();
  }

  static getInstance() {
    if (DownloadManager.instance === null) {
      throw Error('Initialize the download manager first');
    }
    return DownloadManager.instance;
  }

  static initDownloadManager() {
    DownloadManager.instance = new DownloadManager();
  }

  addDownload(newDownload: NewDownloadHistoryItem) {
    if (this.hasMaxConcurrentDownloadsReached()) {
      this.addDownloadToPendingQueue(newDownload);
    } else {
      this.startDownload(newDownload);
    }
  }

  private hasMaxConcurrentDownloadsReached() {
    const settings = Settings.getInstance();
    const maxAllowedConcurrentDownloads = settings.get('maxConcurrentDownloads');
    return this.currentlyRunningDownloads.length === maxAllowedConcurrentDownloads;
  }

  private addDownloadToPendingQueue(newDownload: NewDownloadHistoryItem) {
    newDownload.download_status = 'waiting';
    newDownload.download_progress_string = 'Waiting for download...';
    this.pendingQueue.enqueue(newDownload);
    // refresh downloads after adding to pending queue
    mainWindow.webContents.send('refresh-downloads');
    mainWindow.webContents.send('download-queued', newDownload.format);
    logger.info(`Download queued: ${newDownload.title}`);
  }

  private printStdoutLine(line: string, pid?: number) {
    console.log(`[${pid ?? 'N/A'}] stdout: ${line}`);
  }

  private printStderrLine(line: string, pid?: number) {
    console.log(`[${pid ?? 'N/A'}] stderr: ${line}`);
  }

  private getProgressPercent(text: string) {
    const match = text.match(/(\d+(?:\.\d+)?)%/);
    if (!match) return null;

    return parseFloat(match[1]);
  }

  private startDownload(newDownload: NewDownloadHistoryItem) {
    const downloadCommandBase = newDownload.download_command_base;
    const downloadCommandArgs = JSON.parse(newDownload.download_command_args);

    const child = spawn(downloadCommandBase, downloadCommandArgs);

    const runningDownload: RunningDownload = {
      downloadingItem: newDownload,
      downloadProcess: child
    };

    const { downloadingItem } = runningDownload;
    downloadingItem.download_status = 'downloading';
    downloadingItem.download_progress_string = 'Downloading...';

    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');

    const getLines = (data: string) => data.split(/\r?\n/).filter((l) => l.trim() !== '');

    // Add listeners for stdout
    child.stdout.on('data', (data: string) => {
      const lines = getLines(data);
      for (const line of lines) {
        this.printStdoutLine(line, child.pid);
        downloadingItem.download_progress_string = line;
        downloadingItem.download_progress =
          this.getProgressPercent(line) ?? downloadingItem.download_progress;
        downloadingItem.complete_output += `\n${line}`;
        mainWindow.webContents.send(`download-progress:${downloadingItem.id}`, {
          progressString: line,
          progressPercentage: this.getProgressPercent(line) ?? downloadingItem.download_progress
        } as ProgressDetails);
      }
    });

    // Add listeners for stderr
    child.stderr.on('data', (data: string) => {
      const lines = getLines(data);
      for (const line of lines) {
        this.printStderrLine(line, child.pid);
        downloadingItem.download_progress_string = line;
        downloadingItem.complete_output += `\n${line}`;
        mainWindow.webContents.send(`download-progress:${downloadingItem.id}`, {
          progressString: line
        } as ProgressDetails);
        if (line.includes('ERROR')) {
          if (data.includes('No video formats found')) {
            mainWindow.webContents.send('yt-dlp:error', 'No video formats found');
          }
          if (data.includes('urllib3.connection.HTTPSConnection')) {
            mainWindow.webContents.send('yt-dlp:error', 'Connection error');
          }
          if (
            data.includes(
              '--live-from-start is passed, but there are no formats that can be downloaded from the start'
            )
          ) {
            mainWindow.webContents.send(
              'yt-dlp:error',
              'No formats available to download live from start'
            );
          }
          if (data.includes('DPAPI') || data.includes('Could not copy Chrome cookie database')) {
            mainWindow.webContents.send(
              'yt-dlp:error',
              'Could not get cookies from the selected browser. Try a different browser'
            );
          } else {
            mainWindow.webContents.send('yt-dlp:error', data);
          }
        }
      }
    });

    // Add listener for process exit
    child.on('close', (code, signal) => {
      console.log('Exit -> ', { code, signal });
      if (code === 0) {
        // download success
        this.onDownloadSuccess(downloadingItem, code);
      } else {
        if (downloadingItem.download_status === 'paused') {
          // download paused
          this.onDownloadPause(downloadingItem, code);
        } else {
          // download failed
          this.onDownloadFail(downloadingItem, code);
        }
      }
    });

    // Add to currently running downloads
    this.currentlyRunningDownloads.unshift(runningDownload);
    mainWindow.webContents.send('download-begin', downloadingItem.format);

    // refresh downloads after starting download
    mainWindow.webContents.send('refresh-downloads');
  }

  private getCompleteOutputLines(output: string) {
    return output
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
  }

  private onDownloadSuccess(downloadedItem: NewDownloadHistoryItem, code: number) {
    downloadedItem.download_status = 'completed';
    downloadedItem.download_completed_at = new Date().toISOString();
    downloadedItem.download_progress_string = 'Download Completed';
    downloadedItem.download_progress = 100;
    const lines = this.getCompleteOutputLines(downloadedItem.complete_output);

    const filepath = lines.at(-1);
    const ext = getFileExtension(filepath);
    downloadedItem.download_path = downloadedItem.download_path + `.${ext}`;

    downloadedItem.complete_output += '\nProcess completed with exit code ' + code;

    this.updateDownloads(downloadedItem);
    logger.info(`Download completed: ${downloadedItem.title}`);
  }

  private onDownloadPause(pausedDownload: NewDownloadHistoryItem, code: number | null) {
    pausedDownload.download_completed_at = new Date().toISOString();
    pausedDownload.download_progress_string = 'Download Paused';
    pausedDownload.complete_output += '\nDownload Paused';

    pausedDownload.complete_output += '\nProcess completed with exit code ' + code;

    this.updateDownloads(pausedDownload);
    logger.info(`Download paused: ${pausedDownload.title}`);
  }

  private onDownloadFail(failedDownload: NewDownloadHistoryItem, code: number | null) {
    failedDownload.download_status = 'failed';
    failedDownload.download_completed_at = new Date().toISOString();
    failedDownload.download_progress_string = 'Download Failed';
    failedDownload.complete_output += '\nDownload Failed';
    failedDownload.complete_output += '\nProcess completed with exit code ' + code;
    mainWindow.webContents.send(
      'yt-dlp:download-failed',
      `Download failed for ${failedDownload.title}`
    );
    this.updateDownloads(failedDownload);
    logger.info(`Download failed: ${failedDownload.title}`);
  }

  private persistDownload(download: NewDownloadHistoryItem) {
    downloadHistoryOperations.addNew(download);
  }

  private updateDownloads(downloadItem: NewDownloadHistoryItem) {
    this.persistDownload(downloadItem);

    this.currentlyRunningDownloads = this.currentlyRunningDownloads.filter(
      (d) => d.downloadingItem.id != downloadItem.id
    );

    if (!this.pendingQueue.isEmpty() && !this.hasMaxConcurrentDownloadsReached()) {
      this.nextDownload();
    }

    // refresh downloads after success, pause, fail
    mainWindow.webContents.send('refresh-downloads');
  }

  private nextDownload() {
    const nextDownload = this.pendingQueue.dequeue();
    this.startDownload(nextDownload);
  }

  pauseRunningDownload(downloadId: string) {
    const downloadToPause = this.currentlyRunningDownloads.find(
      (d) => d.downloadingItem.id === downloadId
    );

    if (!downloadToPause) {
      logger.error(`Download item to pause not found in currently running downloads`);
      return;
    }

    const { downloadingItem, downloadProcess } = downloadToPause;

    downloadingItem.download_status = 'paused';
    terminateProcess(downloadProcess);
  }

  pauseQueuedDownload(downloadId: string) {
    const queuedDownload = this.pendingQueue.remove(downloadId);
    if (!queuedDownload) {
      logger.error(`Download to pause from pending queue not found: ${downloadId}`);
      return;
    }
    queuedDownload.download_status = 'paused';
    queuedDownload.download_completed_at = new Date().toISOString();
    queuedDownload.download_progress_string = 'Download Paused';
    queuedDownload.complete_output += '\nDownload Paused';

    queuedDownload.complete_output += '\nProcess complete';

    this.updateDownloads(queuedDownload);
  }

  pauseAllQueuedDownloads() {
    const queuedDownloads = this.pendingQueue.removeAll();

    if (queuedDownloads.length === 0) return;

    for (const queuedDownload of queuedDownloads) {
      queuedDownload.download_status = 'paused';
      queuedDownload.download_completed_at = new Date().toISOString();
      queuedDownload.download_progress_string = 'Download Paused';
      queuedDownload.complete_output += '\nDownload Paused';

      queuedDownload.complete_output += '\nProcess complete';
      this.persistDownload(queuedDownload);
    }
    mainWindow.webContents.send('refresh-downloads');
  }

  pauseAllRunningDownloads() {
    const running = this.currentlyRunningDownloads;

    if (running.length === 0) {
      return;
    }

    let exited = 0;

    for (const d of running) {
      const { downloadingItem, downloadProcess } = d;

      downloadingItem.download_status = 'paused';

      downloadProcess.once('exit', () => {
        exited++;
        if (exited === running.length) {
          mainWindow.webContents.send('yt-dlp:paused-all-downloads');
        }
      });

      terminateProcess(downloadProcess);
    }
  }

  pauseAllRunningDownloadsAndWait(): Promise<void> {
    const running = this.currentlyRunningDownloads;

    if (running.length === 0) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      let exited = 0;

      for (const d of running) {
        const { downloadingItem, downloadProcess } = d;

        downloadingItem.download_status = 'paused';

        downloadProcess.once('exit', () => {
          exited++;
          if (exited === running.length) {
            resolve();
          }
        });

        terminateProcess(downloadProcess);
      }
    });
  }

  async resumePausedDownload(downloadId: string) {
    const pausedDownload = await downloadHistoryOperations.getById(downloadId);

    if (!pausedDownload) {
      logger.error(`Download item to resume not found`);
      return;
    }

    pausedDownload!.download_status = 'downloading';

    this.addDownload(pausedDownload!);

    downloadHistoryOperations.deleteById(downloadId);
  }

  async resumePausedDownloads() {
    const pausedDownloads = await downloadHistoryOperations.getPausedDownloadsByCompletedAtDesc();

    if (!pausedDownloads || pausedDownloads.length === 0) {
      logger.error(`No downloads to resume`);
      return;
    }

    for (const pausedDownload of pausedDownloads) {
      pausedDownload!.download_status = 'downloading';

      this.addDownload(pausedDownload!);

      downloadHistoryOperations.deleteById(pausedDownload!.id);
    }
  }

  async retryFailedDownload(downloadId: string) {
    const failedDownload = await downloadHistoryOperations.getById(downloadId);

    if (!failedDownload) {
      logger.error(`Download item to retry not found`);
      return;
    }

    failedDownload!.download_status = 'downloading';

    this.addDownload(failedDownload!);

    downloadHistoryOperations.deleteById(downloadId);
  }

  async retryFailedDownloads() {
    const failedDownloads = await downloadHistoryOperations.getFailedDownloadsByCompletedAtAsc();

    if (!failedDownloads || failedDownloads.length === 0) {
      logger.error(`No failed downloads to retry`);
      return;
    }

    for (const failedDownload of failedDownloads) {
      failedDownload!.download_status = 'downloading';

      this.addDownload(failedDownload!);

      downloadHistoryOperations.deleteById(failedDownload.id);
    }
  }

  getQueuedDownloads() {
    return this.pendingQueue.toArray();
  }
}
