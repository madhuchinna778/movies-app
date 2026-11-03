import { IMG_URL } from "../api/tmdb";

export default function MovieCard({ movie, genres, isFav, onToggleFav }) {
  return (
    <div className="card">
      {movie.poster_path && (
        <img src={IMG_URL + movie.poster_path} alt={movie.title} loading="lazy" />
      )}
      <h3>{movie.title}</h3>
      <p className="genres">{genres.join(", ") || "Genre not available"}</p>
      <p>⭐ {movie.vote_average?.toFixed(1)}</p>
      <button onClick={onToggleFav}>
        {isFav ? "❤️ Favorite" : "🤍 Add to Favorites"}
      </button>
    </div>
  );
}