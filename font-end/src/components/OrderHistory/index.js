import { useEffect } from 'react';
import { useOrderStore } from '~/store/orderStore';
import { formatDate } from '~/utils/date';
import classNames from 'classnames/bind';
import styles from './OrderHistory.module.scss';
import { motion } from "framer-motion";
import { Clock, Film, MapPin, Ticket } from 'lucide-react';
import LoadingSpinner from '../LoadingSpinner';

const cx = classNames.bind(styles);

function OrderHistory() {
    const { orders, loading, error, fetchUserOrders } = useOrderStore();

    useEffect(() => {
        fetchUserOrders();
    }, [fetchUserOrders]);

    if (loading) return <LoadingSpinner />;
    if (error) return <div className={cx('error')}>{error}</div>;
    if (!orders.length) return <div className={cx('no-orders')}>No orders found</div>;

    return (
        <motion.div
            className={cx('wrapper')}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className={cx('title')}>Order History</h2>
            <div className={cx('orders-container')}>
                {orders.map((order) => (
                    <motion.div
                        key={order._id}
                        className={cx('order-card')}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className={cx('order-header')}>
                            <img 
                                src={order.movie.image} 
                                alt={order.movie.name} 
                                className={cx('movie-image')}
                            />
                            <div className={cx('order-info')}>
                                <h3 className={cx('movie-name')}>{order.movie.name}</h3>
                                <div className={cx('meta')}>
                                    <Clock className={cx('icon')} />
                                    <span>{formatDate(order.screening.showTime)}</span>
                                </div>
                            </div>
                        </div>

                        <div className={cx('order-details')}>
                            <div className={cx('detail-item')}>
                                <MapPin className={cx('icon')} />
                                <div>
                                    <strong>{order.cinema.name}</strong>
                                    <p>{order.cinema.streetName}</p>
                                </div>
                            </div>

                            <div className={cx('detail-item')}>
                                <Film className={cx('icon')} />
                                <div>
                                    <strong>{order.room.name}</strong>
                                    <p>{order.room.screenType}</p>
                                </div>
                            </div>

                            <div className={cx('detail-item')}>
                                <Ticket className={cx('icon')} />
                                <div>
                                    <strong>Seats</strong>
                                    <p>{order.seats.join(', ')}</p>
                                </div>
                            </div>
                        </div>

                        <div className={cx('order-footer')}>
                            <div className={cx('status', order.status.toLowerCase())}>
                                {order.status}
                            </div>
                            <div className={cx('price')}>
                                ${order.totalAmount}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

export default OrderHistory; 