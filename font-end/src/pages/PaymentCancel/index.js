import classNames from "classnames/bind";

import PaymentCancelPage from "../../layouts/components/PaymentCancel/index";
import styles from "./PaymentCancel.module.scss";

const cx = classNames.bind(styles);

function PaymentCancel() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("content")}>
          <PaymentCancelPage />
        </div>
      </div>
    </div>
  );
}

export default PaymentCancel;
