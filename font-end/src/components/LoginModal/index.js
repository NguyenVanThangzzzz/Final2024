import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './LoginModal.module.scss';
import { useAuthStore } from '~/store/authStore';

const cx = classNames.bind(styles);

function LoginModal({ onClose }) {
    const { login, loginError, setShowForgotPasswordModal } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleForgotPasswordClick = (e) => {
        e.preventDefault();
        onClose(); // Đóng modal login
        setShowForgotPasswordModal(true); // Mở modal forgot password
    };

    // ... rest of your component code

    return (
        <div className={cx('wrapper')}>
            <div className={cx('modal')}>
                <div className={cx('header')}>
                    <h2>Login to Your Account</h2>
                </div>
                <form className={cx('form')} onSubmit={handleSubmit}>
                    {/* ... email and password inputs ... */}
                    
                    <div className={cx('forgot-password')}>
                        <a 
                            href="#" 
                            onClick={handleForgotPasswordClick}
                            className={cx('forgot-link')}
                        >
                            Forgot password?
                        </a>
                    </div>

                    {/* ... login button and other elements ... */}
                </form>
            </div>
        </div>
    );
}

export default LoginModal; 