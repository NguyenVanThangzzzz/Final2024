import { faTicketAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import DefaultLayout from "~/layouts/DefaultLayout";
import { useMovieStore } from "../../store/movieStore";
import styles from "./HomePage.module.scss";

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
      <div className={styles.movieContainer}>
        <h1 className={styles.title}>Phim Hot : Tháng 10</h1>
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
                <p className={styles.movieGenre}>{movie.genres}</p>

                <p>
                  <strong>Đạo diễn:</strong> {movie.director}
                </p>
                <p>
                  <strong>Diễn viên:</strong> {movie.actors}
                </p>
                <p>
                  <strong>Mô tả:</strong> {movie.description}
                </p>
                <a
                  href={`/film/${movie.slug || movie._id}`}
                  className={styles.bookButton}
                >
                  <FontAwesomeIcon
                    icon={faTicketAlt}
                    style={{ marginRight: "8px" }}
                  />
                  Đặt vé
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DefaultLayout>
  );
}

export default Index;
