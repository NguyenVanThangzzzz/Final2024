import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCinemaStore } from "../../../store/cinemaStore";
import { useMovieStore } from "../../../store/movieStore";
import { useRoomStore } from "../../../store/roomStore";
import { useScreeningStore } from "../../../store/screeningStore";
import styles from "./FilmPage.module.scss";
import LoadingSpinner from '~/components/LoadingSpinner';
import { toast } from 'react-hot-toast';

const cx = classNames.bind(styles);

function FilmPage() {
  const { slug } = useParams();
  const navigate = useNavigate(); // Khởi tạo hook điều hướng
  const { movies, fetchAllMovies, loading: movieLoading } = useMovieStore();
  const { cinemas, fetchAllCinemas, loading: cinemaLoading } = useCinemaStore();
  const { fetchRoomsByCinema } = useRoomStore();
  const { fetchScreeningsByRoom } = useScreeningStore();
  const [movie, setMovie] = useState(null);
  const [rooms, setRooms] = useState({});
  const [roomScreenings, setRoomScreenings] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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

  // Lấy d liệu phim được chọn
  useEffect(() => {
    const selectedMovie = movies.find((m) => m.slug === slug || m._id === slug);
    setMovie(selectedMovie);
  }, [slug, movies]);

  // Lấy danh sách phòng theo từng rạp chiếu phim
  useEffect(() => {
    const fetchRoomsAndScreenings = async () => {
      for (const cinema of cinemas) {
        const response = await fetchRoomsByCinema(cinema._id);
        const roomsData = response?.data?.rooms || [];
        
        // Lưu rooms vào state
        setRooms(prevRooms => ({
          ...prevRooms,
          [cinema._id]: roomsData,
        }));

        // Kiểm tra screenings cho mỗi room
        for (const room of roomsData) {
          const screenings = await fetchScreeningsByRoom(room._id);
          const validScreenings = screenings.filter(screening => 
            screening.movieId?._id === movie?._id && 
            new Date(screening.endTime) > new Date()
          );
          
          setRoomScreenings(prev => ({
            ...prev,
            [room._id]: validScreenings.length > 0
          }));
        }
      }
    };

    if (cinemas.length > 0 && movie) {
      fetchRoomsAndScreenings();
    }
  }, [cinemas, movie, fetchRoomsByCinema, fetchScreeningsByRoom]);

  const handleRoomClick = async (roomId) => {
    setIsLoading(true);
    
    try {
      // Fetch screenings cho room được chọn
      const screenings = await fetchScreeningsByRoom(roomId);
      
      // Lọc các screening có movieId trùng với phim hiện tại và chưa kết thúc
      const validScreenings = screenings.filter(screening => 
        screening.movieId?._id === movie._id && 
        new Date(screening.endTime) > new Date()
      );

      if (!validScreenings || validScreenings.length === 0) {
        toast.error("Phòng này chưa có suất chiếu cho phim này. Vui lòng chọn phòng khác!");
        setIsLoading(false);
        return;
      }

      // Nếu có suất chiếu hợp lệ, chuyển hướng đến trang room
      navigate(`/room/${roomId}?movieId=${movie._id}`);
    } catch (error) {
      console.error("Error checking screenings:", error);
      toast.error("Có lỗi xảy ra khi kiểm tra suất chiếu");
    } finally {
      setIsLoading(false);
    }
  };

  if (movieLoading || cinemaLoading) {
    return <div>Loading...</div>;
  }

  if (!movie) {
    return <div>Không tìm thấy phim</div>;
  }

  return (
    <div className={cx("wrapper")}>
      {isLoading && (
        <div className={cx('loading-overlay')}>
          <LoadingSpinner />
        </div>
      )}

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
              <strong className={cx("label")}>Genre:</strong>{" "}
              {Array.isArray(movie.genres) 
                ? movie.genres.join(", ")
                : typeof movie.genres === 'string' 
                  ? movie.genres.split(" ").join(", ")
                  : movie.genres}
            </p>
            <p>
              <strong className={cx("label")}>Director:</strong> {movie.director}
            </p>
            <p>
              <strong className={cx("label")}>Actors:</strong> {movie.actors}
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
              <img 
                src={cinema.image} 
                alt={cinema.name}
                className={cx("cinemaImage")}
              />
              <div className={cx("cinemaInfo")}>
                <h3>{cinema.name}</h3>
                <p>
                  <strong>Address:</strong> {cinema.streetName}, {cinema.state},{" "}
                  {cinema.country}
                </p>
                <p>
                  <strong>Postal Code:</strong> {cinema.postalCode}
                </p>
                <p>
                  <strong>Phone:</strong> {cinema.phoneNumber}
                </p>
              </div>

              <div className={cx("rooms")}>
                {rooms[cinema._id]?.map((room) => (
                  <div
                    key={room._id}
                    className={cx("roomDetails", {
                      noScreenings: !roomScreenings[room._id]
                    })}
                    onClick={() => roomScreenings[room._id] && handleRoomClick(room._id)}
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
