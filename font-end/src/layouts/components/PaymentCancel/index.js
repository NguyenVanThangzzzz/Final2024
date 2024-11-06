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
    // Reset payment state khi component unmount
    return () => {
      resetPaymentState();
    };
  }, [resetPaymentState]);

  const handleReturnHome = () => {
    navigate("/");
  };

  const handleTryAgain = () => {
    navigate("/booking"); // hoặc quay lại trang đặt vé
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("content")}>
          <FontAwesomeIcon icon={faCircleXmark} className={cx("icon")} />
          <h2>Thanh toán đã bị hủy</h2>
          <p className={cx("message")}>
            {cancelReason || "Rất tiếc, thanh toán của bạn đã bị hủy. Bạn có thể thử lại hoặc chọn một phương thức thanh toán khác."}
          </p>

          <div className={cx("buttons")}>
            <button
              className={cx("button", "primary")}
              onClick={handleTryAgain}
            >
              Thử lại
            </button>
            <button
              className={cx("button", "secondary")}
              onClick={handleReturnHome}
            >
              Về trang chủ
            </button>
          </div>

          {paymentStatus === 'error' && (
            <div className={cx("details")}>
              <h3>Chi tiết lỗi</h3>
              <p className={cx("info")}>
                Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại sau hoặc liên hệ hỗ trợ nếu vấn đề vẫn tiếp tục.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentCancelPage;
