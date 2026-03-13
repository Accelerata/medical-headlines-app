import userStore from './modules/userstore';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
    reducer: {
        user: userStore,
    },
});

export default store;