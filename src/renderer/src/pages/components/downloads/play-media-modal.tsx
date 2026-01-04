import { DownloadHistoryItem, RunningDownloadItem } from '@shared/types/history';
import { Dispatch, SetStateAction } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@renderer/components/ui/dialog';
import { isAudio } from '@shared/utils';

export const PlayMediaModal = ({
  open,
  setOpen,
  data
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  data: RunningDownloadItem | DownloadHistoryItem;
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="font-main">
        <DialogHeader>
          <DialogTitle>Play media</DialogTitle>
          <DialogDescription className="line-clamp-1"></DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          {isAudio(data.download_path) || data.format.includes('audio only') ? (
            <audio
              controls
              controlsList="nofullscreen"
              autoPlay
              className="w-full"
              src={`playmedia://audio/${encodeURIComponent(data.download_path)}`}
            />
          ) : (
            <video
              className="w-[500px] aspect-video rounded-md outline-1"
              controls
              controlsList="nofullscreen"
              autoPlay
              src={`playmedia://video/${encodeURIComponent(data.download_path)}`}
            />
          )}
          <p className="text-sm">{data.title}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
