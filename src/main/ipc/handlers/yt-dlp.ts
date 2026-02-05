import { is } from '@electron-toolkit/utils';
import { DATA_DIR, mainWindow, YTDLP_EXE_PATH, YTDLP_FOLDER_PATH } from '@main/index';
import Settings from '@main/settings/settings';
import { getYtdlpFromPc, getYtdlpVersionFromPc } from '@main/utils/app';
import { downloadQuickJS, downloadYtDlpLatestRelease } from '@main/utils/download';
import { copyFileToFolder, deleteFile, pathExistsSync, readJson, writeJson } from '@main/utils/fs';
import logger from '@shared/logger';
import path from 'node:path';
import SevenZip from '7zip-min';
import { YtdlpVersions } from '@shared/types';
import { IpcMainEvent } from 'electron';
import { ReleaseChannel } from 'yt-dlp-command-builder';
import { spawn } from 'node:child_process';
import { getUpdateCommand } from '@main/utils/yt-dlp/ytdlpCommands';

export async function confirmYtdlp() {
  const settings = Settings.getInstance();

  try {
    logger.info('Checking yt-dlp in PC...');

    const { ytdlpVersionInPc, ytdlpPathInPc } = await getYtdlpFromPc();

    if (ytdlpPathInPc && ytdlpVersionInPc) {
      // copy yt-dlp files on windows
      if (process.platform === 'win32') {
        await copyFileToFolder(ytdlpPathInPc, YTDLP_FOLDER_PATH);
      }
      settings.set('ytdlpPath', YTDLP_EXE_PATH);
      settings.set('ytdlpVersion', ytdlpVersionInPc);
    }

    logger.info(`yt-dlp path in PC: ${ytdlpPathInPc}`);
    logger.info(`yt-dlp version in PC: ${ytdlpVersionInPc}`);

    await addJsRuntime();

    return { ytdlpVersionInPc, ytdlpPathInPc };
  } catch (err) {
    logger.error(err);
    return { ytdlpPathInPc: null, ytdlpVersionInPc: null };
  }
}

async function addJsRuntime() {
  const settings = Settings.getInstance();
  const outputJsRuntime7zPath = await downloadQuickJS(path.join(DATA_DIR, 'quickjs'));
  logger.info('Downloaded JS Runtime');

  if (!is.dev) {
    // set 7zip path on windows
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

  await SevenZip.unpack(outputJsRuntime7zPath, path.join(DATA_DIR, 'quickjs'));

  await deleteFile(outputJsRuntime7zPath);

  // set quickjs path for windows
  const quickJsPath = path.join(DATA_DIR, 'quickjs', 'qjs.exe');

  settings.set('jsRuntimePath', quickJsPath);
}

export async function downloadYtdlp() {
  const settings = Settings.getInstance();

  try {
    logger.info('Downloading yt-dlp...');

    const outputPath = await downloadYtDlpLatestRelease(YTDLP_FOLDER_PATH);
    logger.info('Downloaded yt-dlp latest release');

    const ytdlpVersionInPc = await getYtdlpVersionFromPc(outputPath);

    settings.set('ytdlpPath', outputPath);
    settings.set('ytdlpVersion', ytdlpVersionInPc);

    logger.info(`yt-dlp downloaded: ${outputPath}`);
    logger.info(`yt-dlp downloaded version: ${ytdlpVersionInPc}`);

    await addJsRuntime();

    return { ytdlpVersionInPc, ytdlpPathInPc: outputPath };
  } catch (err) {
    logger.error('Failed to download yt-dlp:', err);
    return { ytdlpVersionInPc: null, ytdlpPathInPc: null };
  }
}

export async function getYtdlpVersions() {
  type YtdlpVersionsJson = {
    nextFetch: string;
    versions: YtdlpVersions;
  };

  const stableTagsUrl = 'https://api.github.com/repos/yt-dlp/yt-dlp/tags';

  async function getTags(url: string) {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        logger.error(`Could not fetch tags for ${url}`);
        return null;
      }

      const data: { name: string }[] = await res.json();
      return data.map((obj) => obj.name);
    } catch (error) {
      logger.error(error);
      return null;
    }
  }

  const ytdlpVersionsJsonPath = path.join(DATA_DIR, 'yt-dlp-versions.json');

  async function createYtdlpVersionsJson() {
    const stableTags = (await getTags(stableTagsUrl)) || ['latest'];
    const masterTags = ['latest'];
    const nightlyTags = ['latest'];

    const versions = {
      stable: stableTags.slice(0, 10),
      master: masterTags,
      nightly: nightlyTags
    };

    const newYtdlpVersionsJson: YtdlpVersionsJson = {
      nextFetch: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
      versions
    };

    await writeJson(ytdlpVersionsJsonPath, newYtdlpVersionsJson);

    return versions;
  }

  if (pathExistsSync(ytdlpVersionsJsonPath)) {
    const ytdlpVersionsJson = await readJson<YtdlpVersionsJson>(ytdlpVersionsJsonPath);

    if (new Date().toISOString() >= ytdlpVersionsJson.nextFetch) {
      logger.info(`Updated yt-dlp-versions.json`);
      return createYtdlpVersionsJson();
    } else {
      logger.info(`Using yt-dlp-versions.json`);
      return ytdlpVersionsJson.versions;
    }
  } else {
    logger.info(`Created yt-dlp-versions.json`);
    return createYtdlpVersionsJson();
  }
}

async function updateYtdlpVersionInSettings() {
  const settings = Settings.getInstance();
  const version = await getYtdlpVersionFromPc(settings.get('ytdlpPath'));
  settings.set('ytdlpVersion', version);
  mainWindow.webContents.send('settings:updated', settings.getAll(), false);
}

export function updateYtdlp(_event: IpcMainEvent, channel: ReleaseChannel, version: string) {
  const builder = getUpdateCommand(channel, version);

  const { baseCommand, args, completeCommand } = builder.get();

  logger.info(`Update command: ${completeCommand}`);

  const child = spawn(baseCommand, args);

  child.stdout.setEncoding('utf-8');
  child.stderr.setEncoding('utf-8');

  mainWindow.webContents.send('yt-dlp:started-update');

  child.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  child.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  child.on('close', async (code, signal) => {
    console.log('Exit -> ', { code, signal });
    if (code === 0) {
      updateYtdlpVersionInSettings();
      mainWindow.webContents.send('yt-dlp:update-success');
    } else {
      mainWindow.webContents.send('yt-dlp:update-failed');
    }
  });
}
