import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../apiService";

const initialState = {
  books: [],
  loading: false,
  error: null,
  removedBookId: null,
  pageNum: 1
};

export const fetchBooks = createAsyncThunk(
  "books/fetchBooks",
  async ({ pageNum, limit, query }) => {
    let url = `/books?_page=${pageNum}&_limit=${limit}`;
    if (query) url += `&q=${query}`;
    const response = await api.get(url);
    return response.data;
  }
);

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setBooks: (state, action) => {
      state.books = action.payload;
    },
    setRemovedBookId: (state, action) => {
      state.removedBookId = action.payload;
    },
    addBook: (state, action) => {
      state.books.push(action.payload);
    },
    removeBook: (state, action) => {
      state.books = state.books.filter((book) => book.id !== action.payload.id);
    },
    setPageNum: (state, action) => {
      state.pageNum = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
        console.log("Books state:", state.books);
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setLoading,
  setError,
  setBooks,
  setRemovedBookId,
  addBook,
  removeBook,
  setPageNum
} = booksSlice.actions;

export default booksSlice.reducer;


