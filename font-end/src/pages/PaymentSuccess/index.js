import classNames from "classnames/bind";

import Footer from "../../layouts/components/Footer/index";
import PaymentSuccessPage from "../../layouts/components/PaymentSuccess/index";
import styles from "./PaymentSuccess.module.scss";

const cx = classNames.bind(styles);

function PaymentSuccess() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("content")}>
          <PaymentSuccessPage />
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
