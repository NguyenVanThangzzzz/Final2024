import classNames from "classnames/bind";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
// import { handleSuccess } from "../../../utils/index";
import toast from "react-hot-toast";
import { useAuthStore } from "../../../store/authStore";
import styles from "./EmailVerication.module.scss";

const cx = classNames.bind(styles);

function EmailVerificationPage() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const { error, isLoading, verifyEmail } = useAuthStore();

  const handleChange = (index, value) => {
    const newCode = [...code];

    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);

      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex].focus();
    } else {
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");
    console.log(`Verification code: ${verificationCode}`);
    try {
      await verifyEmail(verificationCode);
      navigate("/");
      toast.success("Email verified successfully");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit(new Event("submit"));
    }
  }, [code]);

  return (
    <div className={cx("container")}>
      <div className={cx("content")}>
        <h2 className={cx("title")}>Verify Your Email</h2>
        <p className={cx("subtitle")}>
          Enter the 6-digit code sent to your email address.
        </p>

        <form onSubmit={handleSubmit} className={cx("form")}>
          <div className={cx("inputGroup")}>
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={cx("inputBox")}
              />
            ))}
          </div>
          {error && <p className={cx("error")}>{error}</p>}
          <button
            type="submit"
            disabled={isLoading || code.some((digit) => !digit)}
            className={cx("submitButton")}
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </button>
          {/* <ToastContainer /> */}
        </form>
      </div>
    </div>
  );
}

export default EmailVerificationPage;
