export interface YoutubePlaylist {
  id: string;
  title: string;
  description: string;
  tags: string[];
  thumbnails: Thumbnail[];
  modified_date: string;
  view_count: number;
  playlist_count: number;
  channel: string;
  uploader: string;
  extractor_key: string;
  extractor: string;
  webpage_url: string;
  webpage_url_basename: string;
  webpage_url_domain: string;
  epoch: number;
}

interface Thumbnail {
  url: string;
  height: number;
  width: number;
  id: string;
  resolution: string;
}
