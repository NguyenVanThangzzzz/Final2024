import {
  faFacebookF,
  faGooglePlusG,
  faLinkedinIn,
  faPinterestP,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import {
  faBars,
  faCircleQuestion,
  faEarthAsia,
  faGear,
  faKeyboard,
  faSignOut,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { useState } from "react";
import { Link } from "react-router-dom";
import "tippy.js/dist/tippy.css";
import Button from "~/components/Button";
import Image from "~/components/Image";
import LoadingSpinner from "~/components/LoadingSpinner";
import Modal from "~/components/Modal";
import routesConfig from "~/config/routes";
import Menu from "../../../components/Popper/Menu/Index";
import { useAuthStore } from "../../../store/authStore";
import LoginPage from "../LoginPage/Index";
import SignupPage from "../SignupPage";
import SignupModal from "~/components/SignupModal";
import styles from "./Header.module.scss";

const cx = classNames.bind(styles);
const MENU_ITEMS = [
  {
    icon: <FontAwesomeIcon icon={faEarthAsia} />,
    title: "Tiếng Việt",
    children: {
      title: "Language",
      data: [
        {
          type: "language",
          code: "en",
          title: "English",
        },
        {
          type: "language",
          code: "vi",
          title: "Tieng VIet",
        },
      ],
    },
  },
  {
    icon: <FontAwesomeIcon icon={faCircleQuestion} />,
    title: "Feedback and Help",
    to: "/feedback",
  },
  {
    icon: <FontAwesomeIcon icon={faKeyboard} />,
    title: "Keyborad Shortcuts",
  },
];

function Header() {
  const { 
    isAuthenticated, 
    logout, 
    user,
    showLoginModal,
    setShowLoginModal 
  } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const handleSwitchToSignup = () => {
    setShowLoginModal(false);
    setShowSignupModal(true);
  };

  const handleSwitchToLogin = () => {
    setShowSignupModal(false);
    setShowLoginModal(true);
  };

  //user Menu
  const userMenu = [
    {
      icon: <FontAwesomeIcon icon={faUser} />,
      title: user?.name || "User",
      to: "/profile",
    },
    {
      icon: <FontAwesomeIcon icon={faEarthAsia} />,
      title: "Tiếng Việt",
      children: {
        title: "Language",
        data: [
          {
            type: "language",
            code: "en",
            title: "English",
          },
          {
            type: "language",
            code: "vi",
            title: "Tieng VIet",
          },
        ],
      },
    },
    {
      icon: <FontAwesomeIcon icon={faGear} />,
      title: "Settings",
      to: "/setting",
    },
    {
      icon: <FontAwesomeIcon icon={faSignOut} />,
      title: "Log out",
      type: "logout",
      separate: true,
    },
  ];
  const handleMenuChange = (menuItem) => {
    switch (menuItem.type) {
      case "language":
        // Xử lý thay đổi ngôn ngữ
        break;
      case "logout":
        handleLogout(); // Gọi hàm handleLogout
        break;
      default:
        // Các xử lý khác nếu cần
        break;
    }
  };
  const handleLogout = async () => {
    setIsLoading(true); // Đặt trạng thái loading là true
    await logout(); // Gọi hàm logout
    setIsLoading(false); // Đặt trạng thái loading về false sau khi logout
  };
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <header className={cx("wrapper")}>
      <div className={cx("header-top-area")}>
        <div>
          <div className={cx("container-header-top")}>
            <div className={cx("header-top-social")}>
              <Button href="https://facebook.com" className={cx("social-icon")}>
                <FontAwesomeIcon icon={faFacebookF} />
              </Button>
              <Button href="/" className={cx("social-icon")}>
                <FontAwesomeIcon icon={faTwitter} />
              </Button>
              <Button
                href="https://plus.google.com"
                className={cx("social-icon")}
              >
                <FontAwesomeIcon icon={faGooglePlusG} />
              </Button>
              <Button href="https://linkedin.com" className={cx("social-icon")}>
                <FontAwesomeIcon icon={faLinkedinIn} />
              </Button>
              <Button
                href="https://pinterest.com"
                className={cx("social-icon")}
              >
                <FontAwesomeIcon icon={faPinterestP} />
              </Button>
            </div>

            <div className={cx("header-top-menu")}>
              <div className={cx("actions")}>
                {isAuthenticated ? (
                  <>
                    <Menu items={userMenu} onChange={handleMenuChange}>
                      <Image
                        className={cx("user-avatar")}
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSw6juIAFATO3bJZFAppnE0pWLCyaXZPDRc9g&s"
                        alt="Nguyen Van T"
                        fallback="https://lh3.googleusercontent.com/a/ACg8ocJEXhQvsKqohBcyi15XDZX7ncMlCo7AicFZp54un9WicVkDcqjW=s288-c-no"
                      />
                    </Menu>
                  </>
                ) : (
                  <>
                    <Button primary onClick={() => setShowLoginModal(true)}>
                      Đăng nhập
                    </Button>
                    <Button primary onClick={() => setShowSignupModal(true)}>
                      Đăng Ký
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)}>
        <LoginPage 
          onSuccess={() => setShowLoginModal(false)}
          onSwitchToSignup={handleSwitchToSignup}
        />
      </Modal>

      <SignupModal isOpen={showSignupModal} onClose={() => setShowSignupModal(false)}>
        <SignupPage 
          onSuccess={() => setShowSignupModal(false)}
          onSwitchToLogin={handleSwitchToLogin}
        />
      </SignupModal>

      <div className={cx("main-header-area")}>
        <div className={cx("container-main-header")}>
          <div className={cx("row-header-main")}>
            <div className={cx("site-logo")}>
              <Link to={routesConfig.home}>
                <img src="https://starlight.vn/Content/img/logo.png" alt="" />
              </Link>
            </div>
            <div className={cx("main-menu")}>
              <nav>
                <ul>
                  <li>
                    <a href="/">Trang chủ</a>
                  </li>
                  <li>
                    <a href="/san-pham">Sản phẩm</a>
                  </li>
                  <li>
                    <a href="/upload">Giới thiệu</a>
                  </li>
                  <li>
                    <a href="/tin-tuc">Tin tức</a>
                  </li>
                </ul>
              </nav>
            </div>
            <Menu items={MENU_ITEMS} onChange={handleMenuChange}>
              <button className={cx("more-btn")}>
                <FontAwesomeIcon icon={faBars} />
              </button>
            </Menu>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
