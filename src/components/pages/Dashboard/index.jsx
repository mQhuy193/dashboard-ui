import classNames from 'classnames/bind';
import styles from './Dashboard.module.scss';
import { colors } from '@mui/material';

import StatCard from '@/components/StatCard';

const cx = classNames.bind(styles);

const StatCards = [
    {
        title: 'Liên hệ hôm nay',
        value: 24,
        bonus: 'Tháng này: 56',
        icon: '👤',
        background: 'linear-gradient(135deg, #f192f7, #f55d79)',
    },
    {
        title: 'Lượt thích',
        value: 1234,
        bonus: '+12% so với tháng trước',
        icon: '❤️',
        background: 'linear-gradient(135deg, #4dafff, #05eeff)',
    },
    {
        title: 'Lượt xem',
        value: 45678,
        bonus: '+8% so với tuần trước',
        icon: '👀',
        background: 'linear-gradient(135deg, #42eb80, #37fad3)',
    },
    {
        title: 'Tổng bài viết',
        value: 892,
        bonus: '+5 bài mới hôm nay',
        icon: '📝',
        background: 'linear-gradient(135deg, #fa7594, #ffdc42)',
    },
];

function Dashboard() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('stats-container')}>
                {StatCards.map((item, index) => (
                    <StatCard
                        key={index}
                        title={item.title}
                        value={item.value}
                        bonus={item.bonus}
                        icon={item.icon}
                        background={item.background}
                    />
                ))}
            </div>
        </div>
    );
}

export default Dashboard;
