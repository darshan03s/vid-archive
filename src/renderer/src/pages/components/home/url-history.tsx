import { useHistoryStore } from '@renderer/stores/history-store';
import { useSearchStore } from '@renderer/stores/search-store';
import { refreshUrlHistoryStore } from '@renderer/stores/utils';
import { useEffect, useState } from 'react';
import { UrlHistoryItem } from './url-history-item';
import { UrlHistorySearch } from './url-history-search';
import { TooltipWrapper } from '@renderer/components/wrappers';
import { Button } from '@renderer/components/ui/button';
import { IconTrash } from '@tabler/icons-react';
import { ConfirmDeleteAllModal } from './confirm-delete-all-modal';

export const UrlHistory = () => {
  const [isConfirmDeleteAllModalOpen, setIsConfirmDeleteAllModalOpen] = useState(false);

  const urlHistory = useHistoryStore((state) => state.urlHistory);
  const searchResults = useSearchStore((state) => state.urlSearchResults);

  useEffect(() => {
    refreshUrlHistoryStore();
    useSearchStore.setState({ urlSearchResults: [] });
  }, []);

  function handleUrlHistoryDelete() {
    setIsConfirmDeleteAllModalOpen(true);
  }

  const UrlHistoryListComp = () => (
    <>
      {urlHistory?.map((item) => (
        <UrlHistoryItem key={item.id} item={item} />
      ))}
    </>
  );

  const UrlHistorySearchResultsComp = () => (
    <>
      {searchResults?.map((item) => (
        <UrlHistoryItem key={item.id} item={item} />
      ))}
    </>
  );

  return (
    <>
      <div className="w-full px-3 flex items-center justify-between h-10">
        <span className="text-xs">Url History ({urlHistory?.length})</span>
        <div className="flex items-center gap-4">
          <UrlHistorySearch />
          <TooltipWrapper message={`Delete url history`} className="relative right-2">
            <Button
              disabled={urlHistory?.length === 0}
              onClick={() => handleUrlHistoryDelete()}
              variant={'destructive'}
              size={'icon-sm'}
              className="size-6 rounded-sm"
            >
              <IconTrash className="size-4" />
            </Button>
          </TooltipWrapper>
        </div>
      </div>
      <div className="p-2 flex flex-col gap-2">
        {searchResults!.length > 0 ? <UrlHistorySearchResultsComp /> : <UrlHistoryListComp />}
      </div>

      <ConfirmDeleteAllModal
        open={isConfirmDeleteAllModalOpen}
        setOpen={setIsConfirmDeleteAllModalOpen}
      />
    </>
  );
};
