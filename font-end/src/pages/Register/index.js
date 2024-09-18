import classNames from "classnames/bind";
import RegisterPage from "../../layouts/components/RegisterPage/index";
import styles from "./Register.module.scss";
const cx = classNames.bind(styles);

function Register() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("content")}>
          <RegisterPage />
        </div>
      </div>
    </div>
  );
}

export default Register;
