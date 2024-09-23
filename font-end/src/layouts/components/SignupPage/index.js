import classNames from "classnames/bind";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import PasswordStrengthMeter from "../../../components/PasswordStrengMeter/index";
import { useAuthStore } from "../../../store/authStore";
import styles from "./SignupPage.module.scss";

const cx = classNames.bind(styles);

// const [error, setError] = useState("");
function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { signup, error, isLoading } = useAuthStore();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password, name);
      navigate("/verify-email");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={cx("signup_container")}>
      <div className={cx("signup_form_container")}>
        <div className={cx("left")}>
          <h1>Welcome Back</h1>
          <Link to="/login">
            <button type="button" className={cx("white_btn")}>
              Login Page
            </button>
          </Link>
        </div>
        <div className={cx("right")}>
          <form className={cx("form_container")} onSubmit={handleSignup}>
            <h1>Create Account</h1>
            <input
              type="text"
              placeholder="Username"
              name="username"
              className={cx("input")}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

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
            {error && <p className={cx("error")}>{error}</p>}
            {/* Password strength meter */}
            <PasswordStrengthMeter password={password} />
            <button
              type="submit"
              className={cx("green_btn")}
              disabled={isLoading}
            >
              {isLoading ? "Signing up..." : "Sign up"}
            </button>
          </form>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
