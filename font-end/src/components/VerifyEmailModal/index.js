import { useState, useRef, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './VerifyEmailModal.module.scss';
import Button from '~/components/Button';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

function VerifyEmailModal({ onClose, onVerify, email }) {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [countdown, setCountdown] = useState(60);
    const inputs = useRef([]);

    useEffect(() => {
        const timer = countdown > 0 && setInterval(() => {
            setCountdown(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [countdown]);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        if (element.value && index < 5) {
            inputs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            if (!otp[index] && index > 0) {
                inputs.current[index - 1].focus();
            }
            setOtp([...otp.map((d, idx) => (idx === index ? '' : d))]);
        }
    };

    const handleSubmit = async () => {
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setError('Please enter all digits');
            return;
        }

        try {
            await onVerify(otpString);
            toast.success('Email verified successfully!', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            onClose();
        } catch (err) {
            setError(err.message || 'Verification failed');
            toast.error(err.message || 'Verification failed', {
                position: "top-right",
                autoClose: 2000,
            });
        }
    };

    const handleResend = () => {
        setCountdown(60);
        setOtp(['', '', '', '', '', '']);
        setError('');
    };

    return (
        <div className={cx('wrapper')} onClick={onClose}>
            <div className={cx('modal')} onClick={e => e.stopPropagation()}>
                <div className={cx('header')}>
                    <h2>Verify Your Email</h2>
                    <p>We've sent a verification code to {email}</p>
                </div>

                <div className={cx('form')}>
                    <div className={cx('inputGroup')}>
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                value={digit}
                                ref={ref => inputs.current[index] = ref}
                                onChange={e => handleChange(e.target, index)}
                                onKeyDown={e => handleKeyDown(e, index)}
                            />
                        ))}
                    </div>

                    {error && <div className={cx('error')}>{error}</div>}

                    <div className={cx('actions')}>
                        <Button onClick={handleSubmit} primary>
                            Verify
                        </Button>
                        <Button onClick={onClose}>
                            Cancel
                        </Button>
                    </div>

                    <div className={cx('resendText')}>
                        Didn't receive the code?{' '}
                        <button
                            onClick={handleResend}
                            disabled={countdown > 0}
                        >
                            Resend
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VerifyEmailModal; 