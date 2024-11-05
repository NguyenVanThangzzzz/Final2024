import classNames from "classnames/bind";
import PaymentPage from "../../layouts/components/Payment/index";
import styles from "./Payment.module.scss";

const cx = classNames.bind(styles);

function Payment() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("content")}>
          <PaymentPage />
        </div>
      </div>
    </div>
  );
}

export default Payment;
