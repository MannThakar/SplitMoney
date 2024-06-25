import { configureStore } from '@reduxjs/toolkit';
import amountReducer from './amoutSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import { combineReducers } from 'redux';


const persistConfig = {
    key: 'root',
    version: 1,
    storage
}


const rootReducer = combineReducers({
    amount: amountReducer
});


const persistedReducer = persistReducer(persistConfig, rootReducer);


const store = configureStore({
    reducer: persistedReducer
});

export default store;