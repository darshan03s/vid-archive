export {}

declare global {
  interface Window {
    api: {
      rendererInit: () => Promise<{
        ytdlpPath: string
        ytdlpVersion: string
        ffmpegPath: string
        ffmpegVersion: string
      }>
      confirmYtdlp: () => Promise<{
        ytdlpPathInPc: string
        ytdlpVersionInPc: string
      }>
      confirmFfmpeg: () => Promise<{
        ffmpegPathInPc: string
        ffmpegVersionInPc: string
      }>
    }
    electron: typeof import('@electron-toolkit/preload').electronAPI
  }
}
