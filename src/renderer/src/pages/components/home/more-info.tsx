import { UrlHistoryItem } from '@/shared/types/history';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@renderer/components/ui/dialog';
import { Anchor } from '@renderer/components/wrappers';
import { formatDate } from '@renderer/utils';
import { Dispatch, SetStateAction } from 'react';

export const MoreInfo = ({
  open,
  setOpen,
  item
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  item: UrlHistoryItem;
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-main font-semibold">Info</DialogTitle>
          <DialogDescription className="font-main">More info of url</DialogDescription>
        </DialogHeader>
        <div className="w-full font-main flex flex-col gap-2 text-xs overflow-auto">
          <div>
            <span className="font-semibold">Title</span>: <span>{item.title}</span>
          </div>
          <div>
            <span className="font-semibold">Source</span>: <span>{item.source}</span>
          </div>
          <div>
            <span className="font-semibold">URL</span>:{' '}
            <Anchor href={item.url} className="text-primary">
              {item.url}
            </Anchor>
          </div>
          <div>
            <span className="font-semibold">Created/Uploaded At</span>:{' '}
            <span>{formatDate(item.created_at)}</span>
          </div>
          <div>
            <span className="font-semibold">Duration</span>:{' '}
            <span>{item.duration.length === 0 ? 'N/A' : item.duration}</span>
          </div>
          <div>
            <span className="font-semibold">Uploader</span>: <span>{item.uploader}</span>
          </div>
          <div>
            <span className="font-semibold">Uploader URL</span>:{' '}
            <Anchor href={item.uploader_url || ''} className="text-primary">
              {item.uploader_url || 'N/A'}
            </Anchor>
          </div>
          <div>
            <span className="font-semibold">Thumbnail</span>:{' '}
            <Anchor href={item.thumbnail} className="overflow-auto text-primary">
              {item.thumbnail}
            </Anchor>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
