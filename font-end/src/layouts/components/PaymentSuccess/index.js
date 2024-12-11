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
        setIsLoading(true);
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
        <div className={cx("content")}>
          <div className={cx("loading")}>Processing payment...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={cx("wrapper")}>
      <div className={cx("content")}>
        {paymentStatus === "success" ? (
          <>
            <div className={cx("success-icon")}>
              <FontAwesomeIcon icon={faCheckCircle} />
            </div>
            <h2>Payment Successful!</h2>
            {orderDetails && orderDetails.status === 'paid' && (
              <div className={cx("order-details")}>
                <h3>Order Details:</h3>
                <div className={cx("detail-item")}>
                  <span>
                    <FontAwesomeIcon icon={faFilm} className={cx("icon")} /> Movie:
                  </span>
                  <span>{orderDetails.ticketId.movieId.name}</span>
                </div>
                <div className={cx("detail-item")}>
                  <span>
                    <FontAwesomeIcon icon={faClock} className={cx("icon")} /> Showtime:
                  </span>
                  <span>{orderDetails.ticketId.screeningId.showTime}</span>
                </div>
                <div className={cx("detail-item")}>
                  <span>
                    <FontAwesomeIcon icon={faBuilding} className={cx("icon")} /> Cinema:
                  </span>
                  <span>{orderDetails.ticketId.roomId.cinemaId.name}</span>
                </div>
                <div className={cx("detail-item")}>
                  <span>
                    <FontAwesomeIcon icon={faLocationDot} className={cx("icon")} /> Address:
                  </span>
                  <span>{orderDetails.ticketId.roomId.cinemaId.streetName}</span>
                </div>
                <div className={cx("detail-item")}>
                  <span>
                    <FontAwesomeIcon icon={faVideo} className={cx("icon")} /> Room:
                  </span>
                  <span>{`${orderDetails.ticketId.roomId.name} (${orderDetails.ticketId.roomId.screenType})`}</span>
                </div>
                <div className={cx("detail-item")}>
                  <span>
                    <FontAwesomeIcon icon={faCouch} className={cx("icon")} /> Seats:
                  </span>
                  <span>{orderDetails.ticketId.seatNumbers.join(", ")}</span>
                </div>
                <div className={cx("detail-item")}>
                  <span>
                    <FontAwesomeIcon icon={faUser} className={cx("icon")} /> Customer:
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
                    <FontAwesomeIcon icon={faDollarSign} className={cx("icon")} /> Total:
                  </span>
                  <span>${parseFloat(orderDetails.totalAmount).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}</span>
                </div>
                <div className={cx("detail-item", "status")}>
                  <span>
                    <FontAwesomeIcon icon={faCheckCircle} className={cx("icon")} /> Status:
                  </span>
                  <span className={cx("status-paid")}>Paid</span>
                </div>
              </div>
            )}
            <button
              className={cx("home-button")}
              onClick={() => navigate("/")}
            >
              Back to Home
            </button>
          </>
        ) : (
          <div className={cx("error")}>
            <h2>Error Occurred</h2>
            <p>{paymentError}</p>
            <button
              className={cx("retry-button")}
              onClick={() => navigate("/payment")}
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentSuccessPage;
