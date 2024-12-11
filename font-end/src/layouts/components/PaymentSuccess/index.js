import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import axiosClient from "~/api/axiosClient";
import LoadingSpinner from "~/components/LoadingSpinner";
import classNames from "classnames/bind";
import styles from "./PaymentSuccess.module.scss";

const cx = classNames.bind(styles);

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      setError("Invalid session ID");
      setLoading(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await axiosClient.get(`/api/payment/success?session_id=${sessionId}`);
        if (response.data.success) {
          setOrderDetails(response.data.order);
        } else {
          setError("Payment verification failed");
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        setError(error.response?.data?.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className={cx("error-container")}>
        <h2>Payment Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate("/")}>Return to Home</button>
      </div>
    );
  }

  return (
    <div className={cx("success-container")}>
      <div className={cx("success-content")}>
        <CheckCircle className={cx("success-icon")} />
        <h2>Payment Successful!</h2>
        {orderDetails && (
          <div className={cx("order-details")}>
            <h3>Order Details</h3>
            <p>Order ID: {orderDetails._id}</p>
            <p>Movie: {orderDetails.ticketId.movieId.name}</p>
            <p>Show Time: {new Date(orderDetails.ticketId.screeningId.showTime).toLocaleString()}</p>
            <p>Amount Paid: ${orderDetails.totalAmount}</p>
            <p>Status: {orderDetails.status}</p>
          </div>
        )}
        <div className={cx("action-buttons")}>
          <button onClick={() => navigate("/profile/orders")}>View Orders</button>
          <button onClick={() => navigate("/")}>Return to Home</button>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
