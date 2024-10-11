import classNames from "classnames/bind";
import AdminHomePage from "../../layouts/components/AdminComponents/AdminHomePage/index";
import styles from "./AdminPage.module.scss";
const cx = classNames.bind(styles);

function AdminPage() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("content")}>
          <AdminHomePage />
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
