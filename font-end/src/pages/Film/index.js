import classNames from "classnames/bind";
import FilmPage from "../../layouts/components/FilmPage/index";
import Footer from "../../layouts/components/Footer/index";
import styles from "./film.module.scss";
const cx = classNames.bind(styles);
function Film() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("content")}>
          <FilmPage />
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Film;
