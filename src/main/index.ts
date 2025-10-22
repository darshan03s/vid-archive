import { app, shell, BrowserWindow } from 'electron'
import path, { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { makeDirs, pathExistsSync } from './utils/fsUtils'
import { initStoreManager } from './store'
import Database from 'better-sqlite3'
import pkg from '../../package.json'
import { type AppSettings } from './types'

const APP_USER_MODEL_ID = 'com.ytdlpui'
export const isDev = process.env.ELECTRON_RENDERER_URL ? true : false
export const APP_DATA_PATH = isDev ? path.join(path.resolve(), 'app-data') : app.getPath('userData')
app.setPath('userData', APP_DATA_PATH)
export const DATA_DIR = path.join(APP_DATA_PATH, 'data')
export const DB_PATH = path.join(DATA_DIR, 'app.db')
export const SETTINGS_PATH = path.join(DATA_DIR, 'settings.json')
export const MEDIA_DATA_FOLDER_PATH = path.join(DATA_DIR, 'media-data')

console.log(`isDev: ${isDev}`)
console.log(`APP_DATA_PATH: ${APP_DATA_PATH}`)
console.log(`DATA_DIR: ${DATA_DIR}`)
console.log(`DB_PATH: ${DB_PATH}`)
console.log(`SETTINGS_PATH: ${SETTINGS_PATH}`)
console.log()

export const appSettings: AppSettings = {
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

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    minWidth: 500,
    width: 500,
    maxWidth: 700,
    height: 670,
    show: false,
    maximizable: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

async function init() {
  if (!pathExistsSync(DATA_DIR)) {
    makeDirs(DATA_DIR)
    console.log('Created DATA_DIR')
  } else {
    console.log('DATA_DIR exists')
  }

  if (!pathExistsSync(MEDIA_DATA_FOLDER_PATH)) {
    makeDirs(MEDIA_DATA_FOLDER_PATH)
    console.log('Created MEDIA_DATA_FOLDER')
  } else {
    console.log('MEDIA_DATA_FOLDER exists')
  }

  if (!pathExistsSync(SETTINGS_PATH)) {
    const store = await initStoreManager()
    store.set('settings', appSettings)
    console.log('Created settings.json')
  } else {
    console.log('settings.json exists')
  }

  if (!pathExistsSync(DB_PATH)) {
    const db = new Database(DB_PATH)
    db.pragma('journal_mode = WAL')
    console.log('Created app.db')
  } else {
    console.log('app.db exists')
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  electronApp.setAppUserModelId(APP_USER_MODEL_ID)

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  await init()

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
