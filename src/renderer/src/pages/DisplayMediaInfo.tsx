import UserUrlInput from '@renderer/components/user-url-input';
import { useMediaInfoStore } from '@renderer/stores/media-info-store';
import YoutubeVideoInfo from './components/youtube/youtube-video-info';
import { Source } from '@/shared/types';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const DisplayMediaInfo = () => {
  const url = useMediaInfoStore((state) => state.url);
  const source = useMediaInfoStore((state) => state.source) as Source;
  const navigate = useNavigate();

  useEffect(() => {
    if (!url && !source) {
      navigate('/');
    }
  }, []);

  return (
    <div className="h-full overflow-y-scroll">
      <div className="sticky left-0 top-0 z-50">
        <header className="p-3 sticky top-0 left-0 z-50 bg-background/60 backdrop-blur-md">
          <UserUrlInput showRefetch={true} url={url} />
        </header>
      </div>

      <div className="relative z-0">
        {source === 'youtube-video' && <YoutubeVideoInfo url={url} />}
      </div>
    </div>
  );
};

export default DisplayMediaInfo;
