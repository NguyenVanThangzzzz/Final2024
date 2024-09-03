import classNames from "classnames/bind";
import styles from "./Button.module.scss";
const cx = classNames.bind(styles);

function Button({ to, href, onClick, children, className, ...passProps }) {
  let Comp = "button";
  const props = {
    onClick,
    ...passProps,
  };

  if (href) {
    props.href = href;
    Comp = "a";
  } else if (to) {
    props.to = to;
    // Nếu sử dụng thư viện như React Router
    // Comp = Link;
  }

  const classes = cx("wrapper", className);

  return (
    <Comp className={classes} {...props}>
      <span>{children}</span>
    </Comp>
  );
}

export default Button;
