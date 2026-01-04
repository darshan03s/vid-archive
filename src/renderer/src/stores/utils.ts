import { UrlHistoryList } from '@shared/types/history';
import { useHistoryStore } from './history-store';

export function refreshUrlHistoryStore() {
  window.api.getUrlHistory().then((urlHistory: UrlHistoryList) => {
    useHistoryStore.setState({ urlHistory: urlHistory ?? [] });
  });
}
