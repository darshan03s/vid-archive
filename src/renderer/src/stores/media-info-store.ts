import { create } from 'zustand';

interface MediaInfoStore {
  url: string;
  source: string;
  mediaInfo: object;
}

export const useMediaInfoStore = create<MediaInfoStore>(() => ({
  url: '',
  source: '',
  mediaInfo: {}
}));
