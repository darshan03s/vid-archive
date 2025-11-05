export type AppSettings = {
  appVersion: string
  ytdlpPath: string
  ytdlpVersion: string
  ffmpegPath: string
  ffmpegVersion: string
  platform: typeof process.platform | string
  mediaDataFolder: string
  downloadsFolder: string
  userDownloadsFolder: string
  defaultFormat: string
}
