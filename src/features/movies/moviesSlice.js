import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCategory, fetchTrending, fetchGenres } from "../../api/tmdb";

export const loadMovies = createAsyncThunk(
  "movies/load",
  async ({ category, page }) => {
    let res;
    if (category === "trending") res = await fetchTrending(page);
    else if (category === "latest") res = await fetchCategory("now_playing", page);
    else res = await fetchCategory("popular", page);

    return {
      category,
      page,
      results: res.data.results,
      totalPages: res.data.total_pages,
    };
  }
);

export const loadGenres = createAsyncThunk("movies/genres", async () => {
  const res = await fetchGenres();
  return res.data.genres;
});

const emptyList = () => ({ items: [], page: 0, totalPages: 1, status: "idle" });

const moviesSlice = createSlice({
  name: "movies",
  initialState: {
    category: "popular",
    lists: { popular: emptyList(), trending: emptyList(), latest: emptyList() },
    genres: {},
    favorites: JSON.parse(localStorage.getItem("favorites") || "[]"),
  },
  reducers: {
    setCategory(state, action) {
      state.category = action.payload;
    },
    toggleFavorite(state, action) {
      const id = action.payload;
      state.favorites = state.favorites.includes(id)
        ? state.favorites.filter((f) => f !== id)
        : [...state.favorites, id];
      localStorage.setItem("favorites", JSON.stringify(state.favorites));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadMovies.pending, (state, action) => {
        state.lists[action.meta.arg.category].status = "loading";
      })
      .addCase(loadMovies.fulfilled, (state, action) => {
        const { category, page, results, totalPages } = action.payload;
        const list = state.lists[category];
        const seen = new Set(list.items.map((m) => m.id));
        list.items.push(...results.filter((m) => !seen.has(m.id)));
        list.page = page;
        list.totalPages = totalPages;
        list.status = "idle";
      })
      .addCase(loadGenres.fulfilled, (state, action) => {
        state.genres = Object.fromEntries(action.payload.map((g) => [g.id, g.name]));
      });
  },
});

export const { setCategory, toggleFavorite } = moviesSlice.actions;
export default moviesSlice.reducer;