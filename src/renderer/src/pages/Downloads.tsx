import { RunningDownloadsList } from '@/shared/types/history';
import { useEffect, useState } from 'react';
import { useHistoryStore } from '@renderer/stores/history-store';
import { useSearchStore } from '@renderer/stores/search-store';
import {
  CompletedDownloads,
  DownloadHistorySearchResults,
  DownloadsHeader,
  RunningDownloads
} from './components/downloads';

const Downloads = () => {
  const downloadHistory = useHistoryStore((state) => state.downloadHistory);
  const [runningDownloads, setRunningDownloads] = useState<RunningDownloadsList>([]);
  const [queuedDownloads, setQueuedDownloads] = useState<RunningDownloadsList>([]);

  const searchResults = useSearchStore((state) => state.downloadHistorySearchResults);

  function updateDownloads() {
    window.api.getRunningDownloads().then((data) => {
      setRunningDownloads(data);
    });
    window.api.getQueuedDownloads().then((data) => {
      setQueuedDownloads(data);
    });
    window.api.getDownloadHistory().then((data) => {
      useHistoryStore.setState({ downloadHistory: data });
    });
  }

  useEffect(() => {
    updateDownloads();
    useSearchStore.setState({ downloadHistorySearchResults: [] });
  }, []);

  useEffect(() => {
    const unsubscribe = window.api.on('refresh-downloads', () => {
      updateDownloads();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      <div className="w-full flex flex-col gap-2">
        <DownloadsHeader
          downloadHistory={downloadHistory}
          runningDownloads={runningDownloads}
          queuedDownloads={queuedDownloads}
        />
        <div className="px-2 py-1 pb-2">
          {runningDownloads && runningDownloads.length > 0 && (
            <RunningDownloads runningDownloads={runningDownloads} />
          )}
          {queuedDownloads && queuedDownloads.length > 0 && (
            <RunningDownloads runningDownloads={queuedDownloads} />
          )}
          {searchResults!.length > 0 ? (
            <DownloadHistorySearchResults downloadHistorySearchResults={searchResults} />
          ) : (
            <CompletedDownloads downloadsHistory={downloadHistory} />
          )}
        </div>
      </div>
    </>
  );
};

export default Downloads;
