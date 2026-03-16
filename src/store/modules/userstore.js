//存储用户信息相关的store

import { createSlice } from "@reduxjs/toolkit";
import { LOCAL_setToken, LOCAL_setUserInfo } from "@/utils/localstorage";

const userStore = createSlice({
  name: "user",
  initialState: {
    userInfo: {},
  },
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload.data;
      LOCAL_setUserInfo(action.payload.data);
      LOCAL_setToken(action.payload.token);
    },
  },
});

export const { setUserInfo } = userStore.actions;
export default userStore.reducer;
