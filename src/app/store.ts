// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
// Import reducers from our slices
import userReducer from '../features/user/userSlice';
import categoryReducer from '../features/category/categorySlice';
import historyReducer from '../features/history/historySlice';

export const store = configureStore({
  reducer: {
    // Here we define how our overall Redux state will look.
    // Each key here will correspond to a part of the global state,
    // managed by the respective reducer.
    user: userReducer,
    category: categoryReducer,
    history: historyReducer,
  },
});

// Define type for RootState
// This is very useful for TypeScript to accurately type the useSelector hook
// and understand the full structure of your store.
export type RootState = ReturnType<typeof store.getState>;
// Define type for AppDispatch
// This is useful for typing the useDispatch hook and any async thunks you might create.
export type AppDispatch = typeof store.dispatch;