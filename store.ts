import {configureStore} from '@reduxjs/toolkit';
import historyReducer from './src/features/historySlice';

export const store = configureStore({
  reducer: {
    history: historyReducer,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
