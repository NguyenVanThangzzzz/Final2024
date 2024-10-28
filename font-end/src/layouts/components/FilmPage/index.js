import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCinemaStore } from "../../../store/cinemaStore";
import { useMovieStore } from "../../../store/movieStore";
import styles from "./FilmPage.module.scss";

const cx = classNames.bind(styles);

function FilmPage() {
  const { slug } = useParams();
  const { movies, fetchAllMovies, loading: movieLoading } = useMovieStore();
  const { cinemas, fetchAllCinemas, loading: cinemaLoading } = useCinemaStore();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    // Fetch movies if they haven't been loaded
    if (movies.length === 0) {
      fetchAllMovies();
    }
  }, [fetchAllMovies, movies.length]);

  useEffect(() => {
    // Fetch cinemas on component mount
    fetchAllCinemas();
  }, [fetchAllCinemas]);

  useEffect(() => {
    // Find the selected movie by slug
    const selectedMovie = movies.find((m) => m.slug === slug || m._id === slug);
    setMovie(selectedMovie);
  }, [slug, movies]);

  if (movieLoading || cinemaLoading) {
    return <div>Loading...</div>;
  }

  if (!movie) {
    return <div>Không tìm thấy phim</div>;
  }

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        {/* Movie Details Section */}
        <div className={cx("movieDetail")}>
          <img
            src={movie.image}
            alt={movie.name}
            className={cx("movieImage")}
          />
          <div className={cx("movieInfo")}>
            <h2>{movie.name}</h2>
            <p>
              <strong>Thể loại:</strong> {movie.genres}
            </p>
            <p>
              <strong>Đạo diễn:</strong> {movie.director}
            </p>
            <p>
              <strong>Diễn viên:</strong> {movie.actors}
            </p>
            <p className={cx("description")}>{movie.description}</p>
          </div>
        </div>

        <h3 className={cx("cinemaTitle")}>CINEMA</h3>
        {/* Divider and Cinema Section Title */}
        <div className={cx("sectionDivider")}></div>

        {/* Cinema List Section */}
        <div className={cx("cinemaList")}>
          {cinemas.map((cinema, index) => (
            <div key={cinema._id} className={cx("cinemaCard")}>
              <h3>{cinema.name}</h3>
              <p>
                <strong>Địa chỉ:</strong> {cinema.streetName}, {cinema.state},{" "}
                {cinema.country}
              </p>
              <p>
                <strong>Postal Code:</strong> {cinema.postalCode}
              </p>
              <p>
                <strong>Phone:</strong> {cinema.phoneNumber}
              </p>
              {index < cinemas.length - 1 && (
                <div className={cx("cinemaDivider")}></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FilmPage;
