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
  const raw = storage.get("MHA_token");
  if (!raw) return null;

  // 兼容之前用 JSON.stringify 存进去的字符串（会多一层引号）
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === "string") return parsed;
  } catch (e) {
    // ignore
  }

  // 兜底：去掉首尾多余引号
  return raw.replace(/^"|"$/g, "");
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

//搜索历史
export function LOCAL_getSearchHistory() {
  const raw = storage.get("MHA_searchHistory");
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

export function LOCAL_setSearchHistory(searchHistory) {
  storage.set("MHA_searchHistory", searchHistory);
}

export function LOCAL_clearSearchHistory() {
  storage.clear("MHA_searchHistory");
}
