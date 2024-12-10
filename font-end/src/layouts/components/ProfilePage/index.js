import classNames from 'classnames/bind';
import { useAuthStore } from "~/store/authStore";
import { formatDate } from "~/utils/date";
import ChangePassword from '~/components/ChangePassword';
import styles from './ProfilePage.module.scss';
import { motion } from "framer-motion";
import { User, KeyRound, ClipboardList } from 'lucide-react';
import LoadingSpinner from '~/components/LoadingSpinner';
import { useState } from 'react';
import OrderHistory from '~/components/OrderHistory';

const cx = classNames.bind(styles);

const TABS = {
  PROFILE: 'profile',
  PASSWORD: 'password',
  ORDERS: 'orders'
};

function ProfilePage() {
  const { user, isCheckingAuth } = useAuthStore();
  const [activeTab, setActiveTab] = useState(TABS.PROFILE);

  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className={cx('error-message')}>
        <h2>Unable to load profile information</h2>
        <p>Please try refreshing the page</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case TABS.PROFILE:
        return (
          <motion.div
            className={cx('content-section')}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className={cx('section-title')}>Profile Information</h2>
            <div className={cx('info-container')}>
              <div className={cx('info-item')}>
                <div className={cx('info-icon')}>
                  <User className={cx('icon')} />
                </div>
                <div className={cx('info-content')}>
                  <span className={cx('label')}>Name</span>
                  <span className={cx('value')}>{user.name}</span>
                </div>
              </div>

              <div className={cx('info-item')}>
                <div className={cx('info-content')}>
                  <span className={cx('label')}>Email</span>
                  <span className={cx('value')}>{user.email}</span>
                </div>
              </div>

              <div className={cx('info-item')}>
                <div className={cx('info-content')}>
                  <span className={cx('label')}>Last Login</span>
                  <span className={cx('value')}>
                    {user.lastLogin ? formatDate(user.lastLogin) : "No login yet"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case TABS.PASSWORD:
        return (
          <motion.div
            className={cx('content-section')}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ChangePassword />
          </motion.div>
        );
      case TABS.ORDERS:
        return (
          <motion.div
            className={cx('content-section')}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <OrderHistory />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={cx('wrapper')}>
      <div className={cx('tabs')}>
        <button
          className={cx('tab-button', { active: activeTab === TABS.PROFILE })}
          onClick={() => setActiveTab(TABS.PROFILE)}
        >
          <User className={cx('tab-icon')} />
          <span>Profile</span>
        </button>
        <button
          className={cx('tab-button', { active: activeTab === TABS.PASSWORD })}
          onClick={() => setActiveTab(TABS.PASSWORD)}
        >
          <KeyRound className={cx('tab-icon')} />
          <span>Password</span>
        </button>
        <button
          className={cx('tab-button', { active: activeTab === TABS.ORDERS })}
          onClick={() => setActiveTab(TABS.ORDERS)}
        >
          <ClipboardList className={cx('tab-icon')} />
          <span>Orders</span>
        </button>
      </div>

      <div className={cx('content')}>
        {renderContent()}
      </div>
    </div>
  );
}

export default ProfilePage;
