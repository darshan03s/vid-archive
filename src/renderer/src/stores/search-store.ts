import { DownloadHistoryList, UrlHistoryList } from '@/shared/types/history';
import { create } from 'zustand';

interface SearchStore {
  urlSearchInput: string;
  urlSearchResults: UrlHistoryList;
  downloadSearchInput: string;
  downloadHistorySearchResults: DownloadHistoryList;
}

export const useSearchStore = create<SearchStore>(() => ({
  urlSearchInput: '',
  urlSearchResults: [],
  downloadSearchInput: '',
  downloadHistorySearchResults: []
}));
