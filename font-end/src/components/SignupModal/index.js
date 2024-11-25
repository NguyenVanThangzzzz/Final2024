import classNames from 'classnames/bind';
import styles from './SignupModal.module.scss';

const cx = classNames.bind(styles);

function SignupModal({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    return (
        <div className={cx('signup_modal_overlay')} onClick={onClose}>
            <div className={cx('signup_modal_content')} onClick={e => e.stopPropagation()}>
                <button className={cx('close_button')} onClick={onClose}>×</button>
                {children}
            </div>
        </div>
    );
}

export default SignupModal; 