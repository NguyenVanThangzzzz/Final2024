import classNames from "classnames/bind";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import styles from "./ResetPassword.module.scss";

const cx = classNames.bind(styles);

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { resetPassword, error, isLoading, message } = useAuthStore();
  const { token } = useParams();
  const navigate = useNavigate();

  const [formError, setFormError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    // Check if passwords match
    if (password !== confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    try {
      await resetPassword(token, password);
      setFormError("");
      alert("Password reset successfully, redirecting to login page...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error(error);
      setFormError(error.message || "Error resetting password");
    }
  };

  return (
    <div className={cx("container")}>
      <h2 className={cx("title")}>Reset Password</h2>
      {error && <p className={cx("error")}>{error}</p>}
      {message && <p className={cx("message")}>{message}</p>}

      <form onSubmit={handleSubmit} className={cx("form")}>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={cx("input")}
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className={cx("input")}
        />
        {formError && <p className={cx("form-error")}>{formError}</p>}
        <button
          type="submit"
          className={cx("submit-button")}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
