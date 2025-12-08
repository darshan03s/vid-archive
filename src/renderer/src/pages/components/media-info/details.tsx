import { MediaInfoJson } from '@/shared/types/info-json';
import { formatDate } from '@renderer/utils';
import { IconCircleCheckFilled, IconClockHour3Filled } from '@tabler/icons-react';
import { useState } from 'react';
import LiveStatus from './live-status';
import DownloadButton from './download-button';
import Formats from './formats';
import DownloadSections from './download-sections';
import DownloadLocation from './download-location';
import ExtraOptions from './extra-options';
import MoreDetailsModal from './more-details-modal';

const Details = ({ infoJson }: { infoJson: MediaInfoJson }) => {
  const [isMoreDetailsModalOpen, setIsMoreDetailsModalOpen] = useState(false);
  const isInfoJsonEmpty = Object.keys(infoJson).length === 0;

  return (
    <>
      <div className="flex flex-col gap-2">
        {isInfoJsonEmpty ? (
          <div className="border bg-secondary h-10 px-2 rounded-md animate-fast" />
        ) : (
          <div
            onClick={() => setIsMoreDetailsModalOpen(true)}
            className="text-xs border bg-secondary text-secondary-foreground h-10 px-2 rounded-md cursor-pointer flex items-center"
          >
            <p className="text-xs leading-5 line-clamp-1">
              {infoJson.fulltitle ?? infoJson.title ?? 'N/A'}
            </p>
          </div>
        )}
        <div className="py-1 flex items-center justify-between">
          {!isInfoJsonEmpty ? (
            <div className="flex items-center gap-2 flex-1">
              {infoJson.uploader && (
                <span className="text-xs inline-flex items-center gap-1 outline-1 p-1 px-2 rounded-full">
                  {infoJson.channel_is_verified ? (
                    <IconCircleCheckFilled className="size-3" />
                  ) : null}
                  {infoJson.uploader}
                </span>
              )}
              {infoJson.upload_date && (
                <span className="text-xs inline-flex items-center gap-1 outline-1 p-1 px-2 rounded-full">
                  <IconClockHour3Filled className="size-3" />
                  {formatDate(infoJson.upload_date || '')}
                </span>
              )}
              <span className="text-xs inline-flex items-center gap-1">
                <LiveStatus infoJson={infoJson} />
              </span>
            </div>
          ) : (
            <div className="flex-1"></div>
          )}

          <div>
            <DownloadButton loading={isInfoJsonEmpty} />
          </div>
        </div>

        <div className="formats-display">
          <Formats infoJson={infoJson} loading={isInfoJsonEmpty} />
        </div>

        {!infoJson.is_live && (
          <div className="download-sections pt-2">
            <h1 className="text-xs border-border border-b mb-2 pb-1">Download Sections</h1>
            <DownloadSections loading={isInfoJsonEmpty} />
          </div>
        )}

        <div className="download-location pt-2">
          <h1 className="text-xs border-border border-b mb-2 pb-1">Download Location</h1>
          <DownloadLocation loading={isInfoJsonEmpty} />
        </div>

        {!isInfoJsonEmpty && (
          <div className="extra-options pt-2">
            <ExtraOptions />
          </div>
        )}
      </div>

      {!isInfoJsonEmpty && (
        <MoreDetailsModal
          open={isMoreDetailsModalOpen}
          setOpen={setIsMoreDetailsModalOpen}
          infoJson={infoJson}
        />
      )}
    </>
  );
};

export default Details;
