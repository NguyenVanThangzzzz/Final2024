import classNames from "classnames/bind";
import AdminLoginPage from "../../layouts/components/AdminComponents/AdminLoginPage/index";
import styles from "./AdminLogin.module.scss";
const cx = classNames.bind(styles);

function AdminLogin() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("content")}>
          <AdminLoginPage />
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
