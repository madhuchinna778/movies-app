import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCategory, loadGenres } from "./features/movies/moviesSlice";
import MovieList from "./components/MovieList";

const TABS = [
  { key: "popular", label: "Popular" },
  { key: "trending", label: "Trending" },
  { key: "latest", label: "Latest" },
];

export default function App() {
  const dispatch = useDispatch();
  const category = useSelector((s) => s.movies.category);

  useEffect(() => {
    dispatch(loadGenres());
  }, [dispatch]);

  return (
    <div className="app">
      <h1>🎬 Movies App</h1>
      <nav>
        {TABS.map((t) => (
          <button
            key={t.key}
            className={category === t.key ? "active" : ""}
            onClick={() => dispatch(setCategory(t.key))}
          >
            {t.label}
          </button>
        ))}
      </nav>
      <MovieList />
    </div>
  );
}