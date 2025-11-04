import { AppSettings } from './types/app'
import pkg from '../../package.json'
import { app } from 'electron'
import { MEDIA_DATA_FOLDER_PATH } from '.'

export function getDefaultAppSettings(): AppSettings {
  return {
    appVersion: pkg.version,
    defaultFormat: 'bv+ba',
    downloadsFolder: app.getPath('downloads'),
    ffmpegPath: '',
    ffmpegVersion: '',
    mediaDataFolder: MEDIA_DATA_FOLDER_PATH,
    platform: process.platform,
    userDownloadsFolder: app.getPath('downloads'),
    ytdlpPath: '',
    ytdlpVersion: ''
  }
}
