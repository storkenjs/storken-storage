# storken-storage
Save the state which created by Storken to a storage.

Supports all storages that implements [Storage Interface](https://developer.mozilla.org/en-US/docs/Web/API/Storage).

# Usage
```js
import { create as createStore } from 'storken'
import StorkenStorage from 'storken-storage'

const [useStorken] = createStore({
  plugins: {
    storage: StorkenStorage
  },
  storkenOptions: {
    user: {
      storage: window.localStorage
    }
  }
})
```
A Storken that contains `storage` key in its options will be saved to the specified storage when it is setted in order that the state value can be set from the storage automatically or manually.

Let's another example that uses AsyncStorage in React Native.
```js
import { create as createStore } from 'storken'
import StorkenStorage from 'storken-storage'
import AsyncStorage from '@react-native-community/async-storage'

const [useStorken] = createStore({
  plugins: {
    storage: StorkenStorage
  },
  storkenOptions: {
    user: {
      storage: AsyncStorage
    }
  }
})
```

# Options
Storage options should be passed in `storkenOptions` by key.

- `disableStorageOnMount`: `default: false` disables the automatic setting of state's value from storage when the component is mounted.
- `disableSetterOnStorage`: `default: true` disables automatically triggering the setter if exists, when setted the state.


# Advanced

## Functions
#### `setFromStorage ()`
Sets value from the storage to the state.
#### `saveToStorage (value: string)`
Saves current value of the state to the storage.
#### `clear (key: string, remove: boolean, reset: boolean = true)`
Removes value from the storage.  
`remove` argument runs `remove()` function of StorkenObject. Which removes also the state from the whole store.
#### `multiClear (...keys: string)`
Removes values of multiple states from the storage.

## Events
The events that triggers respectively for every state except the last two.
#### `loadingStorage`
This is triggered while loading value from the storage.
#### `loadedStorage`
This is triggered when loaded the value from the storage.
#### `settingFromStorage`
This is triggered while setting from the storage.
#### `settedFromStorage`
This is triggered when value is setted from the storage.
#### `savingToStorage`
This is triggered while current value saving to the storage.
#### `savedToStorage`
This is triggered when current value is saved to the storage.
#### `removingStorage`
This is triggered while removing the value from the storage.
#### `removedStorage`
This is triggered when removed the value from the storage.

# License
Distributed under the [MIT](/LICENSE) License.

# Contribute
You can contribute by fork this repositry and make pull request.
