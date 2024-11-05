import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./PaymentSuccessPage.module.scss";
import { usePaymentStore } from "~/store/paymentStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faFilm,
  faClock,
  faBuilding,
  faLocationDot,
  faVideo,
  faCouch,
  faUser,
  faEnvelope,
  faDollarSign
} from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

function PaymentSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { checkPaymentStatus, paymentStatus, orderDetails, paymentError } = usePaymentStore();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get("session_id");

    if (!sessionId) {
      navigate("/");
      return;
    }

    const verifyPayment = async () => {
      try {
        await checkPaymentStatus(sessionId);
      } catch (error) {
        console.error("Payment verification failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [location, checkPaymentStatus, navigate]);

  if (isLoading) {
    return (
      <div className={cx("wrapper")}>
        <div className={cx("loading")}>Đang xử lý thanh toán...</div>
      </div>
    );
  }

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("content")}>
          {paymentStatus === "success" ? (
            <>
              <div className={cx("success-icon")}>
                <FontAwesomeIcon icon={faCheckCircle} />
              </div>
              <h2>Thanh toán thành công!</h2>
              {orderDetails && (
                <div className={cx("order-details")}>
                  <h3>Chi tiết đơn hàng:</h3>
                  <div className={cx("detail-item")}>
                    <span>
                      <FontAwesomeIcon icon={faFilm} className={cx("icon")} /> Phim:
                    </span>
                    <span>{orderDetails.ticketId.movieId.name}</span>
                  </div>
                  <div className={cx("detail-item")}>
                    <span>
                      <FontAwesomeIcon icon={faClock} className={cx("icon")} /> Suất chiếu:
                    </span>
                    <span>{orderDetails.ticketId.screeningId.showTime}</span>
                  </div>
                  <div className={cx("detail-item")}>
                    <span>
                      <FontAwesomeIcon icon={faBuilding} className={cx("icon")} /> Rạp:
                    </span>
                    <span>{orderDetails.ticketId.roomId.cinemaId.name}</span>
                  </div>
                  <div className={cx("detail-item")}>
                    <span>
                      <FontAwesomeIcon icon={faLocationDot} className={cx("icon")} /> Địa chỉ:
                    </span>
                    <span>{orderDetails.ticketId.roomId.cinemaId.streetName}</span>
                  </div>
                  <div className={cx("detail-item")}>
                    <span>
                      <FontAwesomeIcon icon={faVideo} className={cx("icon")} /> Phòng:
                    </span>
                    <span>{`${orderDetails.ticketId.roomId.name} (${orderDetails.ticketId.roomId.screenType})`}</span>
                  </div>
                  <div className={cx("detail-item")}>
                    <span>
                      <FontAwesomeIcon icon={faCouch} className={cx("icon")} /> Ghế:
                    </span>
                    <span>{orderDetails.ticketId.seatNumbers.join(", ")}</span>
                  </div>
                  <div className={cx("detail-item")}>
                    <span>
                      <FontAwesomeIcon icon={faUser} className={cx("icon")} /> Khách hàng:
                    </span>
                    <span>{orderDetails.userId.name}</span>
                  </div>
                  <div className={cx("detail-item")}>
                    <span>
                      <FontAwesomeIcon icon={faEnvelope} className={cx("icon")} /> Email:
                    </span>
                    <span>{orderDetails.userId.email}</span>
                  </div>
                  <div className={cx("detail-item", "total")}>
                    <span>
                      <FontAwesomeIcon icon={faDollarSign} className={cx("icon")} /> Tổng tiền:
                    </span>
                    <span>${orderDetails.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              )}
              <button
                className={cx("home-button")}
                onClick={() => navigate("/")}
              >
                Về trang chủ
              </button>
            </>
          ) : (
            <div className={cx("error")}>
              <h2>Có lỗi xảy ra</h2>
              <p>{paymentError}</p>
              <button
                className={cx("retry-button")}
                onClick={() => navigate("/payment")}
              >
                Thử lại
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccessPage;
