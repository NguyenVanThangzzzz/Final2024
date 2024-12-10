import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

import { usePaymentStore } from "~/store/paymentStore";
import styles from "./PaymentCancelPage.module.scss";

const cx = classNames.bind(styles);

function PaymentCancelPage() {
  const navigate = useNavigate();
  const { cancelReason, paymentStatus, resetPaymentState } = usePaymentStore();

  useEffect(() => {
    return () => {
      resetPaymentState();
    };
  }, [resetPaymentState]);

  const handleReturnHome = () => {
    navigate("/");
  };

  const handleTryAgain = () => {
    navigate("/booking");
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("content")}>
          <FontAwesomeIcon icon={faCircleXmark} className={cx("icon")} />
          <h2>Payment Cancelled</h2>
          <p className={cx("message")}>
            {cancelReason || "Sorry, your payment has been cancelled. You can try again or choose another payment method."}
          </p>

          <div className={cx("buttons")}>
            <button
              className={cx("button", "primary")}
              onClick={handleTryAgain}
            >
              Try Again
            </button>
            <button
              className={cx("button", "secondary")}
              onClick={handleReturnHome}
            >
              Home
            </button>
          </div>

          {paymentStatus === 'error' && (
            <div className={cx("details")}>
              <h3>Error Details</h3>
              <p className={cx("info")}>
                An error occurred during payment. Please try again later or contact support if the problem persists.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentCancelPage;
