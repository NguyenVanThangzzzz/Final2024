import classNames from "classnames/bind";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../../../utils/index";
import styles from "./LoginPage.module.scss";

const cx = classNames.bind(styles);

function LoginPage() {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    const conpyLoginInfo = { ...loginInfo };
    conpyLoginInfo[name] = value;
    setLoginInfo(conpyLoginInfo);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;
    if (!email || !password) {
      return handleError(" Email and password are required");
    }
    try {
      const url = "http://localhost:8080/auth/login";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginInfo),
      });
      const result = await response.json();
      const { success, message, jwtToken, name, error } = result;
      if (success) {
        handleSuccess(message);
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("loggedInUser", name);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else if (error) {
        const details = error?.details[0].message;
        handleError(details);
      } else if (!success) {
        handleError(message);
      }
      console.log(result);
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <div className={cx("login_container")}>
      <div className={cx("login_form_container")}>
        <div className={cx("left")}>
          <form className={cx("form_container")} onSubmit={handleSubmit}>
            <h1>Login to Your Account</h1>
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={loginInfo.email}
              className={cx("input")}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={loginInfo.password}
              className={cx("input")}
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
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
