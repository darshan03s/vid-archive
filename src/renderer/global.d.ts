import { type AppSettings } from '@/shared/types'

export {}

declare global {
  interface Window {
    api: {
      rendererInit: () => Promise<AppSettings>
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
