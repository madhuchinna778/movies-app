import axios from "axios";

const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: { api_key: import.meta.env.VITE_TMDB_API_KEY },
});

export const fetchCategory = (category, page = 1) =>
  tmdb.get(`/movie/${category}`, { params: { page } });

export const fetchTrending = (page = 1) =>
  tmdb.get("/trending/movie/week", { params: { page } });

export const fetchGenres = () => tmdb.get("/genre/movie/list");

export const IMG_URL = "https://image.tmdb.org/t/p/w500";