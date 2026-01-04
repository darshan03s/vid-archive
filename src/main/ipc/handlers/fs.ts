import { dialog, IpcMainEvent, shell } from 'electron';
import path from 'node:path';

export async function selectFolder() {
  const result = await dialog.showOpenDialog({
    title: 'Select a folder',
    properties: ['openDirectory']
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  return result.filePaths[0];
}

export async function selectFile() {
  const result = await dialog.showOpenDialog({
    title: 'Select cookies file',
    properties: ['openFile'],
    filters: [{ name: 'Text Files', extensions: ['txt'] }]
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  return result.filePaths[0];
}

export async function showInFolder(_event: IpcMainEvent, filePath: string) {
  const folder = path.dirname(filePath);
  const result = await shell.openPath(folder);
  if (result) {
    throw new Error(result);
  }
}
