// store.js
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../reducer/RootReducer';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import {thunk} from 'redux-thunk';  // Fixed import syntax

const persistConfig = {
    key: 'root',
    storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(thunk),
    devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);