import classNames from "classnames/bind";

import PaymentSuccessPage from "../../layouts/components/PaymentSuccess/index";
import styles from "./PaymentSuccess.module.scss";

const cx = classNames.bind(styles);

function PaymentSuccess() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("content")}>
          <PaymentSuccessPage />
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
