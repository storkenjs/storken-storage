export const StorkenStorage = (storken, generalStorage) => {
  const { storage: specificStorage, disableStorageOnMount, disableSetterOnStorage } = storken.opts
  const storage = specificStorage || generalStorage

  const Funcs = {
    setFromStorage: async () => {
      storken.load(true)
      storken.dispatchEvent('loadingStorage')
      try {
        let stored = storage.getItem(storken.namespace + storken.key)
        if (stored !== null) {
          if (typeof stored?.then === 'function') {
            stored = await stored
          }

          storken.dispatchEvent('loadedStorage', stored)

          if (stored) {
            stored = JSON.parse(stored)
            storken.dispatchEvent('settingFromStorage', stored)
            storken.set(stored, { disableSetter: disableSetterOnStorage || true })
            storken.dispatchEvent('settedFromStorage', stored)
          }

          storken.load(false)

          return stored
        }
      } catch (err) {
        console.warn('Storken: failed to set from storage', { value: storken.value, err })
      }

      storken.load(false)
    },
    saveToStorage: async (value) => {
      storken.dispatchEvent('savingToStorage')
      const address = storken.namespace + storken.key
      const val = JSON.stringify(value)
      try {
        await storage.setItem(address, val)
        storken.dispatchEvent('savedToStorage', address, val)
        return storken.value
      } catch (err) {
        console.warn('Storken: failed to setItem', { value, err })
      }
    },
    clear: async (key, remove, reset = true) => {
      storken.dispatchEvent('removingStorage')

      await storage.removeItem(storken.namespace + key)

      storken.dispatchEvent('removedStorage')

      if (remove) {
        storken.remove(key, reset)
      }
    },
    multiClear: async (...keys) => {
      for (const keyIndex in keys) {
        const key = keys[keyIndex]
        await storken.clear(key)
      }
    }
  }

  Object.assign(storken, Funcs)

  if (storage && !disableStorageOnMount) {
    storken.setFromStorage()
  }

  storken.on('set', (newValue) => {
    if (storage) {
      storken.saveToStorage(newValue)
    }
  })

  return Funcs
}

export default StorkenStorage
