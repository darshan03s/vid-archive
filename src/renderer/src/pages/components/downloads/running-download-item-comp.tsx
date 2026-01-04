import { ProgressDetails } from '@shared/types/download';
import { RunningDownloadItem } from '@shared/types/history';
import { useEffect, useState } from 'react';
import { DownloadCard } from './download-card';

export const RunningDownloadItemComp = ({
  downloadItem
}: {
  downloadItem: RunningDownloadItem;
}) => {
  const [progressDetails, setProgressDetails] = useState<ProgressDetails>({
    progressString: downloadItem.download_progress_string,
    progressPercentage: downloadItem.download_progress
  });

  useEffect(() => {
    const unsubscribe = window.api.on(`download-progress:${downloadItem.id}`, (progressDetails) => {
      setProgressDetails(progressDetails as ProgressDetails);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="w-full">
      <DownloadCard downloadItem={downloadItem} progressDetails={progressDetails} />
    </div>
  );
};
