import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './ChangePassword.module.scss';
import { toast } from 'react-toastify';
import { motion } from "framer-motion";
import { Lock, Save, Loader } from 'lucide-react';
import PasswordStrengthMeter from '../PasswordStrengMeter';

const cx = classNames.bind(styles);

function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('http://localhost:8080/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Password changed successfully');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                toast.error(data.message || 'Failed to change password');
            }
        } catch (error) {
            toast.error('An error occurred while changing password');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            className={cx('wrapper')}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
        >
            <div className={cx('header')}>
                <Lock className={cx('header-icon')} />
                <h3 className={cx('title')}>Change Password</h3>
            </div>

            <form onSubmit={handleSubmit} className={cx('form')}>
                <div className={cx('form-group')}>
                    <label htmlFor="currentPassword">Current Password</label>
                    <input
                        type="password"
                        id="currentPassword"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />
                </div>

                <div className={cx('form-group')}>
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                <div className={cx('form-group')}>
                    <label htmlFor="newPassword">New Password</label>
                    <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <PasswordStrengthMeter password={newPassword} />
                </div>

                <button
                    type="submit"
                    className={cx('submit-button')}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <Loader className={cx('button-icon', 'animate-spin')} />
                            <span>Changing...</span>
                        </>
                    ) : (
                        <>
                            <Save className={cx('button-icon')} />
                            <span>Change Password</span>
                        </>
                    )}
                </button>
            </form>
        </motion.div>
    );
}

export default ChangePassword; 