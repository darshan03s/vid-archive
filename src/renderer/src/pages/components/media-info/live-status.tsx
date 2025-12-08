import { MediaInfoJson } from '@/shared/types/info-json';

const LiveStatus = ({ infoJson }: { infoJson: MediaInfoJson }) => {
  if (infoJson.was_live) {
    return (
      <span className="bg-red-500 text-white text-[12px] px-2 py-0.5 rounded-full">Was Live</span>
    );
  } else if (infoJson.is_live) {
    return (
      <span className="bg-red-500 text-white text-[12px] px-2 py-0.5 rounded-full">Live Now</span>
    );
  } else return null;
};

export default LiveStatus;
