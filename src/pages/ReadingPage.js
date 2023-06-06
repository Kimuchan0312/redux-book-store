import React, { useEffect } from "react";
import {
  Container,
  Button,
  Box,
  Card,
  Stack,
  CardMedia,
  CardActionArea,
  Typography,
  CardContent,
} from "@mui/material";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../apiService";
import { setBooks, setRemovedBookId } from "../store/booksSlice";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../store/booksSlice";

const BACKEND_API = process.env.REACT_APP_BACKEND_API;

const ReadingPage = () => {
  const books = useSelector((state) => state.books.books);
  const loading = useSelector((state) => state.books.loading);
  const removedBookId = useSelector((state) => state.books.removedBookId);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClickBook = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  const handleRemoveBook = (bookId) => {
    dispatch(setRemovedBookId(bookId));
  };

  useEffect(() => {
    if (removedBookId) return;
    const fetchData = async () => {
      dispatch(setLoading(true));
      try {
        const res = await api.get(`/favorites`);
        dispatch(setBooks(res.data));
      } catch (error) {
        toast(error.message);
      }
      dispatch(setLoading(false));
    };
    fetchData();
  }, [dispatch, removedBookId]);

  useEffect(() => {
    if (!removedBookId) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        await api.delete(`/favorites/${removedBookId}`);
        toast.success("The book has been removed");
        dispatch(setRemovedBookId(""));
      } catch (error) {
        toast(error.message);
      }
      setLoading(false);
    };
    fetchData();
  }, [dispatch, removedBookId]);

  return (
    <Container>
      <Typography variant="h3" sx={{ textAlign: "center" }} m={3}>
        Book Store
      </Typography>
      {loading ? (
        <Box sx={{ textAlign: "center", color: "primary.main" }}>
          <ClipLoader color="inherit" size={150} loading={true} />
        </Box>
      ) : (
        <Stack
          direction="row"
          spacing={2}
          justifyContent="space-around"
          flexWrap={"wrap"}
        >
          {books.map((book) => (
            <Card
              key={book.id}
              sx={{
                width: "12rem",
                height: "27rem",
                marginBottom: "2rem",
              }}
            >
              <CardActionArea>
                <CardMedia
                  component="img"
                  image={`${BACKEND_API}/${book.imageLink}`}
                  alt={`${book.title}`}
                  onClick={() => handleClickBook(book.id)}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {`${book.title}`}
                  </Typography>
                  <Typography gutterBottom variant="body1" component="div">
                    {`${book.author}`}
                  </Typography>
                  <Button
                    sx={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      backgroundColor: "secondary.light",
                      color: "secondary.contrastText",
                      padding: "0",
                      minWidth: "1.5rem",
                    }}
                    size="small"
                    onClick={() => handleRemoveBook(book.id)}
                  >
                    &times;
                  </Button>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Stack>
      )}
    </Container>
  );
};

export default ReadingPage;
