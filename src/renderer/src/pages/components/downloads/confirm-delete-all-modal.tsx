import { refreshDownloadHistoryInStore } from '@renderer/stores/utils';
import { Dispatch, SetStateAction } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@renderer/components/ui/dialog';
import { Button } from '@renderer/components/ui/button';

export const ConfirmDeleteAllModal = ({
  open,
  setOpen
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  function handleConfirmDeleteAll() {
    window.api.deleteAllDownloadHistory().then(() => {
      refreshDownloadHistoryInStore();
    });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="font-main">
        <DialogHeader>
          <DialogTitle className="font-main">Delete all download history?</DialogTitle>
          <DialogDescription className="font-main">
            This action will delete all download history
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex ">
          <DialogClose asChild>
            <Button variant={'outline'}>Cancel</Button>
          </DialogClose>
          <Button onClick={handleConfirmDeleteAll} variant={'destructive'}>
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
