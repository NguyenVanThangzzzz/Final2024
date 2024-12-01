import {
  faFacebookF,
  faGooglePlusG,
  faLinkedinIn,
  faPinterestP,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import {
  faBars,
  faCartShopping,
  faCircleQuestion,
  faGear,
  faHeart,
  faLanguage,
  faRightFromBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "tippy.js/dist/tippy.css";
import Button from "~/components/Button";
import Image from "~/components/Image";
import LoadingSpinner from "~/components/LoadingSpinner";
import Modal from "~/components/Modal";
import SignupModal from "~/components/SignupModal";
import routesConfig from "~/config/routes";
import Menu from "../../../components/Popper/Menu/Index";
import { useAuthStore } from "../../../store/authStore";
import LoginPage from "../LoginPage/Index";
import SignupPage from "../SignupPage";
import styles from "./Header.module.scss";
import LINUX1 from '~/asset/images/LINUX1.png';

const cx = classNames.bind(styles);
const MENU_ITEMS = [
  {
    icon: <FontAwesomeIcon icon={faLanguage} />,
    title: "Language",
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
          title: "Vietnamese",
        },
      ],
    },
  },
  {
    icon: <FontAwesomeIcon icon={faCircleQuestion} />,
    title: "Help",
    to: "/help",
  },
  {
    icon: <FontAwesomeIcon icon={faHeart} />,
    title: "Wishlist",
    to: "/wishlist",
  },
];

function Header() {
  const { isAuthenticated, logout, user, showLoginModal, setShowLoginModal } =
    useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const location = useLocation();

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
      title: user?.name || "Account",
      to: "/profile",
    },
    {
      icon: <FontAwesomeIcon icon={faCartShopping} />,
      title: "Cart",
      to: "/cart",
    },
    {
      icon: <FontAwesomeIcon icon={faGear} />,
      title: "Settings",
      to: "/settings",
    },
    {
      icon: <FontAwesomeIcon icon={faRightFromBracket} />,
      title: "Logout",
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

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className={cx("wrapper")}>
      <div className={cx("header-top-area")}>
        <div>
          <div className={cx("container-header-top")}>
            <div className={cx("header-top-social")}>
              <a href="https://facebook.com" className={cx("social-icon")}>
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <a href="/" className={cx("social-icon")}>
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href="https://plus.google.com" className={cx("social-icon")}>
                <FontAwesomeIcon icon={faGooglePlusG} />
              </a>
              <a href="https://linkedin.com" className={cx("social-icon")}>
                <FontAwesomeIcon icon={faLinkedinIn} />
              </a>
              <a href="https://pinterest.com" className={cx("social-icon")}>
                <FontAwesomeIcon icon={faPinterestP} />
              </a>
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
                      Login
                    </Button>
                    <Button primary onClick={() => setShowSignupModal(true)}>
                      Sign Up
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

      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
      >
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
                <img
                  src={LINUX1}
                  alt="Logo LINUX"
                />
              </Link>
            </div>

            <div className={cx("main-menu")}>
              <nav>
                <ul>
                  <li>
                    <Link
                      to={routesConfig.home}
                      className={cx("menu-item", { active: isActive("/") })}
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/lich-chieu"
                      className={cx("menu-item", {
                        active: isActive("/lich-chieu"),
                      })}
                    >
                      Showtimes
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/phim"
                      className={cx("menu-item", { active: isActive("/phim") })}
                    >
                      Movies
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/khuyen-mai"
                      className={cx("menu-item", {
                        active: isActive("/khuyen-mai"),
                      })}
                    >
                      Promotions
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dien-anh"
                      className={cx("menu-item", {
                        active: isActive("/dien-anh"),
                      })}
                    >
                      Cinema
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/lien-he"
                      className={cx("menu-item", {
                        active: isActive("/lien-he"),
                      })}
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>

            <div className={cx("menu-right")}>
              <Menu items={MENU_ITEMS} onChange={handleMenuChange}>
                <button className={cx("more-btn")}>
                  <FontAwesomeIcon icon={faBars} />
                </button>
              </Menu>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
