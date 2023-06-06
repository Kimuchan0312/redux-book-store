import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../apiService";

const initialState = {
  book: null,
  loading: false,
  error: null,
  removedBookId: null,
};

export const fetchBook = createAsyncThunk("books/fetchBook", async (bookId) => {
  const response = await api.get(`/books/${bookId}`);
  return response.data;
});

const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setBook: (state, action) => {
      state.book = action.payload;
    },
    setRemovedBookId: (state, action) => {
      state.removedBookId = action.payload;
    },
    addingBook: (state, action) => {
      state.book = action.payload;
    },
    removeBook: (state) => {
      state.book = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBook.fulfilled, (state, action) => {
        state.loading = false;
        state.book = action.payload;
      })
      .addCase(fetchBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setLoading,
  setError,
  setBook,
  setRemovedBookId,
  addingBook,
  removeBook,
} = bookSlice.actions;

export default bookSlice.reducer;
