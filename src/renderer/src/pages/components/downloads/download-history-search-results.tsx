import { DownloadHistoryList } from '@shared/types/history';
import { DownloadCard } from './download-card';

export const DownloadHistorySearchResults = ({
  downloadHistorySearchResults
}: {
  downloadHistorySearchResults: DownloadHistoryList;
}) => {
  return (
    <div className="w-full space-y-2">
      {downloadHistorySearchResults?.map((downloadItem) => (
        <DownloadCard key={downloadItem.id} downloadItem={downloadItem} />
      ))}
    </div>
  );
};
