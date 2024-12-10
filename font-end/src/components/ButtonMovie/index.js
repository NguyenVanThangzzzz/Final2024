import classNames from 'classnames/bind';
import styles from './ButtonMovie.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const cx = classNames.bind(styles);

function ButtonMovie({ 
    children, 
    onClick, 
    leftIcon,
    rightIcon,
    className,
    ...passProps 
}) {
    const classes = cx('wrapper', {
        [className]: className
    });

    return (
        <button 
            className={classes} 
            onClick={onClick}
            {...passProps}
        >
            {leftIcon && <span className={cx('icon')}>{leftIcon}</span>}
            <span className={cx('title')}>{children}</span>
            {rightIcon && <span className={cx('icon')}>{rightIcon}</span>}
        </button>
    );
}

export default ButtonMovie; 