import classNames from "classnames/bind";
import ForgotPasswordPage from "~/layouts/components/ForgotPassword";
import styles from "./ForgotPassword.module.scss";
const cx = classNames.bind(styles);

function ForgotPassword() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("content")}>
          <ForgotPasswordPage />
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
