import classNames from 'classnames/bind';
import styles from './StatCard.module.scss';

const cx = classNames.bind(styles);

function StatCard({ title, value, bonus, icon, background }) {
    return (
        <div className={cx('stat-card')} style={{ background: background }}>
            <div className={cx('text')}>
                <p className={cx('title')}>{title}</p>
                <p className={cx('value')}>{value}</p>
                <p className={cx('bonus')}>{bonus}</p>
            </div>
            <div className={cx('icon')}>{icon}</div>
        </div>
    );
}

export default StatCard;
