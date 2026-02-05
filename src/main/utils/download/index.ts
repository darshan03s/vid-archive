import { LINKS } from '@main/data';
import { mkdir, writeFile } from 'node:fs/promises';
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

  if (process.platform === 'win32') {
    await download(LINKS.ffmpegWin, outputPath);
  }

  return outputPath;
}

export async function downloadQuickJS(targetDir: string): Promise<string> {
  await mkdir(targetDir, { recursive: true });
  const outputPath = path.join(targetDir, 'quickjs.7z');

  if (process.platform === 'win32') {
    await download(LINKS.quickJsWin, outputPath);
  }

  return outputPath;
}

export async function downloadYtDlpLatestRelease(targetDir: string): Promise<string> {
  await mkdir(targetDir, { recursive: true });
  // set yt-dlp path for windows
  const outputPath = path.join(targetDir, 'yt-dlp.exe');

  if (process.platform === 'win32') {
    await download(LINKS.ytdlpLatestReleaseWin, outputPath);
  }

  return outputPath;
}
