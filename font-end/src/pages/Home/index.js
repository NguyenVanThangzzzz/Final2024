import { faTicketAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import DefaultLayout from "~/layouts/DefaultLayout";
import { useMovieStore } from "../../store/movieStore";
import styles from "./HomePage.module.scss";
import classNames from 'classnames/bind';
import SliderShow from '~/components/SliderShow';

const cx = classNames.bind(styles);

function Index() {
  const { movies, fetchAllMovies, loading } = useMovieStore();

  useEffect(() => {
    fetchAllMovies();
  }, [fetchAllMovies]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <DefaultLayout>
      <div className={cx('wrapper')}>
        <SliderShow />
        <div className={styles.movieContainer}>
          <h1 className={styles.title}>Hot Movies : October</h1>
          <div className={styles.movieList}>
            {movies.map((movie) => (
              <div key={movie._id} className={styles.movieCard}>
                <img
                  src={movie.image}
                  alt={movie.name}
                  className={styles.movieImage}
                />
                <div className={styles.movieInfo}>
                  <h2 className={styles.movieName}>{movie.name}</h2>
                  <p className={styles.movieGenre}>Genres: {movie.genres}</p>

                  <p>
                    <strong>Director:</strong> {movie.director}
                  </p>
                  <p>
                    <strong>Cast:</strong> {movie.actors}
                  </p>
                  <p>
                    <strong>Description:</strong> {movie.description}
                  </p>
                  <a
                    href={`/film/${movie.slug || movie._id}`}
                    className={styles.bookButton}
                  >
                    <FontAwesomeIcon
                      icon={faTicketAlt}
                      style={{ marginRight: "8px" }}
                    />
                    Book Ticket
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}

export default Index;
