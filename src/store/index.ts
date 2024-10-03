// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import questionReducer from './questionSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    question: questionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
