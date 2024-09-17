import classNames from "classnames/bind";
import styles from "./LoginPage.module.scss";

const cx = classNames.bind(styles);

function LoginPage() {
  return (
    <div className={cx("login-container")}>
      <h1 className={cx("title")}>Login</h1>
      <form className={cx("login-form")}>
        <div className={cx("form-group")}>
          <label className={cx("label")} htmlFor="username">
            Username
          </label>
          <input
            className={cx("input")}
            type="text"
            id="username"
            placeholder="Enter your username"
          />
        </div>
        <div className={cx("form-group")}>
          <label className={cx("label")} htmlFor="password">
            Password
          </label>
          <input
            className={cx("input")}
            type="password"
            id="password"
            placeholder="Enter your password"
          />
        </div>
        <button className={cx("btn")} type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
