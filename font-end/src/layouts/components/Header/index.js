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
import "bootstrap/dist/css/bootstrap.min.css";
import classNames from "classnames/bind";
import { Link } from "react-router-dom";
import "tippy.js/dist/tippy.css"; // optional
import Button from "~/components/Button";
import Image from "~/components/Image";
import routesConfig from "~/config/routes";
import Menu from "../../../components/Popper/Menu/Index";
import styles from "./Header.module.scss";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { useEffect, useState } from "react";

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
  // const [searchResult, setSearchResult] = useState([]);
  // useEffect(() => {
  //   setTimeout(() => {
  //     setSearchResult([1, 2, 3]);
  //   }, 2000);
  // }, []);

  const currenUser = false;
  const userMenu = [
    {
      icon: <FontAwesomeIcon icon={faUser} />,
      title: "View Profile",
      to: "/@thang",
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
      to: "/logout",
      separate: true,
    },
  ];
  const handleMenuChange = (menuItem) => {
    switch (menuItem.type) {
      case "language":
        break;
      default:
    }
  };

  ///USER

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
                {currenUser ? (
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
                    <Button primary to={"/login"}>
                      Đăng nhập
                    </Button>
                    <Button primary>Đăng Ký</Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

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
