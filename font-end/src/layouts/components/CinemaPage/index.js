import { useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./CinemaPage.module.scss";
import { useCinemaStore } from "~/store/cinemaStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faPhone } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

function CinemaPage() {
  const { cinemas, loading, fetchAllCinemas } = useCinemaStore();

  useEffect(() => {
    fetchAllCinemas();
  }, [fetchAllCinemas]);

  if (loading) {
    return <div className={cx("loading")}>Loading...</div>;
  }

  return (
    <div className={cx("cinema-grid")}>
      {cinemas.map((cinema) => (
        <div key={cinema._id} className={cx("cinema-card")}>
          <div className={cx("cinema-image")}>
            <img src={cinema.image} alt={cinema.name} />
          </div>
          <div className={cx("cinema-info")}>
            <h3 className={cx("cinema-name")}>{cinema.name}</h3>
            <div className={cx("cinema-location")}>
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              <p>{`${cinema.streetName}, ${cinema.state}, ${cinema.country}`}</p>
            </div>
            {cinema.phoneNumber && (
              <div className={cx("cinema-phone")}>
                <FontAwesomeIcon icon={faPhone} />
                <p>{cinema.phoneNumber}</p>
              </div>
            )}
            {cinema.postalCode && (
              <p className={cx("cinema-postal")}>
                Postal Code: {cinema.postalCode}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default CinemaPage; 