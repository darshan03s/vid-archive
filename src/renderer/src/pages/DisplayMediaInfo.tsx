import { useMediaInfoStore } from '@renderer/stores/media-info-store';

const DisplayMediaInfo = () => {
  const url = useMediaInfoStore((state) => state.url);
  return <div>{url}</div>;
};

export default DisplayMediaInfo;
