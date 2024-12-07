import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./OrderPage.module.scss";
import { useOrderStore } from "~/store/orderStore";
import { useAuthStore } from "~/store/authStore";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const stripePromise = loadStripe(
  "pk_test_51QHNBSP09ISZsaGpyJazWhAHUQXdTxGRfvebNSlVv1QQfBnoJHyVVX3QqqAeEdhEAWwhpUCxQznAett7a9gr19m600NVhBiMXV"
);

const cx = classNames.bind(styles);

function OrderPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { createOrder } = useOrderStore();
  const { user } = useAuthStore();
  const [orderData, setOrderData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutes in seconds

  useEffect(() => {
    if (!location.state) {
      toast.error("No ticket information available");
      navigate("/");
      return;
    }
    console.log("Order Data:", location.state);
    setOrderData(location.state);
  }, [location, navigate]);

  const handleConfirmOrder = async () => {
    try {
      setIsProcessing(true);

      // 1. Create order first
      const orderResponse = await createOrder({
        screeningId: orderData.screeningId,
        seats: orderData.selectedSeats.map(seat => ({
          seatNumber: seat.seatNumber,
          price: Number(seat.price)
        })),
        movieId: orderData.movieInfo._id,
        roomId: orderData.roomInfo._id,
      });

      if (!orderResponse || !orderResponse.order) {
        throw new Error('No order information received');
      }

      // 2. Create Stripe Checkout Session
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/payment/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          orderId: orderResponse.order._id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Payment session creation failed');
      }

      const { url } = await response.json();

      // 3. Redirect to Stripe payment page
      window.location.href = url;

    } catch (error) {
      console.error("Order error details:", error);
      toast.error(error.message || "Order failed");
    } finally {
      setIsProcessing(false);
    }
  };

  // Function to handle the Back button
  const handleGoBack = async () => {
    try {
      // Release the seats
      const releasePromises = orderData.selectedSeats.map(seat =>
        axios.post(`http://localhost:8080/api/screening/${orderData.screeningId}/release-seat`, {
          seatNumber: seat.seatNumber
        })
      );

      await Promise.all(releasePromises);

      // Clear timeout
      const timeoutId = sessionStorage.getItem('seatTimeoutId');
      if (timeoutId) {
        clearTimeout(timeoutId);
        sessionStorage.removeItem('seatTimeoutId');
      }

      // Go back to the previous page
      navigate(-1);
    } catch (error) {
      console.error("Error releasing seats:", error);
      toast.error("Error releasing seats");
      // Allow the user to go back even if there's an error
      navigate(-1);
    }
  };

  // Add useEffect to handle countdown
  useEffect(() => {
    if (!timeLeft) {
      // Time's up
      toast.error("Time's up!");
      navigate(-1);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, navigate]);

  // Function to format time
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!orderData || !user) return <div>Loading...</div>;

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("content")}>
          <h2>Confirm Your Order</h2>

          {/* Countdown timer */}
          <div className={cx("countdown-timer")}>
            <div className={cx("timer", { warning: timeLeft <= 60 })}>
              {formatTime(timeLeft)}
            </div>
            <div className={cx("timer-text")}>
              Time remaining to complete order
            </div>
          </div>

          {/* Customer Information */}
          <div className={cx("user-info")}>
            <h3>Customer Information</h3>
            <div className={cx("info-item")}>
              <span>Full Name:</span>
              <span>{user.name}</span>
            </div>
            <div className={cx("info-item")}>
              <span>Email:</span>
              <span>{user.email}</span>
            </div>
          </div>

          {/* Ticket Information */}
          <div className={cx("ticket-info")}>
            <h3>Ticket Details</h3>
            <div className={cx("info-item")}>
              <span>Cinema:</span>
              <span>{orderData.cinemaInfo.name}</span>
            </div>
            <div className={cx("info-item")}>
              <span>Theater:</span>
              <span>{orderData.roomInfo.name} ({orderData.roomInfo.screenType})</span>
            </div>
            <div className={cx("info-item")}>
              <span>Movie:</span>
              <span>{orderData.movieInfo.name || 'No movie name'}</span>
            </div>
            <div className={cx("info-item")}>
              <span>Showtime:</span>
              <span>{new Date(orderData.showTime).toLocaleString('en-US')}</span>
            </div>
            <div className={cx("seats-info")}>
              <h3>Seat Information</h3>
              <div className={cx("info-item")}>
                <span>Seat Numbers:</span>
                <span>
                  {orderData.selectedSeats
                    .map(seat => seat.seatNumber)
                    .join(', ')}
                </span>
              </div>
              <div className={cx("info-item")}>
                <span>Price per Seat:</span>
                <span>${orderData.selectedSeats[0].price.toLocaleString('en-US')}</span>
              </div>
              <div className={cx("info-item")}>
                <span>Number of Seats:</span>
                <span>{orderData.selectedSeats.length}</span>
              </div>
              <div className={cx("info-item")}>
                <span>Total Seat Cost:</span>
                <span>
                  ${orderData.selectedSeats
                    .reduce((sum, seat) => sum + seat.price, 0)
                    .toLocaleString('en-US')}
                </span>
              </div>
            </div>
            <div className={cx("total-price")}>
              <span>Total Payment:</span>
              <span>${orderData.totalPrice.toLocaleString('en-US')}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={cx("actions")}>
            <button
              className={cx("confirm-button")}
              onClick={handleConfirmOrder}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Confirm Order"}
            </button>
            <button
              className={cx("cancel-button")}
              onClick={handleGoBack}
              disabled={isProcessing}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderPage;
