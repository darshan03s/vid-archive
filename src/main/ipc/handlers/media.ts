import { getNormalizedUrl, getSourceFromUrl } from '@main/utils/appUtils';
import { urlHistoryOperations } from '@main/utils/dbUtils';
import { downloadFromYtdlp, getInfoJson } from '@main/utils/ytdlpUtils';
import { allowedSources } from '@shared/data';
import logger from '@shared/logger';
import { Source } from '@shared/types';
import { IpcMainEvent, IpcMainInvokeEvent, shell } from 'electron';
import { mainWindow } from '@main/index';
import { DownloadOptions } from '@shared/types/download';
import { getUrlHistory } from './url';

export async function checkUrl(_event: IpcMainInvokeEvent, url: string) {
  const source = getSourceFromUrl(url);
  if (!source) {
    return { source: source, url: url, isMediaDisplayAvailable: false };
  }
  if (allowedSources.includes(source as Source)) {
    const normalizedUrl = getNormalizedUrl(source, url);
    return { source: source, url: normalizedUrl, isMediaDisplayAvailable: true };
  }
  return { source: source, url: url, isMediaDisplayAvailable: false };
}

let fetchingInfoJsonForUrls: string[] = [];

export async function getMediaInfoJson(
  _event: IpcMainEvent,
  url: string,
  source: Source,
  shouldUpdateUrlHistory: boolean,
  refetch?: boolean
) {
  if (fetchingInfoJsonForUrls.includes(url)) {
    return;
  }
  logger.info(`Fetching info json for ${url}`);
  fetchingInfoJsonForUrls.push(url);
  try {
    const infoJson = await getInfoJson(url, source, refetch);
    if (infoJson) {
      logger.info(`Fetched info json for ${url}`);
      if (shouldUpdateUrlHistory) {
        try {
          const newUrlHistoryItem = {
            url,
            thumbnail: infoJson.thumbnail ?? infoJson.thumbnails?.at(-1)?.url ?? '',
            title: infoJson.fulltitle?.trim() || infoJson.title?.trim() || 'N/A',
            source: source,
            thumbnail_local: infoJson.thumbnail_local ?? '',
            uploader: infoJson.uploader ?? infoJson.channel ?? '',
            uploader_url: infoJson.uploader_url ?? infoJson.channel_url ?? '',
            created_at: infoJson.upload_date ?? infoJson.modified_date,
            duration: infoJson.duration_string ?? ''
          };
          await urlHistoryOperations.upsertByUrl(url, newUrlHistoryItem);
          logger.info('Updated url history');
          const updatedUrlHistory = await getUrlHistory();
          mainWindow.webContents.send('url-history:updated', updatedUrlHistory);
        } catch (e) {
          logger.error(`Could not update url history \n${e}`);
        }
      }
      mainWindow.webContents.send('yt-dlp:recieve-media-info-json', infoJson);
      fetchingInfoJsonForUrls = fetchingInfoJsonForUrls.filter((u) => u != url);
    } else {
      logger.error(`Could not fetch info json for ${url}`);
      mainWindow.webContents.send('yt-dlp:recieve-media-info-json', null);
      fetchingInfoJsonForUrls = fetchingInfoJsonForUrls.filter((u) => u != url);
    }
  } catch (e) {
    logger.error(e);
  }
}

export function downloadMedia(_event: IpcMainEvent, downloadOptions: DownloadOptions) {
  downloadFromYtdlp(downloadOptions);
}

export async function playMedia(_event: IpcMainEvent, filePath: string) {
  const result = await shell.openPath(filePath);
  if (result) {
    throw new Error(result);
  }
}
