import classNames from "classnames/bind";
import { motion } from "framer-motion";

import styles from "./LoadingSpinner.module.scss";

const cx = classNames.bind(styles);

function LoadingSpinner() {
  return (
    <div className={cx("wrapper")}>
      <motion.div
        className={cx("spinner")}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

export default LoadingSpinner;
