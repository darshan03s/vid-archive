import { getFirefoxProfiles } from '@main/utils/appUtils';
import { IpcMainInvokeEvent } from 'electron';
import { SupportedCookieBrowser } from 'yt-dlp-command-builder';

export async function getBrowserProfiles(
  _event: IpcMainInvokeEvent,
  browser: SupportedCookieBrowser
) {
  if (browser === 'firefox') {
    return getFirefoxProfiles();
  }
  return [];
}
