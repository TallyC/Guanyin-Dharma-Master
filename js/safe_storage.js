/**
 * SafeStorage 防禦性本機儲存封裝
 * 嚴格遵守全域規則：當使用者以 file:/// 開啟或受瀏覽器安全性原則限制時，
 * 自動無感降級至記憶體儲存，防範全頁腳本崩潰。
 */

window.SafeStorage = (() => {
  let isLocalStorageAvailable = false;
  const memoryStorage = {};

  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, 'ok');
    window.localStorage.removeItem(testKey);
    isLocalStorageAvailable = true;
  } catch (e) {
    console.warn('[SafeStorage] localStorage unavailable, falling back to memory storage.', e);
    isLocalStorageAvailable = false;
  }

  return {
    getItem(key, defaultValue = null) {
      let val = null;
      try {
        if (isLocalStorageAvailable) {
          val = window.localStorage.getItem(key);
        }
      } catch (e) {
        console.warn('[SafeStorage] getItem failed, using memory', e);
      }
      if (val === null && memoryStorage[key] !== undefined) {
        val = memoryStorage[key];
      }
      return val !== null ? val : defaultValue;
    },

    setItem(key, value) {
      try {
        if (isLocalStorageAvailable) {
          window.localStorage.setItem(key, value);
          return;
        }
      } catch (e) {
        console.warn('[SafeStorage] setItem failed, using memory', e);
      }
      memoryStorage[key] = String(value);
    },

    removeItem(key) {
      try {
        if (isLocalStorageAvailable) {
          window.localStorage.removeItem(key);
          return;
        }
      } catch (e) {
        console.warn('[SafeStorage] removeItem failed, using memory', e);
      }
      delete memoryStorage[key];
    },

    getJSON(key, defaultValue = null) {
      const val = this.getItem(key);
      if (!val) return defaultValue;
      try {
        return JSON.parse(val);
      } catch (e) {
        return defaultValue;
      }
    },

    setJSON(key, value) {
      try {
        this.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.warn('[SafeStorage] setJSON failed', e);
      }
    }
  };
})();
