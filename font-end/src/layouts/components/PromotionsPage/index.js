import classNames from "classnames/bind";
import styles from "./PromotionsPage.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faTicketAlt, faUsers, faPercent } from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

const promotions = [
  {
    id: 1,
    title: "TRADITIONAL MONDAY - 50% OFF",
    description: "Super attractive - 50% off on popcorn & drink combos. Don't miss out!",
    image: "promotion-monday.jpg",
    icon: faCalendarAlt
  },
  {
    id: 2,
    title: "VIETNAMESE MOVIE TUESDAY",
    description: "Special offers for Vietnamese films every Tuesday",
    image: "promotion-tuesday.jpg",
    icon: faTicketAlt
  },
  {
    id: 3,
    title: "MEMBER THURSDAY - SPECIAL DEALS",
    description: "Before 5PM: Buy 1 ticket get 1 drink. After 5PM: Buy 1 ticket + 1 popcorn get 1 drink",
    image: "promotion-thursday.jpg",
    icon: faUsers
  },
  {
    id: 4,
    title: "U22 PROGRAM - YOUTH OFFERS",
    description: "Special discounts for customers under 22 years old",
    image: "promotion-u22.jpg",
    icon: faPercent
  },
  {
    id: 5,
    title: "SUPER SAVING COMBO",
    description: "Save more with our attractive popcorn & drink combos",
    image: "promotion-combo.jpg",
    icon: faTicketAlt
  }
];

function PromotionsPage() {
  return (
    <div className={cx("promotion-grid")}>
      {promotions.map((promo) => (
        <div key={promo.id} className={cx("promotion-card")}>
          <div className={cx("promotion-icon")}>
            <FontAwesomeIcon icon={promo.icon} />
          </div>
          <div className={cx("promotion-content")}>
            <h3 className={cx("promotion-title")}>{promo.title}</h3>
            <p className={cx("promotion-description")}>{promo.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PromotionsPage; 