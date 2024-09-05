import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import styles from "./Button.module.scss";
const cx = classNames.bind(styles);

function Button({
  to,
  href,
  onClick,
  primary = false,
  disabled = false,
  children,
  className,
  ...passProps
}) {
  let Comp = "button";
  const props = {
    onClick,
    ...passProps,
  };
//Remove event listeners when btn is disabled
  if (disabled) {
    Object.keys(props).forEach((key) => {
      if (key.startsWith("on") && typeof props[key] === "function") {
        delete props[key];
      }
    });
  }

  if (href) {
    props.href = href;
    Comp = "a";
  } else if (to) {
    props.to = to;
    Comp = Link;
  }

  const classes = cx("wrapper", {
    primary,
    disabled,
  });

  return (
    <Comp className={classes} {...props}>
      <span>{children}</span>
    </Comp>
  );
}

export default Button;
