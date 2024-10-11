// store/store.js
import { configureStore } from '@reduxjs/toolkit';
import contactReducer from './detailSlice';

const store = configureStore({
  reducer: {
    contact: contactReducer,
  },
});

export default store;
