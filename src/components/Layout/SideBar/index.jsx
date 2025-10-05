import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faChartColumn, faNewspaper, faUsers, faPhone, faGear } from '@fortawesome/free-solid-svg-icons';
import { icon } from '@fortawesome/fontawesome-svg-core';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import styles from './SideBar.module.scss';

const cx = classNames.bind(styles);

const navItems = [
    {
        title: 'Dashboard',
        icon: faChartColumn,
        iconColor: '#8286f5',
        path: '/',
    },
    {
        title: 'Quản lý bài viết',
        icon: faNewspaper,
        iconColor: '#ffc83d',
        path: '/postsmanage',
    },
    {
        title: 'Quản lý người dùng',
        icon: faUsers,
        iconColor: '#3eb6ed',
        path: '/usersmanage',
    },
    {
        title: 'Quản lý liên hệ',
        icon: faPhone,
        iconColor: '#49cc79',
        path: '/contactsmanage',
    },
    {
        title: 'Cài đặt hệ thống',
        icon: faGear,
        iconColor: '#aaa',
        path: '/setting',
    },
];

function SideBar() {
    const location = useLocation();

    return (
        <aside className={cx('wrapper')}>
            <header className={cx('header')}>
                <div className={cx('logo')}>
                    <FontAwesomeIcon icon={faHouse} />
                </div>
                <h1 className={cx('title')}>QL Phòng Trọ</h1>
            </header>
            {/* nav menu */}
            <nav className={cx('nav')}>
                {navItems.map((item, index) => (
                    <Link
                        to={item.path}
                        key={index}
                        className={cx('nav-item', { active: location.pathname === item.path })}
                    >
                        <FontAwesomeIcon icon={item.icon} color={item.iconColor} className={cx('icon')} />
                        <span>{item.title}</span>
                    </Link>
                ))}
            </nav>
        </aside>
    );
}

export default SideBar;
