import { useEffect, useState } from 'react';
import { YoutubeVideo } from '@/shared/types/info-json/youtube-video';
import { toast } from 'sonner';

const Preview = ({ previewUrl }: { previewUrl: string }) => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <img src={previewUrl} alt="Preview" width={420} className="aspect-video" />
    </div>
  );
};

type YoutubeVideoInfoProps = {
  url: string;
};

const YoutubeVideoInfo = ({ url }: YoutubeVideoInfoProps) => {
  const videoId = new URL(url).searchParams.get('v');
  const hqDefaultThumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  const [infoJson, setInfoJson] = useState<YoutubeVideo | null>(null);

  useEffect(() => {
    window.api.getYoutubeInfoJson(url).then((data: YoutubeVideo | null) => {
      setInfoJson(data);
      if (!data) {
        toast.error('Could not fetch info for this url');
      }
    });
  }, []);

  return (
    <div className="h-60 bg-black flex justify-center items-center">
      <Preview previewUrl={hqDefaultThumbnailUrl} />
      {JSON.stringify(infoJson)}
    </div>
  );
};

export default YoutubeVideoInfo;
