import { TooltipWrapper } from '@renderer/components/wrappers';
import { DownloadHistorySearch } from './download-history-search';
import { OptionsDropdown } from './options-dropdown';
import { DownloadHistoryList, RunningDownloadsList } from '@shared/types/history';

type DownloadsHeaderProps = {
  downloadHistory: DownloadHistoryList;
  runningDownloads: RunningDownloadsList;
  queuedDownloads: RunningDownloadsList;
};

export const DownloadsHeader = ({
  downloadHistory,
  runningDownloads,
  queuedDownloads
}: DownloadsHeaderProps) => {
  return (
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
  );
};
