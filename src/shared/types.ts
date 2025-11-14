export type AppSettings = {
  appVersion: string;
  ytdlpPath: string;
  ytdlpVersion: string;
  ffmpegPath: string;
  ffmpegVersion: string;
  platform: typeof process.platform | string;
  mediaDataFolder: string;
  downloadsFolder: string;
  userDownloadsFolder: string;
  defaultFormat: string;
};

export type Api = {
  rendererInit: () => Promise<AppSettings>;
  confirmYtdlp: () => Promise<{
    ytdlpPathInPc: string;
    ytdlpVersionInPc: string;
  }>;
  confirmFfmpeg: () => Promise<{
    ffmpegPathInPc: string;
    ffmpegVersionInPc: string;
  }>;
  downloadYtdlp: () => Promise<{
    ytdlpPathInPc: string;
    ytdlpVersionInPc: string;
  }>;
  downloadFfmpeg: () => Promise<{
    ffmpegPathInPc: string;
    ffmpegVersionInPc: string;
  }>;
  checkUrl: (url: string) => Promise<{
    source: string;
    url: string;
    isMediaDisplayAvailable: boolean;
  }>;
};
