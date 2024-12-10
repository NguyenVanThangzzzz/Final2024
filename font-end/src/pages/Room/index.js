import classNames from "classnames/bind";
import Footer from "../../layouts/components/Footer/index";
import RoomPage from "../../layouts/components/Room/index";
import styles from "./Room.module.scss";
const cx = classNames.bind(styles);
function Room() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("content")}>
          <RoomPage />
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Room;
