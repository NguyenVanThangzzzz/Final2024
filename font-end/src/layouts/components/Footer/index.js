import classNames from 'classnames/bind';
import styles from './Footer.module.scss';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const cx = classNames.bind(styles);

function Footer() {
    return (
        <footer className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('content')}>
                    <div className={cx('column')}>
                        <h3 className={cx('title')}>About Us</h3>
                        <p className={cx('description')}>
                           Linux Cinema Tickets - Your premium movie ticket booking platform. Experience the best movies with comfort and convenience.
                        </p>
                        <div className={cx('social-links')}>
                            <Link to="https://facebook.com" className={cx('social-link')}><Facebook size={20} /></Link>
                            <Link to="https://instagram.com" className={cx('social-link')}><Instagram size={20} /></Link>
                            <Link to="https://twitter.com" className={cx('social-link')}><Twitter size={20} /></Link>
                            <Link to="https://youtube.com" className={cx('social-link')}><Youtube size={20} /></Link>
                        </div>
                    </div>

                    <div className={cx('column')}>
                        <h3 className={cx('title')}>Quick Links</h3>
                        <ul className={cx('links')}>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/movies">Movies</Link></li>
                            <li><Link to="/cinemas">Cinemas</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                        </ul>
                    </div>

                    <div className={cx('column')}>
                        <h3 className={cx('title')}>Contact Info</h3>
                        <ul className={cx('contact-info')}>
                            <li>
                                <Phone size={16} />
                                <span>+84 123 456 789</span>
                            </li>
                            <li>
                                <Mail size={16} />
                                <span>support@linuxcinematickets.com</span>
                            </li>
                            <li>
                                <MapPin size={16} />
                                <span>123 Cinema Street, Da Nang City</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className={cx('bottom')}>
                    <p className={cx('copyright')}>
                        © {new Date().getFullYear()} Linux Cinema Tickets. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer; 