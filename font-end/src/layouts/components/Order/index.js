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
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 phút tính bằng giây

  useEffect(() => {
    if (!location.state) {
      toast.error("Không có thông tin đặt vé");
      navigate("/");
      return;
    }
    console.log("Order Data:", location.state);
    setOrderData(location.state);
  }, [location, navigate]);

  const handleConfirmOrder = async () => {
    try {
      setIsProcessing(true);

      // 1. Tạo order trước
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
        throw new Error('Không nhận được thông tin đơn hàng');
      }

      // 2. Tạo Stripe Checkout Session
      const response = await fetch('http://localhost:8080/api/payment/create-checkout-session', {
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
        throw new Error(errorData.message || 'Lỗi khi tạo phiên thanh toán');
      }

      const { url } = await response.json();

      // 3. Chuyển hướng đến trang thanh toán Stripe
      window.location.href = url;

    } catch (error) {
      console.error("Order error details:", error);
      toast.error(error.message || "Lỗi khi đặt vé");
    } finally {
      setIsProcessing(false);
    }
  };

  // Hàm xử lý khi bấm nút Quay lại
  const handleGoBack = async () => {
    try {
      // Giải phóng các ghế đang giữ
      const releasePromises = orderData.selectedSeats.map(seat =>
        axios.post(`http://localhost:8080/api/screening/${orderData.screeningId}/release-seat`, {
          seatNumber: seat.seatNumber
        })
      );

      await Promise.all(releasePromises);

      // Xóa timeout
      const timeoutId = sessionStorage.getItem('seatTimeoutId');
      if (timeoutId) {
        clearTimeout(timeoutId);
        sessionStorage.removeItem('seatTimeoutId');
      }

      // Quay lại trang trước
      navigate(-1);
    } catch (error) {
      console.error("Error releasing seats:", error);
      toast.error("Có lỗi xảy ra khi hủy ghế");
      // Vẫn cho phép người dùng quay lại ngay cả khi có lỗi
      navigate(-1);
    }
  };

  // Thêm useEffect để xử lý đếm ngược
  useEffect(() => {
    if (!timeLeft) {
      // Hết thời gian
      toast.error("Hết thời gian giữ ghế!");
      navigate(-1);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, navigate]);

  // Hàm format thời gian
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
          <h2>Xác nhận đặt vé</h2>

          {/* Thêm countdown timer */}
          <div className={cx("countdown-timer")}>
            <div className={cx("timer", { warning: timeLeft <= 60 })}>
              {formatTime(timeLeft)}
            </div>
            <div className={cx("timer-text")}>
              Thời gian giữ ghế còn lại
            </div>
          </div>

          {/* Thông tin người mua */}
          <div className={cx("user-info")}>
            <h3>Thông tin người mua</h3>
            <div className={cx("info-item")}>
              <span>Họ tên:</span>
              <span>{user.name}</span>
            </div>
            <div className={cx("info-item")}>
              <span>Email:</span>
              <span>{user.email}</span>
            </div>
          </div>

          {/* Thông tin vé */}
          <div className={cx("ticket-info")}>
            <h3>Thông tin vé</h3>
            <div className={cx("info-item")}>
              <span>Rạp:</span>
              <span>{orderData.cinemaInfo.name}</span>
            </div>
            <div className={cx("info-item")}>
              <span>Phòng:</span>
              <span>{orderData.roomInfo.name} ({orderData.roomInfo.screenType})</span>
            </div>
            <div className={cx("info-item")}>
              <span>Phim:</span>
              <span>{orderData.movieInfo.name || 'Không có tên phim'}</span>
            </div>
            <div className={cx("info-item")}>
              <span>Suất chiếu:</span>
              <span>{new Date(orderData.showTime).toLocaleString('vi-VN')}</span>
            </div>
            <div className={cx("seats-info")}>
              <h3>Thông tin ghế</h3>
              <div className={cx("info-item")}>
                <span>Số ghế:</span>
                <span>
                  {orderData.selectedSeats
                    .map(seat => seat.seatNumber)
                    .join(', ')}
                </span>
              </div>
              <div className={cx("info-item")}>
                <span>Giá mỗi ghế:</span>
                <span>${(orderData.selectedSeats[0].price).toFixed(2)}</span>
              </div>
              <div className={cx("info-item")}>
                <span>Số lượng ghế:</span>
                <span>{orderData.selectedSeats.length}</span>
              </div>
              <div className={cx("info-item")}>
                <span>Tổng tiền:</span>
                <span>${(orderData.selectedSeats.reduce((sum, seat) => sum + seat.price, 0)).toFixed(2)}</span>
              </div>
            </div>
            <div className={cx("total-price")}>
              <span>Tổng tiền:</span>
              <span>{orderData.totalPrice.toLocaleString('vi-VN')} VNĐ</span>
            </div>
          </div>

          {/* Nút xác nhận */}
          <div className={cx("actions")}>
            <button
              className={cx("confirm-button")}
              onClick={handleConfirmOrder}
              disabled={isProcessing}
            >
              {isProcessing ? "Đang xử lý..." : "Xác nhận đặt vé"}
            </button>
            <button
              className={cx("cancel-button")}
              onClick={handleGoBack}
              disabled={isProcessing}
            >
              Quay lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderPage;
