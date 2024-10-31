import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import classNames from "classnames/bind";
import { useRoomStore } from "~/store/roomStore";
import { useScreeningStore } from "~/store/screeningStore";
import styles from "./RoomPage.module.scss";
import { toast } from "react-toastify";

const cx = classNames.bind(styles);

function RoomPage() {
  const { slug } = useParams();
  const { screenings, fetchScreeningsByRoom } = useRoomStore();
  const { fetchScreeningById, updateSeatStatus } = useScreeningStore();

  const [loading, setLoading] = useState(true);
  const [selectedScreening, setSelectedScreening] = useState(null);
  const SEATS_PER_ROW = 20;

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
        // Fetch danh sách screenings
        const fetchedScreenings = await fetchScreeningsByRoom(slug);

        // Nếu có screenings, tự động chọn screening đầu tiên được tạo
        if (fetchedScreenings && fetchedScreenings.length > 0) {
          const firstScreening = getFirstScreening(fetchedScreenings);
          if (firstScreening) {
            const screeningDetails = await fetchScreeningById(firstScreening._id);
            setSelectedScreening(screeningDetails);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setLoading(false);
      }
    };

    loadData();
  }, [slug, fetchScreeningsByRoom, fetchScreeningById]);

  // Hàm xử lý khi click vào ghế
  const handleSeatClick = async (seat) => {
    if (!selectedScreening) {
      toast.error("Vui lòng chọn suất chiếu trước");
      return;
    }

    try {
      // Xác định trạng thái mới dựa trên trạng thái hiện tại
      const newStatus = seat.status === 'available' ? 'booked' : 'available';

      // Cập nhật trạng thái ghế trên server
      await updateSeatStatus(
        selectedScreening._id,
        seat.seatNumber,
        newStatus
      );

      // Fetch lại thông tin screening để cập nhật UI
      const updatedScreening = await fetchScreeningById(selectedScreening._id);
      setSelectedScreening(updatedScreening);

      // Hiển thị thông báo thành công
      toast.success(`Ghế ${seat.seatNumber} đã ${newStatus === 'booked' ? 'được đặt' : 'được hủy'}`);

    } catch (error) {
      console.error("Error updating seat status:", error);
      toast.error("Không thể cập nhật trạng thái ghế");
    }
  };

  // Hàm xử lý khi chọn suất chiếu
  const handleScreeningSelect = async (screening) => {
    try {
      const screeningData = await fetchScreeningById(screening._id);
      setSelectedScreening(screeningData);
    } catch (error) {
      console.error("Error fetching screening details:", error);
      toast.error("Không thể tải thông tin suất chiếu");
    }
  };

  // Hàm tạo ma trận ghế từ danh sách ghế của screening
  const createSeatMatrix = (seats) => {
    if (!seats) return [];

    const matrix = [];
    const totalSeats = seats.length;
    const totalRows = Math.ceil(totalSeats / SEATS_PER_ROW);
    let seatIndex = 0;

    for (let rowIndex = 0; rowIndex < totalRows; rowIndex++) {
      const rowLetter = String.fromCharCode(65 + rowIndex);
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
              {screenings.map((screening) => (
                <div
                  key={screening._id}
                  className={cx("screening-item", {
                    active: selectedScreening?._id === screening._id
                  })}
                  onClick={() => handleScreeningSelect(screening)}
                >
                  <div className={cx("movie-name")}>{screening.movieId.name}</div>
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

              {/* Hiển thị số cột */}
              <div className={cx("column-numbers")}>
                <div className={cx("empty-cell")}></div>
                {Array.from({ length: SEATS_PER_ROW }, (_, i) => (
                  <div key={i} className={cx("column-number")}>{i + 1}</div>
                ))}
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
                          available: seat.status === "available"
                        })}
                        onClick={() => handleSeatClick(seat)}
                      >
                        {seat.seatNumber}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default RoomPage;
