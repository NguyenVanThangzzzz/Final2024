import EmailVericationPage from "../../layouts/components/EmailVericationPage/index";
import classNames from "classnames/bind";
import styles from "./EmailVerication.module.scss";
const cx = classNames.bind(styles);

function EmailVerication() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("content")}>
          <EmailVericationPage />
        </div>
      </div>
    </div>
  );
}

export default EmailVerication;
