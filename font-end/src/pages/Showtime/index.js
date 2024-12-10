import classNames from "classnames/bind";
import styles from "./Showtime.module.scss";
import ShowTimePage from "~/layouts/components/ShowTimePage";
import Footer from "~/layouts/components/Footer";

const cx = classNames.bind(styles);

function Showtime() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("content")}>
          <ShowTimePage />
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Showtime;
