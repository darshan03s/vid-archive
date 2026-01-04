import { DATA_DIR, FFMPEG_FOLDER_PATH } from '@main/index';
import Settings from '@main/settings';
import { getFfmpegFromPc, getFfmpegVersionFromPc } from '@main/utils/appUtils';
import { downloadFfmpeg7z } from '@main/utils/downloadFfmpeg7z';
import { copyFolder, deleteFile } from '@main/utils/fsUtils';
import logger from '@shared/logger';
import path from 'node:path';
import SevenZip from '7zip-min';
import { is } from '@electron-toolkit/utils';

export async function confirmFfmpeg() {
  const settings = Settings.getInstance();

  try {
    logger.info('Checking ffmpeg in PC...');

    const { ffmpegVersionInPc, ffmpegPathInPc } = await getFfmpegFromPc();

    if (ffmpegPathInPc && ffmpegVersionInPc) {
      const ffmpegFolderInPc = path.dirname(ffmpegPathInPc);
      await copyFolder(ffmpegFolderInPc, FFMPEG_FOLDER_PATH);
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
      const sevenZipPath = path.join(
        process.resourcesPath,
        'app.asar.unpacked',
        'node_modules',
        '7zip-bin',
        'win',
        'x64',
        '7za.exe'
      );

      SevenZip.config({
        binaryPath: sevenZipPath
      });
    }

    await SevenZip.unpack(output7zPath, DATA_DIR);

    await deleteFile(output7zPath);

    const ffmpegExePath = path.join(DATA_DIR, 'ffmpeg-8.0-full_build', 'bin', 'ffmpeg.exe');
    const ffmpegBinPath = path.join(DATA_DIR, 'ffmpeg-8.0-full_build', 'bin');

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
