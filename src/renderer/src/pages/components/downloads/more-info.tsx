import { DownloadHistoryItem, RunningDownloadItem } from '@shared/types/history';
import { Dispatch, SetStateAction, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@renderer/components/ui/dialog';
import { Anchor } from '@renderer/components/wrappers';
import { AutoScrollTextarea } from './auto-scroll-textarea';
import { Button } from '@renderer/components/ui/button';

export const MoreInfo = ({
  open,
  setOpen,
  data
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  data: RunningDownloadItem | DownloadHistoryItem;
}) => {
  const [isShowLogsVisible, setIsShowLogsVisible] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="font-main">
        <DialogHeader>
          <DialogTitle className="font-main">Info</DialogTitle>
          <DialogDescription className="font-main">More info of download</DialogDescription>
        </DialogHeader>
        <div className="w-full flex flex-col gap-2 text-xs h-68 overflow-y-auto px-1 pb-2">
          <div>
            <span className="font-semibold">Title</span>: <span>{data.title}</span>
          </div>
          <div>
            <span className="font-semibold">Source</span>: <span>{data.source}</span>
          </div>
          <div>
            <span className="font-semibold">URL</span>:{' '}
            <Anchor href={data.url} className="text-primary">
              {data.url}
            </Anchor>
          </div>
          <div>
            <span className="font-semibold">Uploader</span>: <span>{data.uploader}</span>
          </div>
          <div>
            <span className="font-semibold">Uploader URL</span>:{' '}
            <Anchor href={data.uploader_url || ''} className="text-primary">
              {data.uploader_url || 'N/A'}
            </Anchor>
          </div>
          <div>
            <span className="font-semibold">Thumbnail</span>:{' '}
            <Anchor href={data.thumbnail} className="text-primary">
              {data.thumbnail}
            </Anchor>
          </div>
          <div>
            <span className="font-semibold">Selected Format</span>: <span>{data.format}</span>
          </div>
          {data.start_time.length > 0 && (
            <div>
              <span className="font-semibold">Start Time</span>: <span>{data.start_time}</span>
            </div>
          )}
          {data.end_time.length > 0 && (
            <div>
              <span className="font-semibold">End Time</span>: <span>{data.end_time}</span>
            </div>
          )}
          <div>
            <span className="font-semibold">Download Status</span>:{' '}
            <span>{data.download_status}</span>
          </div>
          <div>
            <span className="font-semibold">Added At</span>:{' '}
            <span>{new Date(data.added_at!).toLocaleString()}</span>
          </div>
          {data.download_status !== 'downloading' && data.download_completed_at && (
            <div>
              <span className="font-semibold">Completed At</span>:{' '}
              <span>{new Date(data.download_completed_at).toLocaleString()}</span>
            </div>
          )}
          <div>
            <span className="font-semibold">Download Path</span>: <span>{data.download_path}</span>
          </div>

          <div className="w-full flex flex-col gap-3 text-xs">
            <textarea
              name="command"
              value={data.command}
              className="h-44 outline-2 p-2 cursor-text resize-none rounded-md font-mono leading-4.5 overflow-y-auto"
              disabled
            />

            {data.download_status !== 'downloading' ? (
              isShowLogsVisible ? (
                <AutoScrollTextarea
                  name="output"
                  value={data.complete_output}
                  className="h-44 outline-2 p-2 text-muted-foreground bg-muted resize-none rounded-md font-mono leading-4.5 overflow-y-auto"
                  disabled
                />
              ) : (
                <Button
                  size={'sm'}
                  className="text-xs h-8"
                  variant={'secondary'}
                  onClick={() => setIsShowLogsVisible(true)}
                >
                  Show logs
                </Button>
              )
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
