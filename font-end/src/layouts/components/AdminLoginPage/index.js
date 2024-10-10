import classNames from "classnames/bind";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminStore } from "../../../store/adminStore";
import styles from "./AdminLoginPage.module.scss";
const cx = classNames.bind(styles);
function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login, loading } = useAdminStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      // Redirect to admin page after successful login
      navigate("/admin");
    } catch (error) {
      setError("Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.");
    }
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("content")}>
          <h2>Đăng nhập Admin</h2>
          <form onSubmit={handleSubmit} className={cx("form")}>
            <div className={cx("form-group")}>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={cx("form-group")}>
              <label htmlFor="password">Mật khẩu:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className={cx("error")}>{error}</div>}
            <button type="submit" disabled={loading}>
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;
