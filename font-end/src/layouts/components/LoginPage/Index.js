import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { useState } from "react";
import { Link } from "react-router-dom";
import loginBanner from "~/asset/images/LINUXdoc.png";
import { useAuthStore } from "../../../store/authStore";
import styles from "./LoginPage.module.scss";

const cx = classNames.bind(styles);

function LoginPage({ onSuccess, onSwitchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, loginError, clearErrors } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await login(email, password);
      onSuccess?.();
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSwitchToSignup = () => {
    clearErrors();
    onSwitchToSignup();
  };

  return (
    <div className={cx("login_container")}>
      <div className={cx("login_form_container")}>
        <form className={cx("form_container")} onSubmit={handleLogin}>
          <img
            src={loginBanner}
            alt="Login banner"
            className={cx("login_banner")}
          />
          <h1>Login to Your Account</h1>
          <input
            type="email"
            placeholder="Email"
            name="email"
            className={cx("input")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className={cx("password-input-container")}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              className={cx("input")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className={cx("toggle-password")}
              onClick={toggleShowPassword}
            >
              <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
            </button>
          </div>
          <Link to="/forgot-password">Forgot password?</Link>
          {loginError && !isSubmitting && (
            <p className={cx("error")}>{loginError}</p>
          )}
          <button
            type="submit"
            className={cx("green_btn")}
            disabled={isSubmitting}
          >
            {isSubmitting ? <div className={cx("button_spinner")} /> : "Login"}
          </button>
        </form>

        <div className={cx("divider")}></div>

        <div className={cx("signup_section")}>
          <span>Don't have an account?</span>
          <button onClick={handleSwitchToSignup} className={cx("signup_btn")}>
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
