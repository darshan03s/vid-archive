import { type Api } from '@/shared/types';

export {};

declare global {
  interface Window {
    api: Api;
    electron: typeof import('@electron-toolkit/preload').electronAPI;
  }
}
