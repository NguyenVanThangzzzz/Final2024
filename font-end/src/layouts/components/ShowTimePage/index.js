import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./ShowtimePage.module.scss";
import { useCinemaStore } from "~/store/cinemaStore";
import { useScreeningStore } from "~/store/screeningStore";
import { useMovieStore } from "~/store/movieStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faFilm, faClock } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

function ShowtimePage() {
  const { cinemas, fetchAllCinemas } = useCinemaStore();
  const { movies, fetchAllMovies } = useMovieStore();
  const { screenings, fetchAllScreenings } = useScreeningStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredScreenings, setFilteredScreenings] = useState([]);

  useEffect(() => {
    fetchAllCinemas();
    fetchAllMovies();
    fetchAllScreenings();
  }, [fetchAllCinemas, fetchAllMovies, fetchAllScreenings]);

  useEffect(() => {
    // Lọc các suất chiếu theo ngày đã chọn
    const filtered = screenings.filter(screening => {
      const screeningDate = new Date(screening.showTime);
      return screeningDate.toDateString() === selectedDate.toDateString();
    });
    setFilteredScreenings(filtered);
  }, [screenings, selectedDate]);

  // Tạo mảng 7 ngày kể từ ngày hiện tại
  const getNextDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  return (
    <div className={cx("showtime-container")}>
      {/* Date Selector */}
      <div className={cx("date-selector")}>
        {getNextDays().map((date) => (
          <button
            key={date.toISOString()}
            className={cx("date-button", {
              active: date.toDateString() === selectedDate.toDateString(),
            })}
            onClick={() => setSelectedDate(date)}
          >
            <span className={cx("day")}>{date.toLocaleDateString("en-US", { weekday: "short" })}</span>
            <span className={cx("date")}>{date.getDate()}</span>
          </button>
        ))}
      </div>

      {/* Cinema Listings */}
      <div className={cx("cinema-listings")}>
        {cinemas.map((cinema) => (
          <div key={cinema._id} className={cx("cinema-section")}>
            <div className={cx("cinema-header")}>
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              <h2>{cinema.name}</h2>
            </div>

            {/* Movies at this cinema */}
            <div className={cx("movie-listings")}>
              {movies.map((movie) => {
                const movieScreenings = filteredScreenings.filter(
                  screening => 
                    screening.movieId === movie._id && 
                    screening.roomId.cinemaId === cinema._id
                );

                if (movieScreenings.length === 0) return null;

                return (
                  <div key={movie._id} className={cx("movie-section")}>
                    <div className={cx("movie-info")}>
                      <FontAwesomeIcon icon={faFilm} />
                      <h3>{movie.name}</h3>
                      <span className={cx("duration")}>{movie.duration} mins</span>
                    </div>

                    <div className={cx("screening-times")}>
                      {movieScreenings.map((screening) => (
                        <a
                          key={screening._id}
                          href={`/booking/${screening._id}`}
                          className={cx("time-slot")}
                        >
                          <FontAwesomeIcon icon={faClock} />
                          {new Date(screening.showTime).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </a>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShowtimePage; 