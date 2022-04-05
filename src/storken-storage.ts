import { IOptions, Storken } from 'storken'

export interface IFuncs {
  setFromStorage: () => Promise<any>,
  saveToStorage: (value: any) => Promise<any> | undefined,
  clear: (key: string, remove: boolean, reset: boolean) => Promise<void> | undefined,
  multiClear: (...keys: string[]) => Promise<void>
}

export interface AsyncStorage {
  getItem(key: string): PromiseLike<string | null>,
  setItem(key: string, value: string): PromiseLike<void>,
  removeItem(key: string): PromiseLike<void>
}

export const StorkenStorage = (storken: Storken<any>, generalStorage: Storage | AsyncStorage) => {
  const { storage: specificStorage, disableStorageOnMount, disableSetterOnStorage }: IOptions & {
    storage?: Storage,
    disableStorageOnMount?: boolean,
    disableSetterOnStorage?: boolean
  } = storken.opts
  const storage = specificStorage || generalStorage

  const Funcs: IFuncs = {
    setFromStorage: async () => {
      storken.load(true)
      storken.dispatchEvent('loadingStorage')
      try {
        const stored = await storage.getItem((storken.namespace as string) + (storken.key as string))
        let originalStored: any = null
        if (stored !== null) {
          storken.dispatchEvent('loadedStorage', stored)

          if (stored) {
            originalStored = JSON.parse(stored)
            storken.dispatchEvent('settingFromStorage', stored)
            storken.set(stored, { disableSetter: disableSetterOnStorage || true })
            storken.dispatchEvent('settedFromStorage', stored)
          }

          storken.load(false)

          return originalStored
        }
      } catch (err) {
        console.warn('Storken: failed to set from storage', { value: storken.value, err })
      }

      storken.load(false)

      return undefined
    },
    saveToStorage: async (value) => {
      storken.dispatchEvent('savingToStorage')
      const address = storken.namespace + (storken.key as string)
      const val = JSON.stringify(value)
      try {
        await storage.setItem(address, val)
        storken.dispatchEvent('savedToStorage', address, val)
        return storken.value
      } catch (err) {
        console.warn('Storken: failed to setItem', { value, err })
      }

      return undefined
    },
    clear: async (key, remove, reset = true) => {
      storken.dispatchEvent('removingStorage')

      await storage.removeItem(storken.namespace + key)

      storken.dispatchEvent('removedStorage')

      if (remove) {
        storken.Store.remove(key, reset)
      }
    },
    multiClear: async (...keys: string[]) => {
      for (const keyIndex in keys) {
        const key = keys[keyIndex]
        await storken.Store.remove(key)
      }
    }
  }

  Object.assign(storken, Funcs)

  if (storage && !disableStorageOnMount) {
    (storken as typeof storken & IFuncs).setFromStorage()
  }

  storken.on('set', (newValue: any) => {
    if (storage) {
      (storken as typeof storken & IFuncs).saveToStorage(newValue)
    }
  })

  return Funcs
}

export default StorkenStorage
