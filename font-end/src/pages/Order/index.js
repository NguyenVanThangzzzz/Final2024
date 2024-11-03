import classNames from "classnames/bind";
import OrderPage from "../../layouts/components/Order/index";
import styles from "./Order.module.scss";
const cx = classNames.bind(styles);

function Order() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("content")}>
          <OrderPage />
        </div>
      </div>
    </div>
  );
}

export default Order;
