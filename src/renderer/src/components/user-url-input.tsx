import { Button } from './ui/button';
import { ButtonGroup } from './ui/button-group';
import { Input } from './ui/input';
import { IconCloudDown, IconReload } from '@tabler/icons-react';
import { useState } from 'react';
import { useMediaInfoStore } from '@renderer/stores/media-info-store';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import logger from '@shared/logger';
import { TooltipWrapper } from './wrappers';
import { Source } from '@/shared/types';

type UserUrlInputProps = {
  showRefetch: boolean;
};

const UserUrlInput = ({ showRefetch }: UserUrlInputProps) => {
  const [userEnteredUrl, setUserEnteredUrl] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const url = useMediaInfoStore((state) => state.url);
  const source = useMediaInfoStore((state) => state.source) as Source;

  function isUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  function handleRefetchMediaInfo() {
    useMediaInfoStore.setState({ mediaInfo: {} });
    window.api.getMediaInfoJson(url, source, false, true);
  }

  async function handleFetchMediaInfo() {
    if (!isUrl(userEnteredUrl)) return;
    const { source, url, isMediaDisplayAvailable } = await window.api.checkUrl(userEnteredUrl);
    logger.info({ source, url, isMediaDisplayAvailable });
    if (isMediaDisplayAvailable) {
      useMediaInfoStore.setState({ source: source, url: url, mediaInfo: {} });
      navigate('/display-media-info?updateUrlHistory=1');
    } else {
      toast.error('Source not supported');
    }
  }

  function handleUrlInput(e: React.ChangeEvent<HTMLInputElement>) {
    setUserEnteredUrl(e.target.value);
  }

  function handleUrlInputEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleFetchMediaInfo();
    }
  }
  return (
    <ButtonGroup className="w-full">
      <Input
        placeholder="Enter a URL"
        className="placeholder:text-xs text-xs font-satoshi placeholder:font-satoshi select-text h-8"
        type="url"
        onChange={handleUrlInput}
        onKeyDown={handleUrlInputEnter}
        value={isHome ? userEnteredUrl : url}
        disabled={!!url && !isHome}
      />
      {showRefetch ? (
        <TooltipWrapper message="Refetch" side="bottom">
          <Button onClick={handleRefetchMediaInfo} variant={'default'} className="h-8">
            <IconReload />
          </Button>
        </TooltipWrapper>
      ) : (
        <TooltipWrapper message="Fetch" side="bottom">
          <Button onClick={handleFetchMediaInfo} variant={'default'} className="h-8">
            <IconCloudDown />
          </Button>
        </TooltipWrapper>
      )}
    </ButtonGroup>
  );
};

export default UserUrlInput;
