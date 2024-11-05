import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import { useRoomStore } from "~/store/roomStore";
import { useScreeningStore } from "~/store/screeningStore";
import { useTicketStore } from "~/store/ticketStore";
import styles from "./RoomPage.module.scss";
import { toast } from "react-toastify";
import axios from "axios";

const cx = classNames.bind(styles);

function RoomPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const movieId = searchParams.get('movieId');
  const { screenings, fetchScreeningsByRoom } = useRoomStore();
  const { fetchScreeningById } = useScreeningStore();
  const navigate = useNavigate();
  const {
    selectedSeats,
    totalPrice,
    addSelectedSeat,
    removeSelectedSeat,
    resetSelection
  } = useTicketStore();

  const [loading, setLoading] = useState(true);
  const [selectedScreening, setSelectedScreening] = useState(null);
  const SEATS_PER_ROW = 20;

  // Thêm state để theo dõi interval cleanup
  const [pendingTimeouts, setPendingTimeouts] = useState({});

  // Sửa lại hàm để lấy screening đầu tiên được tạo
  const getFirstScreening = (screenings) => {
    if (!screenings || screenings.length === 0) return null;
    // Sắp xếp theo thời gian tạo (createdAt) và lấy screening đầu tiên
    return screenings.reduce((first, current) => {
      return new Date(current.createdAt) < new Date(first.createdAt) ? current : first;
    });
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        resetSelection();

        const fetchedScreenings = await fetchScreeningsByRoom(slug);

        // Kiểm tra và lọc các screening hợp lệ
        const filteredScreenings = fetchedScreenings.filter(
          screening => screening.movieId?._id === movieId && screening.roomId?.cinemaId
        );

        if (filteredScreenings && filteredScreenings.length > 0) {
          const firstScreening = getFirstScreening(filteredScreenings);
          if (firstScreening) {
            const screeningDetails = await fetchScreeningById(firstScreening._id);
            if (screeningDetails.roomId?.cinemaId) {
              setSelectedScreening(screeningDetails);
            } else {
              toast.error("Không thể tải thông tin rạp chiếu");
            }
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Không thể tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug, movieId, fetchScreeningsByRoom, fetchScreeningById, resetSelection]);

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      resetSelection();
    };
  }, [resetSelection]);

  // Hm xử lý khi click vào ghế
  const handleSeatClick = async (seat) => {
    if (!selectedScreening) {
      toast.error("Vui lòng chọn suất chiếu trước");
      return;
    }

    // Chỉ cho phép tương tác với ghế available
    if (seat.status !== 'available' && !selectedSeats.some(s => s.seatNumber === seat.seatNumber)) {
      toast.error("Ghế này không khả dụng");
      return;
    }

    // Kiểm tra xem ghế đã được chọn chưa
    const isSelected = selectedSeats.some(s => s.seatNumber === seat.seatNumber);

    if (isSelected) {
      removeSelectedSeat(seat.seatNumber);
    } else {
      addSelectedSeat({
        seatNumber: seat.seatNumber,
        price: seat.price
      });
    }
  };

  // Hàm xử lý khi chọn suất chiếu
  const handleScreeningSelect = async (screening) => {
    try {
      // Reset selection trước khi load screening mới
      resetSelection();

      const screeningData = await fetchScreeningById(screening._id);
      if (!screeningData.roomId?.cinemaId) {
        console.error("Missing cinema information");
        toast.error("Không thể tải thông tin rạp chiếu");
        return;
      }
      setSelectedScreening(screeningData);
    } catch (error) {
      console.error("Error fetching screening details:", error);
      toast.error("Không thể tải thông tin suất chiếu");
    }
  };

  // Thêm hàm để cập nhật trạng thái ghế
  const updateSeatStatus = (seatNumber, newStatus) => {
    if (!selectedScreening) return;

    setSelectedScreening(prev => ({
      ...prev,
      seats: prev.seats.map(seat =>
        seat.seatNumber === seatNumber
          ? { ...seat, status: newStatus }
          : seat
      )
    }));
  };

  // Hàm tạo ma trận ghế từ danh sách ghế của screening
  const createSeatMatrix = (seats) => {
    if (!seats) return [];

    const matrix = [];
    const totalSeats = seats.length;
    const totalRows = Math.ceil(totalSeats / SEATS_PER_ROW);
    let seatIndex = 0;

    for (let rowIndex = 0; rowIndex < totalRows; rowIndex++) {
      const row = [];

      for (let colIndex = 0; colIndex < SEATS_PER_ROW && seatIndex < totalSeats; colIndex++) {
        row.push(seats[seatIndex]);
        seatIndex++;
      }

      matrix.push(row);
    }

    return matrix;
  };

  // Format date and time
  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString('vi-VN', {
      dateStyle: 'short',
      timeStyle: 'short'
    });
  };

  // Thêm hàm xử lý next
  const handleNext = async () => {
    if (selectedSeats.length === 0) {
      toast.error("Vui lòng chọn ít nhất một ghế");
      return;
    }

    try {
      // Sửa lại URL API
      const promises = selectedSeats.map(seat =>
        axios.post(`http://localhost:8080/api/screening/${selectedScreening._id}/hold-seat`, {
          seatNumber: seat.seatNumber
        })
      );

      await Promise.all(promises);

      // Tạo timeout để tự động hủy ghế sau 5 phút
      const timeoutId = setTimeout(async () => {
        try {
          const releasePromises = selectedSeats.map(seat =>
            axios.post(`http://localhost:8080/api/screening/${selectedScreening._id}/release-seat`, {
              seatNumber: seat.seatNumber
            })
          );
          await Promise.all(releasePromises);
          resetSelection();
          toast.warning("Hết thời gian giữ ghế, vui lòng đặt lại");
          navigate('/room/' + slug + '?movieId=' + movieId);
        } catch (error) {
          console.error("Error releasing seats:", error);
        }
      }, 5 * 60 * 1000); // 5 phút

      // Lưu timeoutId vào sessionStorage để có thể clear khi cần
      sessionStorage.setItem('seatTimeoutId', timeoutId);

      navigate('/order', {
        state: {
          screeningId: selectedScreening._id,
          selectedSeats,
          totalPrice,
          movieInfo: selectedScreening.movieId,
          showTime: selectedScreening.showTime,
          cinemaInfo: selectedScreening.roomId.cinemaId,
          roomInfo: selectedScreening.roomId
        }
      });
    } catch (error) {
      console.error("Error holding seats:", error);
      toast.error("Không thể giữ ghế, vui lòng thử lại");
    }
  };

  // Thêm useEffect để lắng nghe sự thay đổi của screening
  useEffect(() => {
    const interval = setInterval(async () => {
      if (selectedScreening) {
        try {
          const updatedScreening = await fetchScreeningById(selectedScreening._id);
          setSelectedScreening(updatedScreening);
        } catch (error) {
          console.error("Error updating screening data:", error);
        }
      }
    }, 5000); // Cập nhật mỗi 5 giây

    return () => clearInterval(interval);
  }, [selectedScreening, fetchScreeningById]);

  // Cleanup timeouts khi unmount component
  useEffect(() => {
    return () => {
      const timeoutId = sessionStorage.getItem('seatTimeoutId');
      if (timeoutId) {
        clearTimeout(timeoutId);
        sessionStorage.removeItem('seatTimeoutId');
      }
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const seatMatrix = selectedScreening ? createSeatMatrix(selectedScreening.seats) : [];

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("content")}>
          <h2>Room Seats</h2>

          {/* Phần hiển thị lịch chiếu */}
          <div className={cx("screenings-container")}>
            <h3>Lịch chiếu</h3>
            <div className={cx("screenings-list")}>
              {screenings
                .filter(screening => screening.movieId?._id === movieId)
                .map((screening) => (
                  <div
                    key={screening._id}
                    className={cx("screening-item", {
                      active: selectedScreening?._id === screening._id
                    })}
                    onClick={() => handleScreeningSelect(screening)}
                  >
                    <div className={cx("movie-name")}>{screening.movieId?.name}</div>
                    <div className={cx("show-time")}>
                      {formatDateTime(screening.showTime)}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Hiển thị thông tin suất chiếu đã chọn */}
          {selectedScreening && (
            <div className={cx("selected-screening-info")}>
              <h4>Suất chiếu đã chọn:</h4>
              <p>Phim: {selectedScreening.movieId.name}</p>
              <p>Thời gian: {formatDateTime(selectedScreening.showTime)}</p>
              <p>Giá vé: {selectedScreening.price.toLocaleString('vi-VN')} VNĐ</p>
            </div>
          )}

          {/* Hiển thị sơ đồ ghế ngồi khi đã chọn suất chiếu */}
          {selectedScreening && (
            <>
              <div className={cx("screen")}>
                <div className={cx("screen-text")}>SCREEN</div>
              </div>

              <div className={cx("seats-container")}>
                {seatMatrix.map((row, rowIndex) => (
                  <div key={rowIndex} className={cx("row")}>
                    <div className={cx("row-label")}>
                      {String.fromCharCode(65 + rowIndex)}
                    </div>
                    {row.map((seat, seatIndex) => (
                      <div
                        key={`${rowIndex}-${seatIndex}`}
                        className={cx("seat", {
                          booked: seat.status === "booked",
                          available: seat.status === "available",
                          selected: selectedSeats.some(s => s.seatNumber === seat.seatNumber)
                        })}
                        onClick={() => handleSeatClick(seat)}
                      >
                        {seat.seatNumber}
                      </div>
                    ))}
                    <div className={cx("row-label")}>
                      {String.fromCharCode(65 + rowIndex)}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Thêm phần ticket preview */}
          <div className={cx("ticket-preview")}>
            <h3>Ticket Preview</h3>
            {selectedScreening && selectedScreening.roomId && selectedScreening.roomId.cinemaId && (
              <div className={cx("ticket-content")}>
                <div className={cx("movie-info")}>
                  <h4>{selectedScreening.movieId?.name}</h4>
                  <p>
                    <span>Rạp:</span>
                    <span>{selectedScreening.roomId.cinemaId.name}</span>
                  </p>
                  <p>
                    <span>Phòng:</span>
                    <span>{selectedScreening.roomId.name}</span>
                  </p>
                  <p>
                    <span>Thời gian:</span>
                    <span>{formatDateTime(selectedScreening.showTime)}</span>
                  </p>
                  <p>
                    <span>Loại phòng:</span>
                    <span>{selectedScreening.roomId.roomType}</span>
                  </p>
                  <p>
                    <span>Màn hình:</span>
                    <span>{selectedScreening.roomId.screenType}</span>
                  </p>
                </div>

                <div className={cx("selected-seats")}>
                  <h4>Ghế đã chọn:</h4>
                  {selectedSeats.length > 0 ? (
                    <div className={cx("seats-list")}>
                      {selectedSeats.map((seat) => (
                        <div key={seat.seatNumber} className={cx("seat-item")}>
                          <span>Ghế {seat.seatNumber}</span>
                          <span>{seat.price.toLocaleString('vi-VN')} VNĐ</span>
                        </div>
                      ))}
                      <div className={cx("total-price")}>
                        <strong>Tổng tiền:</strong>
                        <span>{totalPrice.toLocaleString('vi-VN')} VNĐ</span>
                      </div>
                    </div>
                  ) : (
                    <p>Chưa có ghế nào được chọn</p>
                  )}
                </div>

                <button
                  className={cx("next-button")}
                  onClick={handleNext}
                  disabled={selectedSeats.length === 0}
                >
                  Tiếp tục
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomPage;
