import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import styles from './NotificationSeat.module.scss';

const cx = classNames.bind(styles);

function NotificationSeat({ message, isVisible, onClose }) {
    if (!isVisible) return null;

    return (
        <div className={cx('notification-overlay')} onClick={onClose}>
            <div className={cx('notification-content')} onClick={e => e.stopPropagation()}>
                <div className={cx('icon-wrapper')}>
                    <FontAwesomeIcon icon={faExclamationCircle} className={cx('icon')} />
                </div>
                <div className={cx('message')}>{message}</div>
                <button className={cx('close-button')} onClick={onClose}>
                    OK
                </button>
            </div>
        </div>
    );
}

export default NotificationSeat; 