import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';
import logger from '@shared/logger';
import { AppSettingsChange, Source, type Api } from '@shared/types';
import { DownloadOptions } from '@shared/types/download';
import { ReleaseChannel, SupportedCookieBrowser } from 'yt-dlp-command-builder';
import { IPC_CHANNELS } from '@shared/ipc/channels';

// Custom APIs for renderer
const api: Api = {
  on: (channel: string, listener: (...args: unknown[]) => void) => {
    const wrapped = (_: unknown, ...args: unknown[]) => listener(...args);
    ipcRenderer.on(channel, wrapped);
    return () => ipcRenderer.removeListener(channel, wrapped);
  },

  // ───────────────── app ─────────────────
  minimize: () => ipcRenderer.send(IPC_CHANNELS.app.window.minimize),

  maximize: () => ipcRenderer.send(IPC_CHANNELS.app.window.maximize),

  close: () => ipcRenderer.send(IPC_CHANNELS.app.window.close),

  rendererInit: () => ipcRenderer.invoke(IPC_CHANNELS.app.renderer.init),

  saveSettings: (changedSettings: AppSettingsChange) =>
    ipcRenderer.send(IPC_CHANNELS.app.settings.save, changedSettings),

  deleteAllMetadata: () => ipcRenderer.send(IPC_CHANNELS.app.metadata.deleteAll),

  // ───────────────── media ─────────────────
  checkUrl: (url: string) => ipcRenderer.invoke(IPC_CHANNELS.media.url.check, url),

  getMediaInfoJson: (
    url: string,
    source: Source,
    shouldUpdateUrlHistory: boolean,
    refetch?: boolean
  ) => ipcRenderer.send(IPC_CHANNELS.media.info.get, url, source, shouldUpdateUrlHistory, refetch),

  playMedia: (filePath: string) => ipcRenderer.send(IPC_CHANNELS.media.play, filePath),

  download: (downloadOptions: DownloadOptions) =>
    ipcRenderer.send(IPC_CHANNELS.media.download, downloadOptions),

  // ───────────────── download ─────────────────
  pauseAllDownloads: () => ipcRenderer.send(IPC_CHANNELS.download.all.pause),

  getRunningDownloads: () => ipcRenderer.invoke(IPC_CHANNELS.download.running.getAll),

  pauseRunningDownload: (id: string) => ipcRenderer.send(IPC_CHANNELS.download.running.pause, id),

  getQueuedDownloads: () => ipcRenderer.invoke(IPC_CHANNELS.download.queued.getAll),

  pauseQueuedDownload: (id: string) => ipcRenderer.send(IPC_CHANNELS.download.queued.pause, id),

  pauseQueuedDownloads: () => ipcRenderer.send(IPC_CHANNELS.download.queued.pauseAll),

  resumePausedDownload: (id: string) => ipcRenderer.send(IPC_CHANNELS.download.paused.resume, id),

  resumePausedDownloads: () => ipcRenderer.send(IPC_CHANNELS.download.paused.resumeAll),

  retryFailedDownload: (id: string) => ipcRenderer.send(IPC_CHANNELS.download.failed.retry, id),

  retryFailedDownloads: () => ipcRenderer.send(IPC_CHANNELS.download.failed.retryAll),

  getDownloadHistory: () => ipcRenderer.invoke(IPC_CHANNELS.download.history.get),

  deleteFromDownloadHistory: (id: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.download.history.deleteOne, id),

  deleteAllDownloadHistory: () => ipcRenderer.invoke(IPC_CHANNELS.download.history.deleteAll),

  downloadHistorySearch: (searchInput: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.download.history.search, searchInput),

  // ───────────────── url history ─────────────────
  getUrlHistory: () => ipcRenderer.invoke(IPC_CHANNELS.url.history.getAll),

  deleteFromUrlHistory: (id: string) => ipcRenderer.invoke(IPC_CHANNELS.url.history.deleteOne, id),

  deleteAllUrlHistory: () => ipcRenderer.invoke(IPC_CHANNELS.url.history.deleteAll),

  urlHistorySearch: (searchInput: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.url.history.search, searchInput),

  // ───────────────── fs ─────────────────
  selectFolder: () => ipcRenderer.invoke(IPC_CHANNELS.fs.folder.select),

  selectFile: () => ipcRenderer.invoke(IPC_CHANNELS.fs.file.select),

  showInFolder: (filePath: string) => ipcRenderer.send(IPC_CHANNELS.fs.reveal, filePath),

  // ───────────────── browser ─────────────────
  getBrowserProfiles: (browser: SupportedCookieBrowser) =>
    ipcRenderer.invoke(IPC_CHANNELS.browser.profiles.get, browser),

  // ───────────────── yt-dlp ─────────────────
  confirmYtdlp: () => ipcRenderer.invoke(IPC_CHANNELS['yt-dlp'].confirm),

  downloadYtdlp: () => ipcRenderer.invoke(IPC_CHANNELS['yt-dlp'].download),

  getYtdlpVersions: () => ipcRenderer.invoke(IPC_CHANNELS['yt-dlp'].versions.get),

  updateYtdlp: (channel: ReleaseChannel, version: string) =>
    ipcRenderer.send(IPC_CHANNELS['yt-dlp'].update, channel, version),

  // ───────────────── ffmpeg ─────────────────
  confirmFfmpeg: () => ipcRenderer.invoke(IPC_CHANNELS.ffmpeg.confirm),

  downloadFfmpeg: () => ipcRenderer.invoke(IPC_CHANNELS.ffmpeg.download)
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    logger.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
