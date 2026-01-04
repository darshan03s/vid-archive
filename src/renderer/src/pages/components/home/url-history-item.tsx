import { UrlHistoryItem as UrlHistoryItemType } from '@shared/types/history';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemMedia,
  ItemTitle
} from '@renderer/components/ui/item';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaInfoStore } from '@renderer/stores/media-info-store';
import { refreshUrlHistoryStore } from '@renderer/stores/utils';
import { Anchor, TooltipWrapper } from '@renderer/components/wrappers';
import { Badge } from '@renderer/components/ui/badge';
import { formatDate } from '@renderer/utils';
import Logo from '@renderer/components/logo';
import { IconExternalLink, IconInfoSquareRounded, IconPhoto, IconTrash } from '@tabler/icons-react';
import { Button } from '@renderer/components/ui/button';
import { MoreInfo } from './more-info';

export const UrlHistoryItem = ({ item }: { item: UrlHistoryItemType }) => {
  const [isMoreInfoModalOpen, setIsMoreInfoModalOpen] = useState(false);
  const navigate = useNavigate();

  function handleNavigateToDisplayInfo() {
    useMediaInfoStore.setState({ url: item.url, source: item.source, mediaInfo: {} });
    navigate('/display-media-info?updateUrlHistory=0');
  }

  function handleUrlHistoryItemDelete(id: string) {
    window.api.deleteFromUrlHistory(id).then(() => {
      refreshUrlHistoryStore();
    });
  }

  return (
    <>
      <Item size={'sm'} variant={'outline'} className="hover:bg-muted p-2 border-none">
        <ItemMedia
          className="aspect-video w-32 cursor-pointer relative"
          onClick={handleNavigateToDisplayInfo}
        >
          <img
            src={
              item.thumbnail_local.length === 0
                ? item.thumbnail
                : `image:///${encodeURIComponent(item.thumbnail_local)}`
            }
            alt={item.title}
            className="aspect-video rounded-sm outline-1"
          />
          <span className="bg-black text-white p-1 text-[9px] rounded absolute right-0.5 bottom-0.5">
            {item.duration || 'N/A'}
          </span>
        </ItemMedia>
        <ItemContent className="flex flex-col gap-3">
          <ItemTitle className="text-xs line-clamp-1">{item.title}</ItemTitle>
          <ItemDescription className="flex gap-2 items-center text-xs">
            {item.uploader && (
              <Anchor href={item.uploader_url}>
                <Badge variant={'outline'} className="text-[10px]">
                  {item.uploader}
                </Badge>
              </Anchor>
            )}
            <Badge variant={'outline'} className="text-[10px]">
              {formatDate(item.created_at)}
            </Badge>
          </ItemDescription>
        </ItemContent>
        <ItemFooter className="url-history-item-footer w-full">
          <div className="url-history-item-footer-left flex items-center gap-3">
            <TooltipWrapper message={`Source: ${item.source}`}>
              <span>
                <Logo source={item.source} />
              </span>
            </TooltipWrapper>
            <TooltipWrapper message={`More Info`}>
              <span onClick={() => setIsMoreInfoModalOpen(true)} className="cursor-pointer">
                <IconInfoSquareRounded className="size-4" />
              </span>
            </TooltipWrapper>
            <TooltipWrapper message={`Open in browser`}>
              <span>
                <Anchor href={item.url}>
                  <IconExternalLink className="size-4" />
                </Anchor>
              </span>
            </TooltipWrapper>
            <TooltipWrapper message={`Open thumbnail in browser`}>
              <span>
                <Anchor href={item.thumbnail}>
                  <IconPhoto className="size-4" />
                </Anchor>
              </span>
            </TooltipWrapper>
          </div>
          <div className="url-history-item-footer-right">
            <TooltipWrapper message={`Delete from history`} className="relative right-2">
              <Button
                onClick={() => handleUrlHistoryItemDelete(item.id)}
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
        <MoreInfo open={isMoreInfoModalOpen} setOpen={setIsMoreInfoModalOpen} item={item} />
      )}
    </>
  );
};
