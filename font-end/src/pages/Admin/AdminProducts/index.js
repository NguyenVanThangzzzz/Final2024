import classNames from "classnames/bind";
import AdminHomePage from "../../../layouts/components/AdminComponents/AdminHomePage/index";
import styles from "./AdminProducts.module.scss";
const cx = classNames.bind(styles);

function AdminProducts() {
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

export default AdminProducts;
