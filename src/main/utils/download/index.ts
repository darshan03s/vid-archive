import { LINKS } from '@main/data';
import { chmod, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fetch } from 'undici';

async function download(link: string, outputPath: string) {
  const res = await fetch(link);
  if (!res.ok) throw new Error(`Failed to download: ${res.status}`);

  const buffer = Buffer.from(await res.arrayBuffer());
  await writeFile(outputPath, buffer);
}

export async function downloadFfmpeg7z(targetDir: string): Promise<string> {
  await mkdir(targetDir, { recursive: true });
  const outputPath = path.join(targetDir, 'ffmpeg.7z');

  // download ffmpeg for windows, linux
  if (process.platform === 'win32') {
    await download(LINKS.ffmpegWin, outputPath);
  } else {
    await download(LINKS.ffmpegLinux, outputPath);
  }

  return outputPath;
}

export async function downloadQuickJS(targetDir: string): Promise<string> {
  await mkdir(targetDir, { recursive: true });
  const outputPath = path.join(targetDir, 'quickjs.7z');

  // download quickjs for windows, linux
  if (process.platform === 'win32') {
    await download(LINKS.quickJsWin, outputPath);
  } else {
    await download(LINKS.quickJsLinux, outputPath);
  }

  return outputPath;
}

export async function downloadYtDlpLatestRelease(targetDir: string): Promise<string> {
  await mkdir(targetDir, { recursive: true });
  // set yt-dlp path for windows
  let outputPath = path.join(targetDir, 'yt-dlp.exe');

  if (process.platform === 'linux') {
    outputPath = path.join(targetDir, 'yt-dlp');
  }

  // download yt-dlp for windows
  if (process.platform === 'win32') {
    await download(LINKS.ytdlpLatestReleaseWin, outputPath);
  } else {
    await download(LINKS.ytdlpLatestReleaseLinux, outputPath);
    await chmod(outputPath, 0o755);
  }

  return outputPath;
}
