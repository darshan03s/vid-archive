import { autoUpdater } from 'electron-updater';
import { app, dialog } from 'electron';
import logger from '@shared/logger';

export function initAutoUpdater() {
  if (!app.isPackaged) return;

  autoUpdater.autoDownload = false;

  autoUpdater.on('update-available', async (info) => {
    const result = await dialog.showMessageBox({
      type: 'info',
      title: 'Update available',
      message: `Version ${info.version} is available. Download now?`,
      buttons: ['Yes', 'No']
    });

    if (result.response === 0) {
      autoUpdater.downloadUpdate();
    }
  });

  autoUpdater.on('update-downloaded', async () => {
    const result = await dialog.showMessageBox({
      type: 'info',
      title: 'Update ready',
      message: 'Install now?',
      buttons: ['Yes', 'Later']
    });

    if (result.response === 0) {
      autoUpdater.quitAndInstall();
    }
  });

  autoUpdater.checkForUpdates().catch((err) => {
    logger.error('Updater error:', err);
  });
}
