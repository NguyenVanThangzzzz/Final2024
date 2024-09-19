import classNames from "classnames/bind";
import ProfilePage from "~/layouts/components/ProfilePage";
import styles from "./Profile.module.scss";
const cx = classNames.bind(styles);

function Profile() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("content")}>
          <ProfilePage />
        </div>
      </div>
    </div>
  );
}

export default Profile;
