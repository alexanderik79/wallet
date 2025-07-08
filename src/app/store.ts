// src/app/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import userReducer from '../features/user/userSlice';
import categoryReducer from '../features/category/categorySlice';
import historyReducer from '../features/history/historySlice';

// Объединяем все редьюсеры в один корневой редьюсер
const rootReducer = combineReducers({
  user: userReducer,
  category: categoryReducer, // Убедитесь, что имя 'category' совпадает с ключом в rootReducer
  history: historyReducer,
});

// Конфигурация для redux-persist
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  // ВАЖНО: Убедитесь, что 'category' включен в whitelist
  whitelist: ['category', 'history', 'user'], // Явно указываем 'category', 'history' и 'user'
};

// Создаем "персистентный" редьюсер
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;