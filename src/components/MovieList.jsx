import { useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadMovies, toggleFavorite } from "../features/movies/moviesSlice";
import MovieCard from "./MovieCard";

export default function MovieList() {
  const dispatch = useDispatch();
  const { category, lists, genres, favorites } = useSelector((s) => s.movies);
  const list = lists[category];
  const sentinel = useRef(null);

  // First page load
  useEffect(() => {
    if (list.page === 0) dispatch(loadMovies({ category, page: 1 }));
  }, [category, list.page, dispatch]);

  // Next page load
  const loadNext = useCallback(() => {
    if (list.status === "loading" || list.page >= list.totalPages) return;
    dispatch(loadMovies({ category, page: list.page + 1 }));
  }, [category, list, dispatch]);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadNext();
      },
      { rootMargin: "200px" }
    );
    if (sentinel.current) observer.observe(sentinel.current);
    return () => observer.disconnect();
  }, [loadNext]);

  return (
    <>
      <div className="grid">
        {list.items.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            genres={movie.genre_ids.map((id) => genres[id]).filter(Boolean)}
            isFav={favorites.includes(movie.id)}
            onToggleFav={() => dispatch(toggleFavorite(movie.id))}
          />
        ))}
      </div>

      <div ref={sentinel} style={{ height: 1 }} />
      {list.status === "loading" && <p className="loading">Loading...</p>}
    </>
  );
}