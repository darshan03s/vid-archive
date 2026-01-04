import { Source } from '@shared/types';

export const allowedSources = [
  'youtube-video',
  'youtube-playlist',
  'youtube-music',
  'youtube-music-playlist',
  'twitter-video',
  'instagram-video',
  'reddit-video',
  'dailymotion-video',
  'pinterest-video',
  'rumble-video',
  'tiktok-video'
] as const;

export const mediaSources: readonly Source[] = [
  'youtube-video',
  'youtube-music',
  'twitter-video',
  'instagram-video',
  'reddit-video',
  'dailymotion-video',
  'pinterest-video',
  'rumble-video',
  'tiktok-video'
];

export const playlistSources: readonly Source[] = ['youtube-playlist', 'youtube-music-playlist'];

export const SERVER_PORT = 12277;
export const DEV_SERVER_PORT = 12278;
export const SERVER_BASE_URL = 'http://localhost';
export const getServerUrl = () =>
  `${SERVER_BASE_URL}:${import.meta.env.DEV ? DEV_SERVER_PORT : SERVER_PORT}`;

export const DEFAULT_MAX_CONCURRENT_DOWNLOADS = 2;
export const MAX_ALLOWED_CONCURRENT_DOWNLOADS = 5;
