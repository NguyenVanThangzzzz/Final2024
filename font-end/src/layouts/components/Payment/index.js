import classNames from "classnames/bind";

import styles from "./PaymentPage.module.scss";

const cx = classNames.bind(styles);

function PaymentPage() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("content")}>
          <h2>PaymentPage</h2>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
