import { YtdlpVersions } from '@/shared/types';
import { create } from 'zustand';

interface YtdlpVersionsStore {
  versions: YtdlpVersions;
  setVersions: (versions: Partial<YtdlpVersions>) => void;
}

const initialState: YtdlpVersions = {
  stable: [],
  master: [],
  nightly: []
};

export const useYtdlpVersionsStore = create<YtdlpVersionsStore>((set) => ({
  versions: initialState,
  setVersions: (versions) =>
    set((state) => ({
      versions: {
        ...state.versions,
        ...versions
      }
    }))
}));
