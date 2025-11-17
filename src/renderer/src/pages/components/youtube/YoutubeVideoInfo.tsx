import { useEffect } from 'react';
import { YoutubeVideoInfoJson } from '@/shared/types/info-json/youtube-video';
import { toast } from 'sonner';
import { Spinner } from '@renderer/components/ui/spinner';
import { useMediaInfoStore } from '@renderer/stores/media-info-store';

const Preview = ({ previewUrl }: { previewUrl: string }) => {
  return (
    <div className="w-full h-60 bg-black flex items-center justify-center">
      <img src={previewUrl} alt="Preview" width={420} className="aspect-video" />
    </div>
  );
};

type YoutubeVideoInfoProps = {
  url: string;
};

const YoutubeVideoInfo = ({ url }: YoutubeVideoInfoProps) => {
  const videoId = new URL(url).searchParams.get('v');
  const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
  const infoJson = useMediaInfoStore((state) => state.mediaInfo) as YoutubeVideoInfoJson;

  useEffect(() => {
    if (Object.keys(infoJson).length !== 0) return;
    window.api.getYoutubeVideoInfoJson(url).then((data: YoutubeVideoInfoJson | null) => {
      if (!data) {
        toast.error('Could not fetch info for this url');
      }
      useMediaInfoStore.setState({ mediaInfo: data as YoutubeVideoInfoJson });
    });
  }, []);

  const Details = () => {
    return <div className="text-sm">{infoJson?.fulltitle}</div>;
  };

  return (
    <div className="flex flex-col">
      <Preview previewUrl={thumbnailUrl} />
      <div className="p-2">{Object.keys(infoJson).length !== 0 ? <Details /> : <Spinner />}</div>
    </div>
  );
};

export default YoutubeVideoInfo;
