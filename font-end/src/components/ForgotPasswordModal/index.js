import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './ForgotPasswordModal.module.scss';
import Button from '~/components/Button';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

function ForgotPasswordModal({ onClose }) {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setError('Please enter your email');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8080/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Password reset instructions sent to your email!', {
                    position: "top-right",
                    autoClose: 3000,
                });
                onClose();
            } else {
                setError(data.message || 'Something went wrong');
                toast.error(data.message || 'Failed to send reset instructions', {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        } catch (err) {
            setError('Failed to connect to server');
            toast.error('Server connection failed', {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={cx('wrapper')} onClick={onClose}>
            <div className={cx('modal')} onClick={e => e.stopPropagation()}>
                <div className={cx('header')}>
                    <h2>Forgot Password</h2>
                    <p>Enter your email to receive password reset instructions</p>
                </div>

                <form className={cx('form')} onSubmit={handleSubmit}>
                    <div className={cx('inputGroup')}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {error && <div className={cx('error')}>{error}</div>}

                    <div className={cx('actions')}>
                        <Button type="submit" primary disabled={isSubmitting}>
                            {isSubmitting ? 'Sending...' : 'Send Instructions'}
                        </Button>
                        <Button onClick={onClose} disabled={isSubmitting}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ForgotPasswordModal; 