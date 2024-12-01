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

    // Check if email is empty
    if (!email) {
      setErrorMessage("Please enter your email");
      return;
    }

    try {
      // Call forgotPassword API
      await forgotPassword(email);
      setIsSubmitted(true);
      setErrorMessage(""); // Clear error if successful
    } catch (error) {
      // Display server error
      setErrorMessage(error.response.data.message || "An error occurred");
    }
  };

  return (
    <div className={cx("container")}>
      <div className={cx("content")}>
        <h2 className={cx("title")}>Forgot Password</h2>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className={cx("form")}>
            <p className={cx("description")}>
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <div className={cx("inputWrapper")}>
              <input
                type="email"
                placeholder="Email address"
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
                "Send Reset Link"
              )}
            </button>
          </form>
        ) : (
          <div className={cx("successMessage")}>
            <p className={cx("confirmationText")}>
              If account {email} exists, you will receive a password reset link.
            </p>
          </div>
        )}
      </div>

      <div className={cx("footer")}>
        <Link to={"/login"} className={cx("backToLogin")}>
          Back to Login
        </Link>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
