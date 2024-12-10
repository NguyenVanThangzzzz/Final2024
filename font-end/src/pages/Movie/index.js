import classNames from "classnames/bind";
import MoviePage from "~/layouts/components/MoviesPage";
import styles from "./Movie.module.scss";
import Footer from "~/layouts/components/Footer";
const cx = classNames.bind(styles);

function Movie() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("content")}>
          <MoviePage />
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Movie;
