import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCinemaStore } from "../../../store/cinemaStore";
import { useMovieStore } from "../../../store/movieStore";
import { useRoomStore } from "../../../store/roomStore";
import styles from "./FilmPage.module.scss";

const cx = classNames.bind(styles);

function FilmPage() {
  const { slug } = useParams();
  const navigate = useNavigate(); // Khởi tạo hook điều hướng
  const { movies, fetchAllMovies, loading: movieLoading } = useMovieStore();
  const { cinemas, fetchAllCinemas, loading: cinemaLoading } = useCinemaStore();
  const { fetchRoomsByCinema } = useRoomStore();
  const [movie, setMovie] = useState(null);
  const [rooms, setRooms] = useState({});

  // Lấy dữ liệu phim
  useEffect(() => {
    if (movies.length === 0) {
      fetchAllMovies();
    }
  }, [fetchAllMovies, movies.length]);

  // Lấy dữ liệu rạp chiếu phim
  useEffect(() => {
    fetchAllCinemas();
  }, [fetchAllCinemas]);

  // Lấy d��� liệu phim được chọn
  useEffect(() => {
    const selectedMovie = movies.find((m) => m.slug === slug || m._id === slug);
    setMovie(selectedMovie);
  }, [slug, movies]);

  // Lấy danh sách phòng theo từng rạp chiếu phim
  useEffect(() => {
    cinemas.forEach((cinema) => {
      fetchRoomsByCinema(cinema._id).then((response) => {
        setRooms((prevRooms) => ({
          ...prevRooms,
          [cinema._id]: response?.data?.rooms || [],
        }));
      });
    });
  }, [cinemas, fetchRoomsByCinema]);

  const handleRoomClick = (roomId) => {
    navigate(`/room/${roomId}?movieId=${movie._id}`);
  };

  if (movieLoading || cinemaLoading) {
    return <div>Loading...</div>;
  }

  if (!movie) {
    return <div>Không tìm thấy phim</div>;
  }

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        {/* Movie Details Section */}
        <div className={cx("movieDetail")}>
          <img
            src={movie.image}
            alt={movie.name}
            className={cx("movieImage")}
          />
          <div className={cx("movieInfo")}>
            <h2>{movie.name}</h2>
            <p>
              <strong>Thể loại:</strong> {movie.genres}
            </p>
            <p>
              <strong>Đạo diễn:</strong> {movie.director}
            </p>
            <p>
              <strong>Diễn viên:</strong> {movie.actors}
            </p>
            <p className={cx("description")}>{movie.description}</p>
          </div>
        </div>

        <h3 className={cx("cinemaTitle")}>CINEMA</h3>
        <div className={cx("sectionDivider")}></div>

        {/* Cinema List Section */}
        <div className={cx("cinemaList")}>
          {cinemas.map((cinema) => (
            <div key={cinema._id} className={cx("cinemaCard")}>
              <div className={cx("cinemaInfo")}>
                <h3>{cinema.name}</h3>
                <p>
                  <strong>Địa chỉ:</strong> {cinema.streetName}, {cinema.state},{" "}
                  {cinema.country}
                </p>
                <p>
                  <strong>Postal Code:</strong> {cinema.postalCode}
                </p>
                <p>
                  <strong>Phone:</strong> {cinema.phoneNumber}
                </p>
              </div>

              {/* Rooms displayed with clickable and hover effect */}
              <div className={cx("rooms")}>
                {rooms[cinema._id]?.map((room) => (
                  <div
                    key={room._id}
                    className={cx("roomDetails")}
                    onClick={() => handleRoomClick(room._id)} // Cập nhật để truyền tên phòng
                  >
                    <p>
                      <strong>Room:</strong> {room.name}
                    </p>
                    <p>
                      <strong>Screen Type:</strong> {room.screenType}
                    </p>
                    <p>
                      <strong>Room Type:</strong> {room.roomType}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FilmPage;
