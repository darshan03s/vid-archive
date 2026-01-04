export const IPC_CHANNELS = {
  app: {
    window: {
      minimize: 'app:window.minimize',
      close: 'app:window.close'
    },
    renderer: {
      init: 'app:renderer.init'
    },
    settings: {
      save: 'app:settings.save'
    },
    metadata: {
      deleteAll: 'app:metadata.deleteAll'
    }
  },

  media: {
    url: {
      check: 'media:url.check'
    },
    info: {
      get: 'media:info.get'
    },
    play: 'media:play',
    download: 'media:download'
  },

  download: {
    all: {
      pause: 'download:all.pause'
    },

    running: {
      getAll: 'download:running.get.all',
      pause: 'download:running.pause'
    },

    queued: {
      getAll: 'download:queued.get.all',
      pause: 'download:queued.pause',
      pauseAll: 'download:queued.pause.all'
    },

    paused: {
      resume: 'download:paused.resume',
      resumeAll: 'download:paused.resume.all'
    },

    failed: {
      retry: 'download:failed.retry',
      retryAll: 'download:failed.retry.all'
    },

    history: {
      get: 'download:history.get',
      deleteOne: 'download:history.deleteOne',
      deleteAll: 'download:history.deleteAll',
      search: 'download:history.search'
    }
  },

  url: {
    history: {
      getAll: 'url:history:getAll',
      deleteOne: 'url:history:deleteOne',
      deleteAll: 'url:history:deleteAll',
      search: 'url:history:search'
    }
  },

  fs: {
    folder: {
      select: 'fs:folder.select'
    },
    file: {
      select: 'fs:file.select'
    },
    reveal: 'fs:reveal'
  },

  browser: {
    profiles: {
      get: 'browser:profiles.get'
    }
  },

  'yt-dlp': {
    confirm: 'ytdlp:confirm',
    download: 'yt-dlp:download',
    versions: {
      get: 'yt-dlp:versions.get'
    },
    update: 'yt-dlp:update'
  },

  ffmpeg: {
    confirm: 'ffmpeg:confirm',
    download: 'ffmpeg:download'
  }
} as const;
