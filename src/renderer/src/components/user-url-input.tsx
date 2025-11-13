import { Button } from './ui/button';
import { ButtonGroup } from './ui/button-group';
import { Input } from './ui/input';
import { IconCloudDown, IconReload } from '@tabler/icons-react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { useState } from 'react';

const UserUrlInput = () => {
  const [userEnteredUrl, setUserEnteredUrl] = useState('');

  function handleRefetchMediaInfo() {
    // TODO
    console.log(userEnteredUrl);
  }

  function handleFetchMediaInfo() {
    // TODO
    console.log(userEnteredUrl);
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
      <Tooltip>
        <TooltipTrigger asChild>
          <Button onClick={handleRefetchMediaInfo}>
            <IconReload />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Refetch</TooltipContent>
      </Tooltip>
      <Input
        placeholder="Enter a URL"
        className="placeholder:text-sm"
        onChange={handleUrlInput}
        onKeyDown={handleUrlInputEnter}
      />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button onClick={handleFetchMediaInfo}>
            <IconCloudDown />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Fetch</TooltipContent>
      </Tooltip>
    </ButtonGroup>
  );
};

export default UserUrlInput;
