import ElectronStore from 'electron-store'
import { DATA_DIR } from '.'

class StoreManager {
  static instancePromise: Promise<StoreManager> | null = null
  store: ElectronStore<Record<string, unknown>> | null = null

  constructor() {
    if (StoreManager.instancePromise) {
      throw new Error('Use StoreManager.getInstance() to retrieve the store instance.')
    }
  }

  async initialize() {
    const electronStoreModule = await import('electron-store')
    const StoreConstructor = electronStoreModule.default
    this.store = new StoreConstructor({
      name: 'settings',
      cwd: DATA_DIR
    })
  }

  static async getInstance() {
    if (!StoreManager.instancePromise) {
      StoreManager.instancePromise = (async () => {
        const manager = new StoreManager()
        await manager.initialize()
        return manager
      })()
    }
    return StoreManager.instancePromise
  }

  get(key: string) {
    return this.store!.get(key)
  }

  set(key: string, value: any) {
    this.store!.set(key, value)
  }
}

export async function initStoreManager() {
  return StoreManager.getInstance()
}

export async function getStoreManager() {
  if (!StoreManager.instancePromise) {
    throw new Error('Store not initialized. Call initStoreManager() in the main entry point first.')
  }
  return StoreManager.instancePromise
}
