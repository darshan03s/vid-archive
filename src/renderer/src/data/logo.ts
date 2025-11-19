import { Source } from '@/shared/types';
import youtubeLogo from '../assets/youtube-logo.svg';

export function Logo(source: Source) {
  if (source === 'youtube-video') {
    return youtubeLogo;
  }
  if (source === 'youtube-playlist') {
    return youtubeLogo;
  }
  return '';
}
