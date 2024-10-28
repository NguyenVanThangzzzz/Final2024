import classNames from "classnames/bind";
import FilmPage from "../../layouts/components/FilmPage/index";
import styles from "./film.module.scss";
const cx = classNames.bind(styles);
function Film() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("content")}>
          <FilmPage />
        </div>
      </div>
    </div>
  );
}

export default Film;
