import { DownloadHistoryList, UrlHistoryList } from '@shared/types/history';
import { useHistoryStore } from './history-store';

export function refreshUrlHistoryStore() {
  window.api.getUrlHistory().then((urlHistory: UrlHistoryList) => {
    useHistoryStore.setState({ urlHistory: urlHistory ?? [] });
  });
}

export function refreshDownloadHistoryInStore() {
  window.api.getDownloadHistory().then((downloadsHistory: DownloadHistoryList) => {
    useHistoryStore.setState({ downloadHistory: downloadsHistory ?? [] });
  });
}
