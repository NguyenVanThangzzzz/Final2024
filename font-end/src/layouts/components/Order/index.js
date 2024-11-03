import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./OrderPage.module.scss";
import { useOrderStore } from "~/store/orderStore";
import { useAuthStore } from "~/store/authStore";
import { toast } from "react-toastify";

const cx = classNames.bind(styles);

function OrderPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { createOrder } = useOrderStore();
  const { user } = useAuthStore();
  const [orderData, setOrderData] = useState(null);

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
      const response = await createOrder({
        screeningId: orderData.screeningId,
        seats: orderData.selectedSeats,
        movieId: orderData.movieInfo._id,
        roomId: orderData.roomInfo._id,
      });

      toast.success("Đặt vé thành công!");
      navigate(`/my-orders/${response.order._id}`);
    } catch (error) {
      console.error("Order error details:", error);
      toast.error(error.response?.data?.message || "Lỗi khi đặt vé");
    }
  };

  if (!orderData || !user) return <div>Loading...</div>;

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("content")}>
          <h2>Xác nhận đặt vé</h2>

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
                <span>{orderData.selectedSeats[0].price.toLocaleString('vi-VN')} VNĐ</span>
              </div>
              <div className={cx("info-item")}>
                <span>Số lượng ghế:</span>
                <span>{orderData.selectedSeats.length}</span>
              </div>
              <div className={cx("info-item")}>
                <span>Tổng tiền ghế:</span>
                <span>{orderData.totalPrice.toLocaleString('vi-VN')} VNĐ</span>
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
            >
              Xác nhận đặt vé
            </button>
            <button
              className={cx("cancel-button")}
              onClick={() => navigate(-1)}
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
