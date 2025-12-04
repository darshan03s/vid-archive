import ElectronStore from 'electron-store';
import { DATA_DIR } from '.';
import { AppSettings, AppSettingsChange } from '@shared/types';

class StoreManager {
  static instancePromise: Promise<StoreManager> | null = null;
  store: ElectronStore<AppSettings> | null = null;

  constructor() {
    if (StoreManager.instancePromise) {
      throw new Error('Use StoreManager.getInstance() to retrieve the store instance.');
    }
  }

  async initialize() {
    const electronStoreModule = await import('electron-store');
    const StoreConstructor = electronStoreModule.default;
    this.store = new StoreConstructor({
      name: 'settings',
      cwd: DATA_DIR
    });
  }

  static async getInstance() {
    if (!StoreManager.instancePromise) {
      StoreManager.instancePromise = (async () => {
        const manager = new StoreManager();
        await manager.initialize();
        return manager;
      })();
    }
    return StoreManager.instancePromise;
  }

  get<K extends keyof AppSettings>(key: K): AppSettings[K] {
    return this.store!.get(key);
  }

  getAll(): AppSettings {
    return this.store!.store as AppSettings;
  }

  set<K extends keyof AppSettings>(key: K, value: AppSettings[K]) {
    this.store!.set(key, value);
  }

  setAll(values: AppSettings) {
    this.store!.set(values);
  }

  update(values: AppSettingsChange) {
    this.store!.set(values);
  }
}

export async function initStoreManager() {
  return StoreManager.getInstance();
}

export async function getStoreManager() {
  if (!StoreManager.instancePromise) {
    throw new Error(
      'Store not initialized. Call initStoreManager() in the main entry point first.'
    );
  }
  return StoreManager.instancePromise;
}
