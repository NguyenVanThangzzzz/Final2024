import classNames from "classnames/bind";
import styles from "./Header.module.scss";

const cx = classNames.bind(styles);

function Header() {
  return (
    <header className={cx("wrapper")}>
      <div className={cx("header-top-area")}>
        {/* Logo*/}
        {/* Search*/}
      </div>

      <div className={cx("main-header-area")}>
        <div className={cx("container-main-header")}>
          <div className={cx("row")}>
            <div className={cx("col-lg-3")}>
              <div className={cx("site-logo")}>
                <a href="/">
                  <img src="https://starlight.vn/Content/img/logo.png" alt="" />
                </a>
              </div>
            </div>
            <div className={cx("header-menu")}>
              <div className={cx("main-menu")}>
                <nav>
                  <ul>
                    <li>
                      <a href="/">Trang chủ</a>
                    </li>
                    <li>
                      <a href="/products">Sản phẩm</a>
                    </li>
                    <li>
                      <a href="/contact">Liên hệ</a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
