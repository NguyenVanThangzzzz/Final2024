import classNames from "classnames/bind";
import styles from "./ContactPage.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faMapMarkerAlt, 
  faPhone, 
  faEnvelope, 
  faGlobe 
} from "@fortawesome/free-solid-svg-icons";

const cx = classNames.bind(styles);

function ContactPage() {
  return (
    <div className={cx('contact-container')}>
      <div className={cx('contact-header')}>
        <h1>Contact Information</h1>
      </div>

      <div className={cx('contact-content')}>
        <div className={cx('info-section')}>
          <h2>Information</h2>
          
          <div className={cx('info-item')}>
            <FontAwesomeIcon icon={faPhone} />
            <div>
              <h3>Hotline</h3>
              <p>19001722</p>
            </div>
          </div>

          <div className={cx('info-item')}>
            <FontAwesomeIcon icon={faMapMarkerAlt} />
            <div>
              <h3>Head Office</h3>
              <p>4th Floor, Nguyen Kim Building, 46 Dien Bien Phu, Hai Chau District, Da Nang City, Vietnam</p>
            </div>
          </div>

          <div className={cx('info-item')}>
            <FontAwesomeIcon icon={faGlobe} />
            <div>
              <h3>Website</h3>
              <p>www.linuxlight.vn</p>
            </div>
          </div>

          <div className={cx('info-item')}>
            <FontAwesomeIcon icon={faEnvelope} />
            <div>
              <h3>Email</h3>
              <p>support@linuxlight.vn</p>
            </div>
          </div>
        </div>

        <div className={cx('company-info')}>
          <h2>LINUX LIGHT ENTERTAINMENT JOINT STOCK COMPANY</h2>
          <p>Business Registration Certificate No.: 0402021264</p>
          <p>First registration date: 03/01/2020</p>
          <p>Issuing agency: Department of Planning and Investment of Da Nang City</p>
          <p>Address: 4th Floor, Nguyen Kim Building, 46 Dien Bien Phu, Da Nang City, Vietnam</p>
          <p>Hotline: 19001722</p>
        </div>
      </div>
    </div>
  );
}

export default ContactPage; 