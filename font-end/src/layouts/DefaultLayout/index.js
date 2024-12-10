import "bootstrap/dist/css/bootstrap.min.css";
import classNames from "classnames/bind";
import Header from "~/layouts/components/Header";
import Footer from "~/layouts/components/Footer";
import styles from "./DefaultLayout.module.scss";

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
  return (
    <div className={cx("wrapper")}>
      <Header />
      <div className={cx("container")}>
        <div className={cx("content")}>{children}</div>
      </div>
      <Footer />
    </div>
  );
}

export default DefaultLayout;
