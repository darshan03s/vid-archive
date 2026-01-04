import { useMediaInfoStore } from '@renderer/stores/media-info-store';
import { refreshDownloadHistoryInStore } from '@renderer/stores/utils';
import { ProgressDetails } from '@shared/types/download';
import { DownloadHistoryItem, RunningDownloadItem } from '@shared/types/history';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Item, ItemContent, ItemFooter, ItemMedia, ItemTitle } from '@renderer/components/ui/item';
import { Anchor, TooltipWrapper } from '@renderer/components/wrappers';
import { Badge } from '@renderer/components/ui/badge';
import { ProgressBar } from './progress-bar';
import Logo from '@renderer/components/logo';
import {
  IconExternalLink,
  IconFolder,
  IconInfoSquareRounded,
  IconPhoto,
  IconPlayerPause,
  IconPlayerPlay,
  IconReload,
  IconTrash
} from '@tabler/icons-react';
import { Button } from '@renderer/components/ui/button';
import { FilePlay } from 'lucide-react';
import { MoreInfo } from './more-info';
import { PlayMediaModal } from './play-media-modal';

export const DownloadCard = ({
  downloadItem,
  progressDetails
}: {
  downloadItem: RunningDownloadItem | DownloadHistoryItem;
  progressDetails?: ProgressDetails;
}) => {
  const [isMoreInfoModalOpen, setIsMoreInfoModalOpen] = useState(false);
  const [isPlayVideoModalOpen, setIsPlayVideoModalOpen] = useState(false);
  const navigate = useNavigate();

  function handleNavigateToDisplayInfo() {
    useMediaInfoStore.setState({
      url: downloadItem.url,
      source: downloadItem.source,
      mediaInfo: {}
    });
    navigate('/display-media-info?updateUrlHistory=0');
  }

  function handleDownloadsHistoryItemDelete(id: string) {
    window.api.deleteFromDownloadHistory(id).then(() => {
      refreshDownloadHistoryInStore();
    });
  }

  function handlePauseRunningDownload(id: string) {
    window.api.pauseRunningDownload(id);
  }

  function handlePauseQueuedDownload(id: string) {
    window.api.pauseQueuedDownload(id);
  }

  function handleResumePausedDownload(id: string) {
    window.api.resumePausedDownload(id);
  }

  function handleRetryFailedDownload(id: string) {
    window.api.retryFailedDownload(id);
  }

  function handlePlay() {
    setIsPlayVideoModalOpen(true);
  }

  function handlePlayInDefaultPlayer() {
    window.api.playMedia(downloadItem.download_path);
  }

  function handleShowInFolder() {
    window.api.showInFolder(downloadItem.download_path);
  }

  return (
    <>
      <Item size={'sm'} variant={'outline'} className="hover:bg-muted p-2 border-none">
        <ItemMedia
          onClick={() => handleNavigateToDisplayInfo()}
          className="aspect-video w-34 shrink-0 relative cursor-pointer"
        >
          <img
            src={
              downloadItem.thumbnail_local.length === 0
                ? downloadItem.thumbnail
                : `image:///${encodeURIComponent(downloadItem.thumbnail_local)}`
            }
            alt={downloadItem.title}
            className="aspect-video rounded-sm outline-1"
          />
          <span className="bg-black text-white p-1 text-[9px] rounded absolute right-0.5 bottom-0.5 font-main">
            {downloadItem.duration}
          </span>
        </ItemMedia>
        <ItemContent className="flex flex-col gap-2 min-w-0 font-main">
          <ItemTitle className="text-xs line-clamp-1">{downloadItem.title}</ItemTitle>
          <div className="flex flex-col gap-1 text-xs">
            <div className="flex items-center gap-2">
              <Anchor href={downloadItem.uploader_url}>
                <Badge variant={'outline'} className="text-[10px]">
                  {downloadItem.uploader}
                </Badge>
              </Anchor>
              <Badge variant={'outline'} className="text-[10px]">
                {downloadItem.format}
              </Badge>
              {downloadItem.start_time || downloadItem.end_time ? (
                <Badge variant="outline" className="text-[10px]">
                  {(downloadItem.start_time.length === 0 ? '00:00:00' : downloadItem.start_time) +
                    ' - ' +
                    downloadItem.end_time}
                </Badge>
              ) : (
                downloadItem.start_time || null
              )}
            </div>
            <div className="space-y-2">
              <p className="line-clamp-1 text-[10px] text-muted-foreground">
                {progressDetails?.progressString ?? downloadItem.download_progress_string}
              </p>
              <ProgressBar
                downloadStatus={downloadItem.download_status}
                value={progressDetails?.progressPercentage ?? downloadItem.download_progress}
              />
            </div>
          </div>
        </ItemContent>
        <ItemFooter className="downloads-history-item-footer w-full">
          <div className="downloads-history-item-footer-left flex items-center gap-3">
            <TooltipWrapper message={`Source: ${downloadItem.source}`}>
              <span>
                <Logo source={downloadItem.source} />
              </span>
            </TooltipWrapper>
            <TooltipWrapper message={`More Details`}>
              <span onClick={() => setIsMoreInfoModalOpen(true)} className="cursor-pointer">
                <IconInfoSquareRounded className="size-4" />
              </span>
            </TooltipWrapper>
            <TooltipWrapper message={`Open in browser`}>
              <span>
                <Anchor href={downloadItem.url}>
                  <IconExternalLink className="size-4" />
                </Anchor>
              </span>
            </TooltipWrapper>
            <TooltipWrapper message={`Open thumbnail in browser`}>
              <span>
                <Anchor href={downloadItem.thumbnail}>
                  <IconPhoto className="size-4" />
                </Anchor>
              </span>
            </TooltipWrapper>
          </div>
          <div className="downloads-history-item-footer-right flex items-center gap-2">
            <TooltipWrapper message={`Show in folder`}>
              <Button
                onClick={() => handleShowInFolder()}
                variant={'ghost'}
                size={'icon-sm'}
                className="size-6 rounded-sm"
              >
                <IconFolder className="size-4" />
              </Button>
            </TooltipWrapper>
            {downloadItem.download_status === 'completed' && (
              <>
                <TooltipWrapper message={`Play in default player`}>
                  <Button
                    onClick={() => handlePlayInDefaultPlayer()}
                    variant={'ghost'}
                    size={'icon-sm'}
                    className="size-6 rounded-sm"
                  >
                    <FilePlay className="size-4" />
                  </Button>
                </TooltipWrapper>
                <TooltipWrapper message={`Play`}>
                  <Button
                    onClick={() => handlePlay()}
                    variant={'ghost'}
                    size={'icon-sm'}
                    className="size-6 rounded-sm"
                  >
                    <IconPlayerPlay className="size-4" />
                  </Button>
                </TooltipWrapper>
              </>
            )}
            {downloadItem.download_status === 'downloading' && (
              <TooltipWrapper message={`Pause download`}>
                <Button
                  onClick={() => handlePauseRunningDownload(downloadItem.id)}
                  variant={'ghost'}
                  size={'icon-sm'}
                  className="size-6 rounded-sm"
                >
                  <IconPlayerPause className="size-4" />
                </Button>
              </TooltipWrapper>
            )}
            {downloadItem.download_status === 'waiting' && (
              <TooltipWrapper message={`Pause waiting download`}>
                <Button
                  onClick={() => handlePauseQueuedDownload(downloadItem.id)}
                  variant={'ghost'}
                  size={'icon-sm'}
                  className="size-6 rounded-sm"
                >
                  <IconPlayerPause className="size-4" />
                </Button>
              </TooltipWrapper>
            )}
            {downloadItem.download_status === 'paused' && (
              <TooltipWrapper message={`Resume download`}>
                <Button
                  onClick={() => handleResumePausedDownload(downloadItem.id)}
                  variant={'ghost'}
                  size={'icon-sm'}
                  className="size-6 rounded-sm"
                >
                  <IconPlayerPlay className="size-4" />
                </Button>
              </TooltipWrapper>
            )}
            {downloadItem.download_status === 'failed' && (
              <TooltipWrapper message={`Retry download`}>
                <Button
                  onClick={() => handleRetryFailedDownload(downloadItem.id)}
                  variant={'ghost'}
                  size={'icon-sm'}
                  className="size-6 rounded-sm"
                >
                  <IconReload className="size-4" />
                </Button>
              </TooltipWrapper>
            )}
            <TooltipWrapper message={`Delete from history`} className="relative right-2">
              <Button
                disabled={downloadItem.download_status === 'downloading'}
                onClick={() => handleDownloadsHistoryItemDelete(downloadItem.id)}
                variant={'ghost'}
                size={'icon-sm'}
                className="size-6 hover:bg-red-500/20 dark:hover:bg-red-500/20 rounded-sm"
              >
                <IconTrash className="size-4 text-red-500" />
              </Button>
            </TooltipWrapper>
          </div>
        </ItemFooter>
      </Item>
      {isMoreInfoModalOpen && (
        <MoreInfo open={isMoreInfoModalOpen} setOpen={setIsMoreInfoModalOpen} data={downloadItem} />
      )}
      {isPlayVideoModalOpen && (
        <PlayMediaModal
          open={isPlayVideoModalOpen}
          setOpen={setIsPlayVideoModalOpen}
          data={downloadItem}
        />
      )}
    </>
  );
};
