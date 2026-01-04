import { DownloadManager } from '@main/downloadManager';
import { mainWindow } from '@main/index';
import { NewDownloadHistoryItem } from '@main/types/db';
import { downloadHistoryOperations } from '@main/utils/dbUtils';
import logger from '@shared/logger';
import { IpcMainEvent, IpcMainInvokeEvent } from 'electron';

export async function pauseAllDownloads() {
  const downloadManager = DownloadManager.getInstance();

  downloadManager.pauseAllQueuedDownloads();

  await downloadManager.pauseAllRunningDownloadsAndWait();

  mainWindow.webContents.send('yt-dlp:paused-all-downloads');
}

export async function pauseQueuedDownloads() {
  const downloadManager = DownloadManager.getInstance();

  downloadManager.pauseAllQueuedDownloads();
}

export async function getRunningDownloads() {
  const runningDownloads: NewDownloadHistoryItem[] = [];
  const downloadManager = DownloadManager.getInstance();
  downloadManager.currentlyRunningDownloads.forEach((data) => {
    runningDownloads.push(data.downloadingItem);
  });
  return runningDownloads;
}

export async function pauseRunningDownload(_event: IpcMainEvent, downloadId: string) {
  const downloadManager = DownloadManager.getInstance();

  downloadManager.pauseRunningDownload(downloadId);
}

export async function getQueuedDownloads() {
  const downloadManager = DownloadManager.getInstance();
  return downloadManager.getQueuedDownloads();
}

export async function pauseQueuedDownload(_event: IpcMainEvent, downloadId: string) {
  const downloadManager = DownloadManager.getInstance();

  downloadManager.pauseQueuedDownload(downloadId);
}

export async function resumePausedDownload(_event: IpcMainEvent, downloadId: string) {
  const downloadManager = DownloadManager.getInstance();

  await downloadManager.resumePausedDownload(downloadId);
}

export async function resumePausedDownloads() {
  const downloadManager = DownloadManager.getInstance();

  await downloadManager.resumePausedDownloads();
}

export async function retryFailedDownload(_event: IpcMainEvent, downloadId: string) {
  const downloadManager = DownloadManager.getInstance();

  await downloadManager.retryFailedDownload(downloadId);
}

export async function retryFailedDownloads() {
  const downloadManager = DownloadManager.getInstance();

  await downloadManager.retryFailedDownloads();
}

export async function getDownloadHistory() {
  return downloadHistoryOperations.getAllByCompletedAtDesc();
}

export async function deleteOneFromDownloadHistory(_event: IpcMainInvokeEvent, id: string) {
  try {
    downloadHistoryOperations.deleteById(id);
  } catch (e) {
    logger.error(`Could not delete from download history for id -> ${id}\n${e}`);
  }
}

export async function deleteAllFromDownloadHistory() {
  try {
    downloadHistoryOperations.deleteAll();
  } catch (e) {
    logger.error(`Could not delete all download history \n${e}`);
  }
}

export async function downloadHistorySearch(_event: IpcMainInvokeEvent, searchInput: string) {
  return downloadHistoryOperations.search(searchInput);
}
