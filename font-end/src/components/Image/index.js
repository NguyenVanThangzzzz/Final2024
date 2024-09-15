import classNames from "classnames";
import { forwardRef, useState } from "react";
import images from "~/asset/images";
import styles from "./Image.module.scss";

const Image = forwardRef(
  (
    { src, alt, className, fallback: customFallback = images.no, ...props },
    ref
  ) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    const [fallback, setFallbackSrc] = useState("");
    const handleError = () => {
      setFallbackSrc(customFallback);
    };

    return (
      <img
        className={classNames(styles.wrapper, className)}
        ref={ref}
        src={fallback || src}
        alt={alt}
        {...props}
        onError={handleError}
      />
    );
  }
);

export default Image;
