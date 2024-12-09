import classNames from "classnames/bind";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import styles from "./ResetPassword.module.scss";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import loginBanner from "~/asset/images/LINUXdoc.png";
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { resetPassword, error, isLoading } = useAuthStore();
  const { token } = useParams();
  const navigate = useNavigate();
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (password !== confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    try {
      await resetPassword(token, password);
      setFormError("");
      toast.success('Password reset successfully!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error(error);
      setFormError(error.message || "Error resetting password");
      toast.error(error.message || "Error resetting password", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className={cx("reset-container")}>
      <div className={cx("content-wrapper")}>
        <div className={cx("form-section")}>
          <a href="/" className={cx("back-link")}>Back to Login</a>
          <div className={cx("form-header")}>
            <h1>Reset Password</h1>
            <p>Please choose your new password</p>
          </div>

          <form onSubmit={handleSubmit} className={cx("form")}>
            <div className={cx("input-group")}>
              <label>New Password</label>
              <div className={cx("password-input")}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className={cx("toggle-password")}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                </button>
              </div>
            </div>

            <div className={cx("input-group")}>
              <label>Confirm Password</label>
              <div className={cx("password-input")}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className={cx("toggle-password")}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} />
                </button>
              </div>
            </div>

            {(formError || error) && (
              <div className={cx("error")}>{formError || error}</div>
            )}

            <button
              type="submit"
              className={cx("submit-button")}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Save New Password"}
            </button>
          </form>
        </div>

        <div className={cx("logo-section")}>
          <img src={loginBanner} alt="Linux Light Logo" />
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
