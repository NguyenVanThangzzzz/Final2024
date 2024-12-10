import { useEffect } from "react";
import { useMovieStore } from "~/store/movieStore";
import classNames from "classnames/bind";
import styles from "./MoviesPage.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTicketAlt } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

function MoviePage() {
  const { movies, loading, error, fetchAllMovies } = useMovieStore();

  useEffect(() => {
    fetchAllMovies();
  }, [fetchAllMovies]);

  if (loading) {
    return <div className={cx("loading")}>Loading...</div>;
  }

  if (error) {
    return <div className={cx("error")}>{error}</div>;
  }

  const formatGenres = (genres) => {
    if (!Array.isArray(genres)) return '';
    return genres.join(', ');
  };

  return (
    <div className={cx("movie-grid")}>
      {movies.map((movie) => (
        <div key={movie._id} className={cx("movie-card")}>
          <div className={cx("movie-poster")}>
            <img
              src={movie.image}
              alt={movie.name}
            />
            <div className={cx("movie-overlay")}>
              <Link 
                to={`/film/${movie.slug || movie._id}`} 
                className={cx("book-button")}
              >
                <FontAwesomeIcon icon={faTicketAlt} />
                Book Ticket
              </Link>
            </div>
          </div>
          <div className={cx("movie-info")}>
            <h3 className={cx("movie-title")}>{movie.name}</h3>
            <p className={cx("movie-genre")}>{formatGenres(movie.genres)}</p>
            <p className={cx("movie-duration")}>{movie.duration}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MoviePage;
