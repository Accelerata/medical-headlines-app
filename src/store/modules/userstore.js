//存储用户信息相关的store

import{createSlice} from '@reduxjs/toolkit';

const userStore = createSlice({
    name: 'user',
    initialState: {
        userInfo: {},
    },
    reducers: {
        setUserInfo: (state, action) => {
            state.userInfo = action.payload;
        },
    },
});

// export const {setUserInfo} = userStore.actions;
export default userStore.reducer;