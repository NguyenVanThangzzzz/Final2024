import classNames from "classnames/bind";
import styles from "./Cinema.module.scss";
import CinemaPage from "~/layouts/components/CinemaPage";
import Footer from "~/layouts/components/Footer";

const cx = classNames.bind(styles);

function Cinema() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("content")}>
          <CinemaPage />
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Cinema;
