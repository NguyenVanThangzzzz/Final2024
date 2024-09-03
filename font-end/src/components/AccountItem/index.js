
import classNames from "classnames/bind";
import styles from "./AccountItem.module.scss";
const cx = classNames.bind(styles);
function AccountItem() {
  return (
    <div className={cx('wrapper')}>
      <img className={cx('avatar')} src='' alt="Thang" />
      <div className={cx('info')}>
        <p className={cx('name')}>nguyen van thang</p>
        
      </div>
    </div>
   );
}

export default AccountItem ;