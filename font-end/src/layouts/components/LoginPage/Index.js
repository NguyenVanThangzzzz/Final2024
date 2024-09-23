import classNames from "classnames/bind";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import styles from "./LoginPage.module.scss";

const cx = classNames.bind(styles);

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = async (e) => {};

  return (
    <div className={cx("login_container")}>
      <div className={cx("login_form_container")}>
        <div className={cx("left")}>
          <form className={cx("form_container")} onSubmit={handleLogin}>
            <h1>Login to Your Account</h1>
            <input
              type="email"
              placeholder="Email"
              name="email"
              className={cx("input")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              className={cx("input")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className={cx("green_btn")}>
              Sign In
            </button>
          </form>
          <ToastContainer />
        </div>
        <div className={cx("right")}>
          <h1>New Here?</h1>
          <Link to="/signup">
            <button type="button" className={cx("white_btn")}>
              Sign Up
            </button>
          </Link>
          <Link to="/forgot-password">Fogot password</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
