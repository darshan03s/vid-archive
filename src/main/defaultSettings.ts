import { AppSettings } from './types/app'
import pkg from '../../package.json'
import { app } from 'electron'

export const defaultSettings: AppSettings = {
  appVersion: pkg.version,
  defaultFormat: 'bv+ba',
  downloadsFolder: app.getPath('downloads'),
  ffmpegPath: '',
  ffmpegVersion: '',
  mediaDataFolder: '',
  platform: process.platform,
  userDownloadsFolder: app.getPath('downloads'),
  ytdlpPath: '',
  ytdlpVersion: ''
}
