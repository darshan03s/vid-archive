import { ProgressDetails } from '@/shared/types/download';
import {
  DownloadsHistoryItem,
  DownloadsHistoryList,
  RunningDownloadItem,
  RunningDownloadsList
} from '@/shared/types/history';
import { Badge } from '@renderer/components/ui/badge';
import { Button } from '@renderer/components/ui/button';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemMedia,
  ItemTitle
} from '@renderer/components/ui/item';
import { TooltipWrapper } from '@renderer/components/wrappers';
import { Logo } from '@renderer/data/logo';
import { useEffect, useState } from 'react';

const Downloads = () => {
  const [runningDownloads, setRunningDownloads] = useState<RunningDownloadsList>([]);
  const [downloadsHistory, setDownloadsHistory] = useState<DownloadsHistoryList>([]);

  function updateDownloads() {
    window.api.getRunningDownloads().then((data) => {
      setRunningDownloads(data);
    });
    window.api.getDownloadsHistory().then((data) => {
      setDownloadsHistory(data);
    });
  }

  useEffect(() => {
    updateDownloads();
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
    <div className="w-full flex flex-col gap-2">
      <div className="px-2 py-2 h-8 flex items-center justify-between sticky top-0 left-0 bg-background text-foreground z-999">
        Downloads
      </div>
      <div className="px-2 py-2 pb-4">
        {runningDownloads && runningDownloads.length > 0 && (
          <RunningDownloads runningDownloads={runningDownloads} />
        )}
        <CompletedDownloads downloadsHistory={downloadsHistory} />
      </div>
    </div>
  );
};

export default Downloads;

const DownloadCard = ({
  downloadItem,
  progressDetails
}: {
  downloadItem: RunningDownloadItem | DownloadsHistoryItem;
  progressDetails?: ProgressDetails;
}) => {
  return (
    <Item size={'sm'} variant={'outline'} className="hover:bg-muted">
      <ItemMedia className="aspect-video w-32 cursor-pointer">
        <img
          src={
            downloadItem.thumbnail_local.length === 0
              ? downloadItem.thumbnail
              : `media:///${downloadItem.thumbnail_local}`
          }
          alt={downloadItem.title}
          className="aspect-video rounded-sm"
        />
      </ItemMedia>
      <ItemContent className="flex flex-col gap-2">
        <ItemTitle className="text-xs">{downloadItem.title}</ItemTitle>
        <ItemDescription className="flex flex-col gap-1 text-xs">
          <div>
            <Badge variant={'outline'} className="text-[10px]">
              {downloadItem.uploader}
            </Badge>
          </div>
          <div>
            <p className="line-clamp-1">
              {progressDetails?.progressString ?? downloadItem.download_progress_string}
            </p>
          </div>
        </ItemDescription>
      </ItemContent>
      <ItemFooter className="url-history-item-footer w-full">
        <div className="url-history-item-footer-left flex items-center gap-2">
          <TooltipWrapper message={`Source: ${downloadItem.source}`}>
            <Button variant="outline" size="icon-sm">
              <img src={Logo(downloadItem.source)} alt={downloadItem.source} className="size-4" />
            </Button>
          </TooltipWrapper>
        </div>
        <div className="url-history-item-footer-right"></div>
      </ItemFooter>
    </Item>
  );
};

const RunningDownloadItemComp = ({ downloadItem }: { downloadItem: RunningDownloadItem }) => {
  const [progressDetails, setProgressDetails] = useState<ProgressDetails>({
    progressString: downloadItem.download_progress_string
  });

  useEffect(() => {
    const unsubscribe = window.api.on(`download-progress:${downloadItem.id}`, (progressDetails) => {
      setProgressDetails(progressDetails as ProgressDetails);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="w-full">
      <DownloadCard downloadItem={downloadItem} progressDetails={progressDetails} />
    </div>
  );
};

const RunningDownloads = ({ runningDownloads }: { runningDownloads: RunningDownloadsList }) => {
  return (
    <div className="w-full space-y-2 pb-2">
      {runningDownloads?.map((downloadItem) => (
        <RunningDownloadItemComp key={downloadItem.id} downloadItem={downloadItem} />
      ))}
    </div>
  );
};

const CompletedDownloads = ({ downloadsHistory }: { downloadsHistory: DownloadsHistoryList }) => {
  return (
    <div className="w-full space-y-2">
      {downloadsHistory?.map((downloadItem) => (
        <DownloadCard key={downloadItem.id} downloadItem={downloadItem} />
      ))}
    </div>
  );
};
