import classNames from "classnames/bind";
import { Check, X } from "lucide-react";
import styles from "./PasswordStreng.module.scss";

const cx = classNames.bind(styles);

const PasswordCriteria = ({ password }) => {
  const criteria = [
    { label: "At least 6 characters", met: password.length >= 6 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
    { label: "Contains a number", met: /\d/.test(password) },
    { label: "Contains special character", met: /[^A-Za-z0-9]/.test(password) },
  ];

  return (
    <div className={cx("criteria")}>
      {criteria.map((item) => (
        <div
          key={item.label}
          className={cx("flex", { met: item.met, notMet: !item.met })}
        >
          {item.met ? (
            <Check className={cx("icon")} />
          ) : (
            <X className={cx("icon")} />
          )}
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

const PasswordStrengthMeter = ({ password }) => {
  const getStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 6) strength++;
    if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strength++;
    if (pass.match(/\d/)) strength++;
    if (pass.match(/[^a-zA-Z\d]/)) strength++;
    return strength;
  };
  const strength = getStrength(password);

  const getColor = (strength) => {
    if (strength === 0) return cx("bg-red");
    if (strength === 1) return cx("bg-red");
    if (strength === 2) return cx("bg-yellow");
    if (strength === 3) return cx("bg-yellow");
    return cx("bg-green");
  };

  const getStrengthText = (strength) => {
    if (strength === 0) return "Very Weak";
    if (strength === 1) return "Weak";
    if (strength === 2) return "Fair";
    if (strength === 3) return "Good";
    return "Strong";
  };

  return (
    <div className={cx("container")}>
      <div className={cx("flex-between")}>
        <span>Password strength</span>
        <span>{getStrengthText(strength)}</span>
      </div>
      <div className={cx("meter")}>
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className={cx("bar", { [getColor(strength)]: index < strength })}
          />
        ))}
      </div>
      <PasswordCriteria password={password} />
    </div>
  );
};

export default PasswordStrengthMeter;
