import classNames from "classnames/bind";
import styles from "./Promotions.module.scss";
import PromotionsPage from "~/layouts/components/PromotionsPage";
import Footer from "~/layouts/components/Footer";

const cx = classNames.bind(styles);

function Promotion() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("content")}>
          <PromotionsPage />
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Promotion;
