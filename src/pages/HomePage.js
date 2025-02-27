import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import PaginationBar from "../components/PaginationBar";
import SearchForm from "../components/SearchForm";
import { FormProvider } from "../form";
import { useForm } from "react-hook-form";
import {
  Container,
  Box,
  Card,
  Stack,
  CardMedia,
  CardActionArea,
  Typography,
  CardContent,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchBooks,
  setPageNum,
} from "../store/booksSlice";

const BACKEND_API = "http://localhost:5000";

const HomePage = () => {
  const books = useSelector((state) => state.books.books);
  const loading = useSelector((state) => state.books.loading);
  const pageNum = useSelector((state) => state.books.pageNum);
  const totalPage = 10;
  const limit = 10;
  const [query, setQuery] = useState("");

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const handleClickBook = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  useEffect(() => {
    dispatch(fetchBooks({ pageNum, limit, query }));
  }, [dispatch, pageNum, limit, query]);

  const handlePageChange = (newPageNum) => {
    dispatch(setPageNum(newPageNum));
  };

  //--------------form
  const defaultValues = {
    searchQuery: "",
  };
  const methods = useForm({
    defaultValues,
  });
  const { handleSubmit } = methods;
  const onSubmit = (data) => {
    setQuery(data.searchQuery);
  };
  return (
    <Container>
      <Stack sx={{ display: "flex", alignItems: "center", m: "2rem" }}>
        <Typography variant="h3" sx={{ textAlign: "center" }}>
          Book Store
        </Typography>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack
            spacing={2}
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ sm: "center" }}
            justifyContent="space-between"
            mb={2}
          >
            <SearchForm />
          </Stack>
        </FormProvider>
        <PaginationBar
          pageNum={pageNum}
          setPageNum={handlePageChange}
          totalPageNum={totalPage}
        />
      </Stack>
      <div>
        {loading ? (
          <Box sx={{ textAlign: "center", color: "primary.main" }}>
            <ClipLoader color="inherit" size={150} loading={true} />
          </Box>
        ) : (
          <Stack
            direction="row"
            spacing={2}
            justifyContent="space-around"
            flexWrap="wrap"
          >
            {books.map((book) => (
              <Card
                key={book.id}
                onClick={() => handleClickBook(book.id)}
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
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {`${book.title}`}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Stack>
        )}
      </div>
    </Container>
  );
};

export default HomePage;
