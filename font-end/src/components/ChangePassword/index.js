import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './ChangePassword.module.scss';
import Button from '../Button';
import PasswordStrengthMeter from '../PasswordStrengMeter';
import { toast } from 'react-toastify';

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
        <div className={cx('wrapper')}>
            <h3 className={cx('title')}>Change Password</h3>
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

                <Button 
                    type="submit" 
                    primary
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Changing...' : 'Change Password'}
                </Button>
            </form>
        </div>
    );
}

export default ChangePassword; 