import { useState } from 'react';
import { faTicketAlt, faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import DefaultLayout from "~/layouts/DefaultLayout";
import { useMovieStore } from "../../store/movieStore";
import styles from "./HomePage.module.scss";
import classNames from 'classnames/bind';
import SliderShow from '~/components/SliderShow';
import ButtonMovie from '~/components/ButtonMovie';

const cx = classNames.bind(styles);

const MOVIES_PER_PAGE = 5; // Số lượng phim hiển thị ban đầu

function Index() {
  const { movies, fetchAllMovies, loading } = useMovieStore();
  const [visibleMovies, setVisibleMovies] = useState(MOVIES_PER_PAGE);

  useEffect(() => {
    fetchAllMovies();
  }, [fetchAllMovies]);

  const formatGenres = (genres) => {
    if (!Array.isArray(genres)) return '';
    return genres.join(', ');
  };

  const showMoreMovies = () => {
    setVisibleMovies(prev => prev + MOVIES_PER_PAGE);
  };

  const showLessMovies = () => {
    setVisibleMovies(MOVIES_PER_PAGE);
  };

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
            {movies.slice(0, visibleMovies).map((movie) => (
              <div key={movie._id} className={styles.movieCard}>
                <img
                  src={movie.image}
                  alt={movie.name}
                  className={styles.movieImage}
                />
                <div className={styles.movieInfo}>
                  <h2 className={styles.movieName}>{movie.name}</h2>
                  <p className={styles.movieGenre}>
                    <strong>Genres:</strong> {formatGenres(movie.genres)}
                  </p>
                  <p>
                    <strong>Director:</strong> {movie.director}
                  </p>
                  <p>
                    <strong>Actors:</strong> {movie.actors}
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
          {movies.length > visibleMovies && (
            <div className={styles.showMore}>
              <ButtonMovie 
                onClick={showMoreMovies}
                leftIcon={<FontAwesomeIcon icon={faAngleDown} />}
              >
                SHOW MORE MOVIES
              </ButtonMovie>
            </div>
          )}
          {visibleMovies > MOVIES_PER_PAGE && (
            <div className={styles.showMore}>
              <ButtonMovie 
                onClick={showLessMovies}
                leftIcon={<FontAwesomeIcon icon={faAngleUp} />}
              >
                SHOW LESS
              </ButtonMovie>
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}

export default Index;
