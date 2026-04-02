import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice.js';
import authReducer from './slices/authSlice.js';
import productReducer from './slices/productSlice.js';
import uiReducer from './slices/uiSlice.js';

// Only persist cart and auth — products reload from API, UI resets are fine
const rootReducer = combineReducers({
  cart: cartReducer,
  auth: authReducer,
  products: productReducer,
  ui: uiReducer,
});

const persistConfig = {
  key: 'textiles-root',
  storage,
  whitelist: ['cart', 'auth'],  // only these get saved to localStorage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);