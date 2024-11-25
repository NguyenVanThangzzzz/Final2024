import classNames from 'classnames/bind';
import styles from './Modal.module.scss';

const cx = classNames.bind(styles);

function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    return (
        <div className={cx('modal_overlay')} onClick={onClose}>
            <div className={cx('modal_content')} onClick={e => e.stopPropagation()}>
                <button className={cx('close_button')} onClick={onClose}>×</button>
                {children}
            </div>
        </div>
    );
}

export default Modal; 