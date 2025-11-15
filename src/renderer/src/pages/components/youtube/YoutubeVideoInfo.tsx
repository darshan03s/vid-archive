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

  return (
    <div className="h-60 bg-black flex justify-center items-center">
      <Preview previewUrl={hqDefaultThumbnailUrl} />
    </div>
  );
};

export default YoutubeVideoInfo;
