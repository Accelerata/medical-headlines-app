const STORAGE = window.localStorage;
const storage = {
  get(key) {
    if (STORAGE) {
      return STORAGE.getItem(key);
    }
  },
  set(key, val) {
    if (STORAGE) {
      STORAGE.setItem(key, JSON.stringify(val));
    }
  },
  clear(key) {
    if (STORAGE) {
      STORAGE.removeItem(key);
    }
  },
};

export function LOCAL_getToken() {
  return storage.get("MHA_token");
}

export function LOCAL_setToken(token) {
  storage.set("MHA_token", token);
}

export function LOCAL_clearToken() {
  storage.clear("MHA_token");
}

export function LOCAL_getUserInfo() {
  return storage.get("MHA_userInfo");
}

export function LOCAL_setUserInfo(userInfo) {
  storage.set("MHA_userInfo", userInfo);
}

export function LOCAL_clearUserInfo() {
  storage.clear("MHA_userInfo");
}
