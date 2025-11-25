import { YoutubePlaylistInfoJson } from './info-json/youtube-playlist';
import { YoutubeFormat, YoutubeVideoInfoJson } from './info-json/youtube-video';

export type DownloadSections = {
  startTime: string;
  endTime: string;
  forceKeyframesAtCuts: boolean;
};

export type DownloadOptions = {
  downloadId: string;
  selectedFormat: Partial<YoutubeFormat>;
  downloadSections: DownloadSections;
  selectedDownloadFolder: string;
  url: string;
  source: string;
  mediaInfo: YoutubeVideoInfoJson | YoutubePlaylistInfoJson | object;
};

export type ProgressDetails = {
  progressString: string;
  progressPercentage?: number;
};
