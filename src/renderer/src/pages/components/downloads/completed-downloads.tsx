import { DownloadHistoryList } from '@shared/types/history';
import { DownloadCard } from './download-card';

export const CompletedDownloads = ({
  downloadsHistory
}: {
  downloadsHistory: DownloadHistoryList;
}) => {
  return (
    <div className="w-full space-y-2">
      {downloadsHistory?.map((downloadItem) => (
        <DownloadCard key={downloadItem.id} downloadItem={downloadItem} />
      ))}
    </div>
  );
};
