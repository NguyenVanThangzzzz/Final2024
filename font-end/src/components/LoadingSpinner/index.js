import classNames from "classnames/bind";
import styles from "./LoadingSpinner.module.scss";
import infiniteSpinner from "~/asset/animation/infinite-spinner.svg";

const cx = classNames.bind(styles);

function LoadingSpinner() {
  return (
    <div className={cx("wrapper")}>
      <img src={infiniteSpinner} alt="Loading..." className={cx("spinner")} />
    </div>
  );
}

export default LoadingSpinner;
