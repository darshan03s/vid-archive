import { ipcMain } from 'electron';
import {
  checkUrl,
  confirmFfmpeg,
  confirmYtdlp,
  deleteOneFromUrlHistory,
  deleteAllFromUrlHistory,
  downloadFfmpeg,
  downloadYtdlp,
  getUrlHistory,
  getMediaInfoJson,
  rendererInit,
  downloadMedia,
  getRunningDownloads,
  selectFolder,
  saveSettings,
  urlHistorySearch,
  downloadHistorySearch,
  deleteOneFromDownloadHistory,
  deleteAllFromDownloadHistory,
  getDownloadHistory,
  pauseAllDownloads,
  playMedia,
  showInFolder,
  selectFile,
  retryFailedDownload,
  deleteAllMetadata,
  getQueuedDownloads,
  pauseRunningDownload,
  resumePausedDownload,
  pauseQueuedDownload,
  resumePausedDownloads,
  retryFailedDownloads,
  pauseQueuedDownloads,
  getBrowserProfiles,
  getYtdlpVersions,
  updateYtdlp
} from './handlers';
import { mainWindow } from '..';
import { IPC_CHANNELS } from '../../shared/ipc/channels';

function registerHanlders() {
  ipcMain.on(IPC_CHANNELS.app.window.minimize, () => mainWindow.minimize());
  ipcMain.on(IPC_CHANNELS.app.window.close, () => mainWindow.close());
  ipcMain.handle(IPC_CHANNELS.app.renderer.init, rendererInit);
  ipcMain.on(IPC_CHANNELS.app.settings.save, saveSettings);
  ipcMain.on(IPC_CHANNELS.app.metadata.deleteAll, deleteAllMetadata);

  ipcMain.handle(IPC_CHANNELS.media.url.check, checkUrl);
  ipcMain.on(IPC_CHANNELS.media.info.get, getMediaInfoJson);
  ipcMain.on(IPC_CHANNELS.media.play, playMedia);
  ipcMain.on(IPC_CHANNELS.media.download, downloadMedia);

  ipcMain.on(IPC_CHANNELS.download.all.pause, pauseAllDownloads);
  ipcMain.handle(IPC_CHANNELS.download.running.getAll, getRunningDownloads);
  ipcMain.on(IPC_CHANNELS.download.running.pause, pauseRunningDownload);
  ipcMain.handle(IPC_CHANNELS.download.queued.getAll, getQueuedDownloads);
  ipcMain.on(IPC_CHANNELS.download.queued.pause, pauseQueuedDownload);
  ipcMain.on(IPC_CHANNELS.download.queued.pauseAll, pauseQueuedDownloads);
  ipcMain.on(IPC_CHANNELS.download.paused.resume, resumePausedDownload);
  ipcMain.on(IPC_CHANNELS.download.paused.resumeAll, resumePausedDownloads);
  ipcMain.on(IPC_CHANNELS.download.failed.retry, retryFailedDownload);
  ipcMain.on(IPC_CHANNELS.download.failed.retryAll, retryFailedDownloads);
  ipcMain.handle(IPC_CHANNELS.download.history.get, getDownloadHistory);
  ipcMain.handle(IPC_CHANNELS.download.history.deleteOne, deleteOneFromDownloadHistory);
  ipcMain.handle(IPC_CHANNELS.download.history.deleteAll, deleteAllFromDownloadHistory);
  ipcMain.handle(IPC_CHANNELS.download.history.search, downloadHistorySearch);

  ipcMain.handle(IPC_CHANNELS.url.history.getAll, getUrlHistory);
  ipcMain.handle(IPC_CHANNELS.url.history.deleteOne, deleteOneFromUrlHistory);
  ipcMain.handle(IPC_CHANNELS.url.history.deleteAll, deleteAllFromUrlHistory);
  ipcMain.handle(IPC_CHANNELS.url.history.search, urlHistorySearch);

  ipcMain.handle(IPC_CHANNELS.fs.folder.select, selectFolder);
  ipcMain.handle(IPC_CHANNELS.fs.file.select, selectFile);
  ipcMain.on(IPC_CHANNELS.fs.reveal, showInFolder);

  ipcMain.handle(IPC_CHANNELS.browser.profiles.get, getBrowserProfiles);

  ipcMain.handle(IPC_CHANNELS['yt-dlp'].confirm, confirmYtdlp);
  ipcMain.handle(IPC_CHANNELS['yt-dlp'].download, downloadYtdlp);
  ipcMain.handle(IPC_CHANNELS['yt-dlp'].versions.get, getYtdlpVersions);
  ipcMain.on(IPC_CHANNELS['yt-dlp'].update, updateYtdlp);

  ipcMain.handle(IPC_CHANNELS.ffmpeg.confirm, confirmFfmpeg);
  ipcMain.handle(IPC_CHANNELS.ffmpeg.download, downloadFfmpeg);
}
export default registerHanlders;
