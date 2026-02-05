import { mainWindow, MEDIA_DATA_FOLDER_PATH } from '@main/index';
import Settings from '@main/settings/settings';
import { getAllInfoJsonFiles, getSettings } from '@main/utils/app';
import { deleteFile } from '@main/utils/fs';
import logger from '@shared/logger';
import { AppSettingsChange } from '@shared/types';
import { IpcMainEvent } from 'electron';
import path from 'node:path';

export async function rendererInit() {
  try {
    const settings = await getSettings();
    return settings;
  } catch (err) {
    logger.error('Failed to get settings:', err);
    return null;
  }
}

export async function saveSettings(_event: IpcMainEvent, changedSettings: AppSettingsChange) {
  const settings = Settings.getInstance();
  settings.update(changedSettings);
  const updatedSettings = settings.getAll();
  mainWindow.webContents.send('settings:updated', updatedSettings);
}

export async function deleteAllMetadata() {
  const allInfoJsonFiles = await getAllInfoJsonFiles(MEDIA_DATA_FOLDER_PATH);

  logger.info(`Deleting ${allInfoJsonFiles.length} info json files`);

  for (const relativePath of allInfoJsonFiles) {
    const absolutePath = path.join(MEDIA_DATA_FOLDER_PATH, relativePath);

    try {
      logger.info(`Deleting ${absolutePath}`);
      await deleteFile(absolutePath);
    } catch (error) {
      logger.error(error);
    }
  }

  mainWindow.webContents.send('app:delete-all-metadata');
}
