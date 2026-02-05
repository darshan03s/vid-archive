import { getFirefoxProfiles } from '@main/utils/app';
import { IpcMainInvokeEvent } from 'electron';
import { SupportedCookieBrowser } from 'yt-dlp-command-builder';

export async function getBrowserProfiles(
  _event: IpcMainInvokeEvent,
  browser: SupportedCookieBrowser
) {
  if (browser === 'firefox') {
    // get firefox profiles for windows
    if (process.platform === 'win32') {
      return getFirefoxProfiles();
    }
  }
  return [];
}
