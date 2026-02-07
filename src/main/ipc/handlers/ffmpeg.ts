import { DATA_DIR, FFMPEG_FOLDER_PATH } from '@main/index';
import Settings from '@main/settings/settings';
import { getFfmpegFromPc, getFfmpegVersionFromPc } from '@main/utils/app';
import { downloadFfmpeg7z } from '@main/utils/download';
import { copyFolder, deleteFile } from '@main/utils/fs';
import logger from '@shared/logger';
import path from 'node:path';
import SevenZip from '7zip-min';
import { is } from '@electron-toolkit/utils';
import { get7zBinaryPath } from '@main/utils/app';

async function copyFfmpegFromPc(ffmpegPathInPc: string) {
  const ffmpegFolderInPc = path.dirname(ffmpegPathInPc);
  // copy ffmpeg files on windows
  if (process.platform === 'win32') {
    await copyFolder(ffmpegFolderInPc, FFMPEG_FOLDER_PATH);
  }
}

function getFfmpegExeAndBinPath() {
  // ffmpeg path for windows
  const ffmpegExePath = path.join(DATA_DIR, 'ffmpeg-win', 'bin', 'ffmpeg.exe');
  const ffmpegBinPath = path.join(DATA_DIR, 'ffmpeg-win', 'bin');

  return { ffmpegExePath, ffmpegBinPath };
}

export async function confirmFfmpeg() {
  const settings = Settings.getInstance();

  try {
    logger.info('Checking ffmpeg in PC...');

    const { ffmpegVersionInPc, ffmpegPathInPc } = await getFfmpegFromPc();

    if (ffmpegPathInPc && ffmpegVersionInPc) {
      await copyFfmpegFromPc(ffmpegPathInPc);
      settings.set('ffmpegPath', FFMPEG_FOLDER_PATH);
      settings.set('ffmpegVersion', ffmpegVersionInPc);
    }

    logger.info(`ffmpeg path in PC: ${ffmpegPathInPc}`);
    logger.info(`ffmpeg version in PC: ${ffmpegVersionInPc}`);

    return { ffmpegVersionInPc, ffmpegPathInPc };
  } catch (err) {
    logger.error(err);
    return { ffmpegPathInPc: null, ffmpegVersionInPc: null };
  }
}

export async function downloadFfmpeg() {
  const settings = Settings.getInstance();

  try {
    logger.info('Downloading ffmpeg...');

    const output7zPath = await downloadFfmpeg7z(DATA_DIR);
    logger.info('Downloaded ffmpeg');

    if (!is.dev) {
      SevenZip.config({
        binaryPath: get7zBinaryPath()
      });
    }

    await SevenZip.unpack(output7zPath, DATA_DIR);

    await deleteFile(output7zPath);

    const { ffmpegExePath, ffmpegBinPath } = getFfmpegExeAndBinPath();

    const ffmpegVersionInPc = await getFfmpegVersionFromPc(ffmpegExePath);

    settings.set('ffmpegPath', ffmpegBinPath);
    settings.set('ffmpegVersion', ffmpegVersionInPc);

    logger.info(`ffmpeg downloaded: ${ffmpegBinPath}`);
    logger.info(`ffmpeg downloaded version: ${ffmpegVersionInPc}`);

    return { ffmpegVersionInPc, ffmpegPathInPc: ffmpegBinPath };
  } catch (err) {
    logger.error('Failed to download ffmpeg:', err);
    return { ffmpegVersionInPc: null, ffmpegPathInPc: null };
  }
}
