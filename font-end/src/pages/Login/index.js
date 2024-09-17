import classNames from "classnames/bind";
import LoginPage from "../../layouts/components/LoginPage/Index";
import styles from "./Login.module.scss";
const cx = classNames.bind(styles);

function Login() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("content")}>
          <LoginPage />
        </div>
      </div>
    </div>
  );
}

export default Login;
