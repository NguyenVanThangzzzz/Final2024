import classNames from "classnames/bind";
import RoomPage from "../../layouts/components/Room/index";
import styles from "./Room.module.scss";
const cx = classNames.bind(styles);
function Room() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("content")}>
          <RoomPage />
        </div>
      </div>
    </div>
  );
}

export default Room;
