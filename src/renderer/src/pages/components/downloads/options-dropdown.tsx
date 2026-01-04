import { Button } from '@renderer/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu';
import { useHistoryStore } from '@renderer/stores/history-store';
import {
  IconClockFilled,
  IconDotsVertical,
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconReload,
  IconTrash
} from '@tabler/icons-react';
import { useState } from 'react';
import { ConfirmDeleteAllModal } from './confirm-delete-all-modal';

export const OptionsDropdown = () => {
  const downloadHistory = useHistoryStore((state) => state.downloadHistory);
  const [isConfirmDeleteAllModalOpen, setIsConfirmDeleteAllModalOpen] = useState(false);

  function handleUrlHistoryDelete() {
    setIsConfirmDeleteAllModalOpen(true);
  }

  function handlePauseAllDownloads() {
    window.api.pauseAllDownloads();
  }

  function handlePauseQueuedDownloads() {
    window.api.pauseQueuedDownloads();
  }

  function handleResumePausedDownloads() {
    window.api.resumePausedDownloads();
  }

  function handleRetryFailedDownloads() {
    window.api.retryFailedDownloads();
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant={'secondary'} size={'icon-sm'} className="size-7">
          <IconDotsVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        className="relative right-6 top-1 flex flex-col gap-2 font-main"
      >
        <DropdownMenuItem
          onClick={handlePauseAllDownloads}
          className="text-xs flex items-center gap-2 cursor-pointer"
        >
          <IconPlayerPauseFilled className="size-3.5" />
          Pause all downloads
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handlePauseQueuedDownloads}
          className="text-xs flex items-center gap-2 cursor-pointer"
        >
          <IconClockFilled className="size-3.5" />
          Pause waiting downloads
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleResumePausedDownloads}
          className="text-xs flex items-center gap-2 cursor-pointer"
        >
          <IconPlayerPlayFilled className="size-3.5" />
          Resume paused downloads
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleRetryFailedDownloads}
          className="text-xs flex items-center gap-2 cursor-pointer"
        >
          <IconReload className="size-3.5" />
          Retry failed downloads
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={downloadHistory?.length === 0}
          onClick={() => handleUrlHistoryDelete()}
          variant={'destructive'}
          className="text-xs flex items-center gap-2 cursor-pointer"
        >
          <IconTrash className="size-3.5" />
          Delete download history
        </DropdownMenuItem>
      </DropdownMenuContent>
      <ConfirmDeleteAllModal
        open={isConfirmDeleteAllModalOpen}
        setOpen={setIsConfirmDeleteAllModalOpen}
      />
    </DropdownMenu>
  );
};
