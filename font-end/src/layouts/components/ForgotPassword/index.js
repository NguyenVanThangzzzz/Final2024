import classNames from "classnames/bind";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import styles from "./ForgotPasswordPage.module.scss";

const cx = classNames.bind(styles);

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { isLoading, forgotPassword } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra nếu email rỗng
    if (!email) {
      setErrorMessage("Vui lòng nhập email");
      return;
    }

    try {
      // Gọi API forgotPassword
      await forgotPassword(email);
      setIsSubmitted(true);
      setErrorMessage(""); // Xóa lỗi nếu thành công
    } catch (error) {
      // Hiển thị lỗi từ server
      setErrorMessage(error.response.data.message || "Đã xảy ra lỗi");
    }
  };

  return (
    <div className={cx("container")}>
      <div className={cx("content")}>
        <h2 className={cx("title")}>Quên mật khẩu</h2>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className={cx("form")}>
            <p className={cx("description")}>
              Nhập địa chỉ email của bạn và chúng tôi sẽ gửi liên kết để đặt lại
              mật khẩu.
            </p>
            <div className={cx("inputWrapper")}>
              <input
                type="email"
                placeholder="Địa chỉ email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cx("inputField")}
              />
            </div>
            {errorMessage && (
              <p className={cx("errorMessage")}>{errorMessage}</p>
            )}
            <button
              className={cx("submitButton", { loading: isLoading })}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className={cx("loader")}></div>
              ) : (
                "Gửi liên kết đặt lại mật khẩu"
              )}
            </button>
          </form>
        ) : (
          <div className={cx("successMessage")}>
            <p className={cx("confirmationText")}>
              Nếu tài khoản {email} tồn tại, bạn sẽ nhận được một liên kết để
              đặt lại mật khẩu.
            </p>
          </div>
        )}
      </div>

      <div className={cx("footer")}>
        <Link to={"/login"} className={cx("backToLogin")}>
          Quay lại Đăng nhập
        </Link>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
