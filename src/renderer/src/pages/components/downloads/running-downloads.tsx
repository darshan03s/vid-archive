import { RunningDownloadsList } from '@shared/types/history';
import { RunningDownloadItemComp } from './running-download-item-comp';

export const RunningDownloads = ({
  runningDownloads
}: {
  runningDownloads: RunningDownloadsList;
}) => {
  return (
    <div className="w-full space-y-2 pb-2">
      {runningDownloads?.map((downloadItem) => (
        <RunningDownloadItemComp key={downloadItem.id} downloadItem={downloadItem} />
      ))}
    </div>
  );
};
