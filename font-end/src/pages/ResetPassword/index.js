import classNames from "classnames/bind";
import ResetPasswordPage from "~/layouts/components/ResetPassword";
import styles from "./ResetPassword.module.scss";
const cx = classNames.bind(styles);

function ResetPassword() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("content")}>
          <ResetPasswordPage />
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
