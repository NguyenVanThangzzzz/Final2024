import classNames from "classnames/bind";
import Footer from "../../layouts/components/Footer/index";
import OrderPage from "../../layouts/components/Order/index";
import styles from "./Order.module.scss";
const cx = classNames.bind(styles);

function Order() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("content")}>
          <OrderPage />
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Order;
