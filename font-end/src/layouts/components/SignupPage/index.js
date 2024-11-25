import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { useState } from "react";
import { Link } from "react-router-dom";
import loginBanner from "~/asset/images/cinema.jpg";
import PasswordStrengthMeter from "../../../components/PasswordStrengMeter/index";
import { useAuthStore } from "../../../store/authStore";
import styles from "./SignupPage.module.scss";

const cx = classNames.bind(styles);

function SignupPage({ onSuccess, onSwitchToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup, signupError, clearErrors } = useAuthStore();

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await signup(email, password, name);
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

  const handleSwitchToLogin = () => {
    clearErrors();
    onSwitchToLogin();
  };

  return (
    <div className={cx("signup_container")}>
      <div className={cx("signup_form_container")}>
        <form className={cx("form_container")} onSubmit={handleSignup}>
          <img
            src={loginBanner}
            alt="Signup banner"
            className={cx("signup_banner")}
          />
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
          <PasswordStrengthMeter password={password} />
          {signupError && !isSubmitting && <p className={cx("error")}>{signupError}</p>}
          <button
            type="submit"
            className={cx("green_btn")}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className={cx("button_spinner")} />
            ) : (
              "Sign up"
            )}
          </button>
        </form>

        <div className={cx("divider")}></div>

        <div className={cx("login_section")}>
          <span>Already have an account?</span>
          <button onClick={handleSwitchToLogin} className={cx("login_btn")}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
