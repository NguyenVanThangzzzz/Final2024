import classNames from "classnames/bind";
import styles from "./Contact.module.scss";
import ContactPage from "~/layouts/components/ContactPage";
import Footer from "~/layouts/components/Footer";

const cx = classNames.bind(styles);

function Contact() {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("container")}>
        <div className={cx("content")}>
          <ContactPage />
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Contact;
