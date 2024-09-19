import classNames from "classnames/bind";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../../../utils/index";
import styles from "./SignupPage.module.scss";

const cx = classNames.bind(styles);

// const [error, setError] = useState("");
function SignupPage() {
  const [signupInfo, setSignupInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    const conpySignupInfo = { ...signupInfo };
    conpySignupInfo[name] = value;
    setSignupInfo(conpySignupInfo);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password } = signupInfo;
    if ((!firstName, !lastName, !email || !password)) {
      return handleError(
        "First Name, Last Name, Email and password are required"
      );
    }
    try {
      const url = "http://localhost:8080/auth/signup";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupInfo),
      });
      const result = await response.json();
      const { success, message, error } = result;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/login");
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
    <div className={cx("signup_container")}>
      <div className={cx("signup_form_container")}>
        <div className={cx("left")}>
          <h1>Welcome Back</h1>
          <Link to="/login">
            <button type="button" className={cx("white_btn")}>
              Sign in
            </button>
          </Link>
        </div>
        <div className={cx("right")}>
          <form className={cx("form_container")} onSubmit={handleSubmit}>
            <h1>Create Account</h1>
            <input
              onChange={handleChange}
              type="text"
              placeholder="First Name"
              name="firstName"
              value={signupInfo.firstName}
              className={cx("input")}
            />
            <input
              type="text"
              placeholder="Last Name"
              name="lastName"
              onChange={handleChange}
              value={signupInfo.lastName}
              className={cx("input")}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={signupInfo.email}
              className={cx("input")}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={signupInfo.password}
              className={cx("input")}
            />
            {/* {error && <div className={cx("error_msg")}>{error}</div>} */}
            <button type="submit" className={cx("green_btn")}>
              Sign Up
            </button>
          </form>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
