import { Source } from '@/shared/types';
import { YoutubePlaylistInfoJson } from '@/shared/types/info-json/youtube-playlist';
import { YoutubeVideoInfoJson } from '@/shared/types/info-json/youtube-video';
import { create } from 'zustand';

interface MediaInfoStore {
  url: string;
  source: Source | string;
  mediaInfo: YoutubeVideoInfoJson | YoutubePlaylistInfoJson | object;
}

export const useMediaInfoStore = create<MediaInfoStore>(() => ({
  url: '',
  source: '',
  mediaInfo: {}
}));
