import { RunningDownloadsList } from '@/shared/types/history';
import { TooltipWrapper } from '@renderer/components/wrappers';
import { useEffect, useState } from 'react';
import { useHistoryStore } from '@renderer/stores/history-store';
import { useSearchStore } from '@renderer/stores/search-store';
import {
  CompletedDownloads,
  DownloadHistorySearch,
  DownloadHistorySearchResults,
  OptionsDropdown,
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
        <div className="px-3 py-2 h-12 text-sm flex items-center justify-between sticky top-0 left-0 bg-background/60 backdrop-blur-md text-foreground z-49">
          <span className="text-xs flex items-center gap-2 font-main">
            Downloads
            <span>
              <span title="History">({downloadHistory?.length})</span>
              {runningDownloads && runningDownloads?.length > 0 && (
                <span title="Running">({runningDownloads?.length})</span>
              )}
              {queuedDownloads && queuedDownloads?.length > 0 && (
                <span title="Queued">({queuedDownloads?.length})</span>
              )}
            </span>
          </span>
          <div className="flex items-center gap-4">
            <DownloadHistorySearch />
            <TooltipWrapper side="bottom" message={`Options`}>
              <OptionsDropdown />
            </TooltipWrapper>
          </div>
        </div>
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
