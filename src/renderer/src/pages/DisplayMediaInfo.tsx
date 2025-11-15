import UserUrlInput from '@renderer/components/user-url-input';
import { useMediaInfoStore } from '@renderer/stores/media-info-store';
import YoutubeVideoInfo from './components/youtube/YoutubeVideoInfo';

const DisplayMediaInfo = () => {
  const url = useMediaInfoStore((state) => state.url);
  const source = useMediaInfoStore((state) => state.source);
  return (
    <div>
      <header className="bg-secondary text-secondary-foreground font-inter p-3">
        <UserUrlInput showRefetch={true} url={url} />
      </header>

      {source === 'youtube' && <YoutubeVideoInfo url={url} />}
    </div>
  );
};

export default DisplayMediaInfo;
