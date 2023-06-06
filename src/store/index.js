import { combineReducers, configureStore } from '@reduxjs/toolkit';
import bookReducer from './bookSlice';
import booksReducer from './booksSlice';


const rootReducer = combineReducers({
  book: bookReducer,
  books: booksReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;