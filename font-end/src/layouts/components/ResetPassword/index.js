import classNames from "classnames/bind";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import styles from "./ResetPassword.module.scss"; // Giả sử bạn đã có tệp SCSS này

const cx = classNames.bind(styles);

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { resetPassword, error, isLoading, message } = useAuthStore();
  const { token } = useParams();
  const navigate = useNavigate();

  // State để lưu thông báo lỗi
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(""); // Reset thông báo lỗi

    // Kiểm tra mật khẩu có khớp không
    if (password !== confirmPassword) {
      setFormError("Passwords do not match"); // Cập nhật thông báo lỗi
      return;
    }

    try {
      await resetPassword(token, password);
      setFormError(""); // Reset thông báo lỗi
      alert("Password reset successfully, redirecting to login page...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error(error);
      setFormError(error.message || "Error resetting password"); // Cập nhật thông báo lỗi
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
        {formError && <p className={cx("form-error")}>{formError}</p>}{" "}
        {/* Hiển thị thông báo lỗi */}
        <button
          type="submit"
          className={cx("submit-button")}
          disabled={isLoading}
        >
          {isLoading ? "Resetting..." : "Set New Password"}
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
