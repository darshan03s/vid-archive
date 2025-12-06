import {
  DownloadHistoryList,
  ExtraCommandsHistoryList,
  UrlHistoryList
} from '@shared/types/history';
import { create } from 'zustand';

interface HistoryStore {
  urlHistory: UrlHistoryList;
  downloadHistory: DownloadHistoryList;
  extraCommandsHistory: ExtraCommandsHistoryList;
}

export const useHistoryStore = create<HistoryStore>(() => ({
  urlHistory: [],
  downloadHistory: [],
  extraCommandsHistory: []
}));
