import { urlHistoryOperations } from '@main/utils/dbUtils';
import logger from '@shared/logger';
import { IpcMainInvokeEvent } from 'electron';

export async function getUrlHistory() {
  return urlHistoryOperations.getAllByAddedAtDesc();
}

export async function deleteOneFromUrlHistory(_event: IpcMainInvokeEvent, id: string) {
  try {
    urlHistoryOperations.deleteById(id);
  } catch (e) {
    logger.error(`Could not delete from url history for id -> ${id}\n${e}`);
  }
}

export async function deleteAllFromUrlHistory() {
  try {
    urlHistoryOperations.deleteAll();
  } catch (e) {
    logger.error(`Could not delete all url history \n${e}`);
  }
}

export async function urlHistorySearch(_event: IpcMainInvokeEvent, searchInput: string) {
  return urlHistoryOperations.search(searchInput);
}
