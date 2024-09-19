import SignupPage from "../../layouts/components/SignupPage/index";
import classNames from "classnames/bind";
import styles from "./Signup.module.scss";
const cx = classNames.bind(styles);

function Signup() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("content")}>
          <SignupPage />
        </div>
      </div>
    </div>
  );
}

export default Signup;
