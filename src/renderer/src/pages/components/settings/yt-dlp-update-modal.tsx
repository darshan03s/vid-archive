import { useYtdlpVersionsStore } from '@renderer/stores/yt-dlp-versions-store';
import { Dispatch, SetStateAction, useState } from 'react';
import { ReleaseChannel } from 'yt-dlp-command-builder';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/select';
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

export const YtdlpUpdateModal = ({
  open,
  setOpen
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const versions = useYtdlpVersionsStore((state) => state.versions);

  function handleUpdate(channel: ReleaseChannel, version: string) {
    window.api.updateYtdlp(channel, version);
  }

  const UpdateToStable = () => {
    const [selectedVersion, setSelectedVersion] = useState<string>(versions.stable[0]);
    return (
      <div className="flex items-center justify-between">
        <span>Stable</span>
        <div className="w-[300px] flex items-center gap-2">
          <Select value={selectedVersion} onValueChange={(val) => setSelectedVersion(val)}>
            <SelectTrigger size="sm" className="w-full text-[10px]">
              <SelectValue placeholder="Select a version" />
            </SelectTrigger>
            <SelectContent position="popper" className="text-sm max-h-60 overflow-y-auto">
              <SelectGroup>
                <SelectLabel>Versions</SelectLabel>
                {versions.stable.map((version) => (
                  <SelectItem key={version} value={version}>
                    {version}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            size={'sm'}
            className="text-xs"
            onClick={() => handleUpdate('stable', selectedVersion)}
          >
            Update
          </Button>
        </div>
      </div>
    );
  };

  const UpdateToMaster = () => {
    const [selectedVersion, setSelectedVersion] = useState<string>(versions.master[0]);
    return (
      <div className="flex items-center justify-between">
        <span>Master</span>
        <div className="w-[300px] flex items-center gap-2">
          <Select value={selectedVersion} onValueChange={(val) => setSelectedVersion(val)}>
            <SelectTrigger size="sm" className="w-full text-[10px]">
              <SelectValue placeholder="Select a version" />
            </SelectTrigger>
            <SelectContent className="text-sm">
              <SelectGroup>
                <SelectLabel>Versions</SelectLabel>
                {versions.master.map((version) => (
                  <SelectItem key={version} value={version} className="capitalize">
                    {version}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            size={'sm'}
            className="text-xs"
            onClick={() => handleUpdate('master', selectedVersion)}
          >
            Update
          </Button>
        </div>
      </div>
    );
  };

  const UpdateToNightly = () => {
    const [selectedVersion, setSelectedVersion] = useState<string>(versions.nightly[0]);
    return (
      <div className="flex items-center justify-between">
        <span>Nightly</span>
        <div className="w-[300px] flex items-center gap-2">
          <Select value={selectedVersion} onValueChange={(val) => setSelectedVersion(val)}>
            <SelectTrigger size="sm" className="w-full text-[10px]">
              <SelectValue placeholder="Select a version" />
            </SelectTrigger>
            <SelectContent className="text-sm">
              <SelectGroup>
                <SelectLabel>Versions</SelectLabel>
                {versions.nightly.map((version) => (
                  <SelectItem key={version} value={version} className="capitalize">
                    {version}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            size={'sm'}
            className="text-xs"
            onClick={() => handleUpdate('nightly', selectedVersion)}
          >
            Update
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="font-main">
        <DialogHeader>
          <DialogTitle className="font-main">Update yt-dlp</DialogTitle>
          <DialogDescription className="font-main"></DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <UpdateToStable />
          <UpdateToMaster />
          <UpdateToNightly />
        </div>
        <DialogFooter className="flex ">
          <DialogClose asChild>
            <Button variant={'outline'}>Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
