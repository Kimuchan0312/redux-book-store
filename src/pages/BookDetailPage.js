import React, { useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { useParams } from "react-router-dom";
import { Container, Button, Box, Grid, Stack, Typography } from "@mui/material";
import { useSelector, useDispatch  } from "react-redux";
import { fetchBook } from "../store/bookSlice";
import { setLoading, setError } from "../store/bookSlice";
import { toast } from "react-toastify";
import api from "../apiService";

const BACKEND_API = "http://localhost:5000";

const BookDetailPage = () => {
  const book = useSelector((state) => state.book.book);
  const loading = useSelector((state) => state.book.loading);
  const params = useParams();
  const bookId = params.id;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchBook(bookId));
  }, [dispatch, bookId]);

  const handleAddToReadingList = async (book) => {
    dispatch(setLoading(true));
    try {
      await api.post(`/favorites`, book);
      toast.success("The book has been added to the reading list!");
    } catch (error) {
      dispatch(setError(error.message));
      toast.error(error.message);
    }
    dispatch(setLoading(false));
  };
  

  return (
    <Container>
      {loading ? (
        <Box sx={{ textAlign: "center", color: "primary.main" }} >
          <ClipLoader color="#inherit" size={150} loading={true} />
        </Box>
      ) : (
        <Grid container spacing={2} p={4} mt={5} sx={{ border: "1px solid black" }}>
          <Grid item md={4}>
            {book && (
              <img
                width="100%"
                src={`${BACKEND_API}/${book.imageLink}`}
                alt=""
              />
            )}
          </Grid>
          <Grid item md={8}>
            {book && (
              <Stack>
                <h2>{book.title}</h2>
                <Typography variant="body1">
                  <strong>Author:</strong> {book.author}
                </Typography>
                <Typography variant="body1">
                  <strong>Year:</strong> {book.year}
                </Typography>
                <Typography variant="body1">
                  <strong>Country:</strong> {book.country}
                </Typography>
                <Typography variant="body1">
                  <strong>Pages:</strong> {book.pages}
                </Typography>
                <Typography variant="body1">
                  <strong>Language:</strong> {book.language}
                </Typography>
                <Button variant="outlined" sx={{ width: "fit-content" }} onClick={() => handleAddToReadingList(book)}>
                  Add to Reading List
                </Button>
              </Stack>
            )}
          </Grid>
        </Grid>
      )
      }
    </Container >
  );
};

export default BookDetailPage;
