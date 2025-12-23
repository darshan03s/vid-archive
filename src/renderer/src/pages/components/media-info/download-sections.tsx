import { Input } from '@renderer/components/ui/input';
import { Toggle } from '@renderer/components/ui/toggle';
import { useSelectedOptionsStore } from '@renderer/stores/selected-options-store';
import { IconKeyframes } from '@tabler/icons-react';
import { useEffect } from 'react';

const DownloadSections = ({ loading }: { loading: boolean }) => {
  const downloadSections = useSelectedOptionsStore((state) => state.downloadSections);
  const setDownloadSections = useSelectedOptionsStore((state) => state.setDownloadSections);

  useEffect(() => {
    setDownloadSections({ startTime: '', endTime: '', forceKeyframesAtCuts: false });
  }, []);

  function handleStarttime(e: React.ChangeEvent<HTMLInputElement>) {
    setDownloadSections({ startTime: e.currentTarget.value });
  }

  function handleEndtime(e: React.ChangeEvent<HTMLInputElement>) {
    setDownloadSections({ endTime: e.currentTarget.value });
  }

  function handleToggle(pressed: boolean) {
    setDownloadSections({ forceKeyframesAtCuts: pressed });
  }

  return (
    <div className="flex items-center gap-2 font-satoshi">
      <Input
        disabled={loading}
        type="text"
        placeholder="Start Time (HH:MM:SS)"
        value={downloadSections.startTime}
        onChange={handleStarttime}
        className="text-xs h-8"
      />
      <Input
        disabled={loading}
        type="text"
        placeholder="End Time (HH:MM:SS)"
        value={downloadSections.endTime}
        onChange={handleEndtime}
        className="text-xs h-8"
      />
      <Toggle
        disabled={loading}
        title="Force keyframes at cuts"
        pressed={downloadSections.forceKeyframesAtCuts}
        onPressedChange={handleToggle}
        size="sm"
        variant="outline"
        className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-primary data-[state=on]:*:[svg]:stroke-primary"
      >
        <IconKeyframes />
      </Toggle>
    </div>
  );
};

export default DownloadSections;
