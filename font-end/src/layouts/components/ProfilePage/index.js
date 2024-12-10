import classNames from 'classnames/bind';
import { useAuthStore } from "~/store/authStore";
import { formatDate } from "~/utils/date";
import ChangePassword from '~/components/ChangePassword';
import styles from './ProfilePage.module.scss';
import LoadingSpinner from '~/components/LoadingSpinner';

const cx = classNames.bind(styles);

function ProfilePage() {
  const { user, isCheckingAuth } = useAuthStore();

  // Hiển thị loading khi đang kiểm tra auth
  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }

  // Kiểm tra nếu không có user
  if (!user) {
    return (
      <div className={cx('error-message')}>
        <h2>Unable to load profile information</h2>
        <p>Please try refreshing the page</p>
      </div>
    );
  }

  return (
    <div className={cx('wrapper')}>
      <div className={cx('profile-section')}>
        <h2 className={cx('section-title')}>Profile Information</h2>
        <div className={cx('info-container')}>
          <div className={cx('info-item')}>
            <span className={cx('label')}>Name:</span>
            <span className={cx('value')}>{user.name}</span>
          </div>
          <div className={cx('info-item')}>
            <span className={cx('label')}>Email:</span>
            <span className={cx('value')}>{user.email}</span>
          </div>
          <div className={cx('info-item')}>
            <span className={cx('label')}>Last Login:</span>
            <span className={cx('value')}>
              {user.lastLogin ? formatDate(user.lastLogin) : "No login yet"}
            </span>
          </div>
        </div>
      </div>

      <div className={cx('password-section')}>
        <ChangePassword />
      </div>
    </div>
  );
}

export default ProfilePage;
