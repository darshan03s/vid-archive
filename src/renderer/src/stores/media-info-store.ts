import { Source } from '@/shared/types';
import { MediaInfoJson } from '@/shared/types/info-json';
import { create } from 'zustand';

interface MediaInfoStore {
  url: string;
  source: Source | null;
  mediaInfo: MediaInfoJson | object;
}

export const useMediaInfoStore = create<MediaInfoStore>(() => ({
  url: '',
  source: null,
  mediaInfo: {}
}));
