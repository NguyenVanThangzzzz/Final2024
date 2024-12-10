import axios from "axios";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import NotificationSeat from "~/components/NotificationSeat";
import { useRoomStore } from "~/store/roomStore";
import { useScreeningStore } from "~/store/screeningStore";
import { useTicketStore } from "~/store/ticketStore";
import styles from "./RoomPage.module.scss";

const cx = classNames.bind(styles);

function RoomPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const movieId = searchParams.get("movieId");
  const { screenings, fetchScreeningsByRoom } = useRoomStore();
  const { fetchScreeningById } = useScreeningStore();
  const navigate = useNavigate();
  const {
    selectedSeats,
    totalPrice,
    addSelectedSeat,
    removeSelectedSeat,
    resetSelection,
  } = useTicketStore();

  const [loading, setLoading] = useState(true);
  const [selectedScreening, setSelectedScreening] = useState(null);
  const SEATS_PER_ROW = 20;
  const [showNotification, setShowNotification] = useState(false);

  // Sửa lại hàm để lấy screening có showTime sớm nhất
  const getFirstScreening = (screenings) => {
    if (!screenings || screenings.length === 0) return null;
    // Sắp xếp theo thời gian chiếu (showTime) và lấy screening sớm nhất
    return screenings.reduce((earliest, current) => {
      return new Date(current.showTime) < new Date(earliest.showTime)
        ? current
        : earliest;
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
          (screening) =>
            screening.movieId?._id === movieId && screening.roomId?.cinemaId
        );

        if (filteredScreenings && filteredScreenings.length > 0) {
          const firstScreening = getFirstScreening(filteredScreenings);
          if (firstScreening) {
            const screeningDetails = await fetchScreeningById(
              firstScreening._id
            );
            if (screeningDetails.roomId?.cinemaId) {
              setSelectedScreening(screeningDetails);
            } else {
              toast.error("Cannot load cinema information");
            }
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Cannot load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [
    slug,
    movieId,
    fetchScreeningsByRoom,
    fetchScreeningById,
    resetSelection,
  ]);

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      resetSelection();
    };
  }, [resetSelection]);

  // Hm xử lý khi click vào ghế
  const handleSeatClick = async (seat) => {
    if (!selectedScreening) {
      toast.error("Please select a showtime first");
      return;
    }

    // Chỉ cho phép tương tác với ghế available
    if (
      seat.status !== "available" &&
      !selectedSeats.some((s) => s.seatNumber === seat.seatNumber)
    ) {
      toast.error("This seat is not available");
      return;
    }

    // Kiểm tra xem ghế đã được chọn chưa
    const isSelected = selectedSeats.some(
      (s) => s.seatNumber === seat.seatNumber
    );

    if (isSelected) {
      removeSelectedSeat(seat.seatNumber);
    } else {
      // Thêm kiểm tra số lượng ghế tối đa
      if (selectedSeats.length >= 10) {
        setShowNotification(true);
        return;
      }
      addSelectedSeat({
        seatNumber: seat.seatNumber,
        price: seat.price,
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
        toast.error("Cannot load cinema information");
        return;
      }
      setSelectedScreening(screeningData);
    } catch (error) {
      console.error("Error fetching screening details:", error);
      toast.error("Cannot load screening details");
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
      const row = [];

      for (
        let colIndex = 0;
        colIndex < SEATS_PER_ROW && seatIndex < totalSeats;
        colIndex++
      ) {
        // Thêm null để tạo lối đi giữa ghế 10 và 11
        if (colIndex === 10) {
          row.push(null);
        }
        row.push(seats[seatIndex]);
        seatIndex++;
      }

      matrix.push(row);

      // Thêm một hàng null sau mỗi 2 hàng ghế để tạo lối đi
      if ((rowIndex + 1) % 2 === 0 && rowIndex < totalRows - 1) {
        matrix.push(Array(SEATS_PER_ROW + 1).fill(null)); // +1 vì có thêm lối đi gia
      }
    }

    return matrix;
  };

  // Format date and time
  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString("en-US", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  // Thêm hàm xử lý next
  const handleNext = async () => {
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat");
      return;
    }

    try {
      // Sửa lại URL API
      const promises = selectedSeats.map((seat) =>
        axios.post(
          `http://localhost:8080/api/screening/${selectedScreening._id}/hold-seat`,
          {
            seatNumber: seat.seatNumber,
          }
        )
      );

      await Promise.all(promises);

      // Tạo timeout để tự động hủy ghế sau 5 phút
      const timeoutId = setTimeout(async () => {
        try {
          const releasePromises = selectedSeats.map((seat) =>
            axios.post(
              `http://localhost:8080/api/screening/${selectedScreening._id}/release-seat`,
              {
                seatNumber: seat.seatNumber,
              }
            )
          );
          await Promise.all(releasePromises);
          resetSelection();
          toast.warning("Time out, please re-select");
          navigate("/room/" + slug + "?movieId=" + movieId);
        } catch (error) {
          console.error("Error releasing seats:", error);
        }
      }, 5 * 60 * 1000); // 5 phút

      // Lưu timeoutId vào sessionStorage để có thể clear khi cần
      sessionStorage.setItem("seatTimeoutId", timeoutId);

      navigate("/order", {
        state: {
          screeningId: selectedScreening._id,
          selectedSeats,
          totalPrice,
          movieInfo: selectedScreening.movieId,
          showTime: selectedScreening.showTime,
          cinemaInfo: selectedScreening.roomId.cinemaId,
          roomInfo: selectedScreening.roomId,
        },
      });
    } catch (error) {
      console.error("Error holding seats:", error);
      toast.error("Cannot hold seat, please try again");
    }
  };

  // Thêm useEffect để lắng nghe sự thay đổi của screening
  useEffect(() => {
    const interval = setInterval(async () => {
      if (selectedScreening) {
        try {
          const updatedScreening = await fetchScreeningById(
            selectedScreening._id
          );
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
      const timeoutId = sessionStorage.getItem("seatTimeoutId");
      if (timeoutId) {
        clearTimeout(timeoutId);
        sessionStorage.removeItem("seatTimeoutId");
      }
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const seatMatrix = selectedScreening
    ? createSeatMatrix(selectedScreening.seats)
    : [];

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("content")}>
          <h2>Room Seats</h2>

          {/* Showtimes section */}
          <div className={cx("screenings-container")}>
            <h3>Showtimes</h3>
            <div className={cx("screenings-list")}>
              {screenings
                .filter((screening) => screening.movieId?._id === movieId)
                .sort((a, b) => new Date(a.showTime) - new Date(b.showTime))
                .map((screening) => (
                  <div
                    key={screening._id}
                    className={cx("screening-item", {
                      active: selectedScreening?._id === screening._id,
                    })}
                    onClick={() => handleScreeningSelect(screening)}
                  >
                    <div className={cx("movie-name")}>
                      <span>Name Movie: </span>
                      {screening.movieId?.name}
                    </div>
                    <div className={cx("show-time")}>
                      <span>Date/Time: </span>
                      {formatDateTime(screening.showTime)}
                    </div>
                    <div className={cx("end-time")}>
                      <span>End Time: </span>
                      {formatDateTime(screening.endTime)}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Seats layout section - Move this section up */}
          {selectedScreening && (
            <>
              <div className={cx("screen")}>
                <div className={cx("screen-text")}>SCREEN</div>
              </div>

              <div className={cx("seats-container")}>
                <div className={cx("exit-sign")}>
                  <div className={cx("exit-icon")}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 12H15M15 12L12 9M15 12L12 15"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M9 4H19C19.5523 4 20 4.44772 20 5V19C20 19.5523 19.5523 20 19 20H9"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <span>EXIT</span>
                </div>

                {seatMatrix.map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className={cx("row", {
                      "spacing-row": row.every((seat) => seat === null),
                    })}
                  >
                    <div className={cx("row-label")}>
                      {row.every((seat) => seat !== null)
                        ? String.fromCharCode(65 + rowIndex)
                        : ""}
                    </div>
                    {row.map((seat, seatIndex) =>
                      seat === null ? (
                        <div
                          key={`${rowIndex}-${seatIndex}`}
                          className={cx("seat-space")}
                        />
                      ) : (
                        <div
                          key={`${rowIndex}-${seatIndex}`}
                          className={cx("seat", {
                            booked: seat.status === "booked",
                            available: seat.status === "available",
                            selected: selectedSeats.some(
                              (s) => s.seatNumber === seat.seatNumber
                            ),
                            pending: seat.status === "pending",
                          })}
                          onClick={() => handleSeatClick(seat)}
                        >
                          {seat.seatNumber}
                        </div>
                      )
                    )}
                    <div className={cx("row-label")}>
                      {row.every((seat) => seat !== null)
                        ? String.fromCharCode(65 + rowIndex)
                        : ""}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Info container - Move this section down */}
          <div className={cx("info-container")}>
            {/* Selected screening info */}
            {selectedScreening && (
              <div className={cx("selected-screening-info")}>
                <h4>Selected Showtime:</h4>
                <p>
                  <span>Movie:</span>
                  <span>{selectedScreening.movieId.name}</span>
                </p>
                <p>
                  <span>Time:</span>
                  <span>{formatDateTime(selectedScreening.showTime)}</span>
                </p>
                <p>
                  <span>Ticket Price:</span>
                  <span>
                    $
                    {selectedScreening.price.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </p>
              </div>
            )}

            {/* Ticket preview section */}
            <div className={cx("ticket-preview")}>
              <div className={cx("seat-legend")}>
                <div className={cx("legend-item")}>
                  <div className={cx("legend-seat", "normal")}></div>
                  <span>Normal Seat</span>
                </div>
                <div className={cx("legend-item")}>
                  <div className={cx("legend-seat", "selected")}></div>
                  <span>Selected Seat</span>
                </div>
                <div className={cx("legend-item")}>
                  <div className={cx("legend-seat", "booked")}></div>
                  <span>Booked Seat</span>
                </div>
                <div className={cx("legend-item")}>
                  <div className={cx("legend-seat", "pending")}></div>
                  <span>Pending Seat</span>
                </div>
              </div>
              <div className={cx("selected-seats")}>
                <h4>Selected Seats:</h4>
                {selectedSeats.length > 0 ? (
                  <p>
                    {selectedSeats.map((seat) => seat.seatNumber).join(", ")}
                  </p>
                ) : (
                  <p>No seats selected</p>
                )}
              </div>

              <div className={cx("price-info")}>
                <h4>Price:</h4>
                <p>
                  $
                  {totalPrice.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>

              <button
                className={cx("next-button")}
                onClick={handleNext}
                disabled={selectedSeats.length === 0}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
      <NotificationSeat
        message="You can only select up to 10 seats at a time"
        isVisible={showNotification}
        onClose={() => setShowNotification(false)}
      />
    </div>
  );
}

export default RoomPage;
