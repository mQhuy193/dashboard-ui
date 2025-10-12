import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faChartColumn, faNewspaper, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { icon } from '@fortawesome/fontawesome-svg-core';
import { faMessage, faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import MailIcon from '@mui/icons-material/Mail';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';

import styles from './SideBar.module.scss';
import images from '~/assets/images';
import InfoItem from '~/components/InfoItem';
import Button from '~/components/Button';

const cx = classNames.bind(styles);

const navItems = [
    {
        title: 'Dashboard',
        icon: faChartColumn,
        path: '/',
    },
    {
        title: 'Quản lý bài viết',
        icon: faNewspaper,
        path: '/postsmanage',
    },
];

const profile = {
    name: 'Mạch Quang Huy',
    avatar: images.avatar,
    email: 'abc123456jqka@gmail.com',
    dateOfBirth: '01/01/2004',
    joinDate: '01/01/2025',
    phoneNumber: '0987654321',
    address: 'Hà Nội',
    isMale: true,
    role: 'Chủ trọ',
    isActiveEmail: true,
    isActivedPhone: true,
    is2Fa: true,
};

const btnItems = [
    {
        title: 'Thêm bài viết',
        leftIcon: <FontAwesomeIcon icon={faPlus} />,
    },
    {
        title: 'Tin nhắn',
        leftIcon: <FontAwesomeIcon icon={faMessage} />,
    },
    {
        title: 'Sửa thông tin',
        leftIcon: <FontAwesomeIcon icon={faPenToSquare} />,
    },
];

function SideBar() {
    const location = useLocation();

    const [isVisible, setIsVisible] = useState(false);

    const toggleSideBar = () => {
        setIsVisible(!isVisible);
    };

    return (
        <aside className={cx('wrapper')}>
            {/* header */}
            <header className={cx('header')}>
                <div className={cx('logo')}>
                    <FontAwesomeIcon icon={faHouse} />
                </div>
                <h1 className={cx('title')}>QL Phòng Trọ</h1>
            </header>

            {/* profile */}
            <div className={cx('content')}>
                <div className={cx('profile')}>
                    <img src={profile.avatar} alt={profile.name} className={cx('avatar')} />
                    <h3 className={cx('name')}>{profile.name}</h3>
                    <p className={cx('role')}>
                        {profile.role} • Tham gia từ {profile.joinDate}
                    </p>
                    <button className={cx('more-btn')} onClick={toggleSideBar}>
                        {isVisible ? 'Thu gọn' : 'Xem thêm'}
                        <span className={cx('more-btn-icon', { active: isVisible })}>
                            <FontAwesomeIcon icon={faChevronDown} />
                        </span>
                    </button>
                </div>

                <div className={cx('profile-info', { visible: isVisible })}>
                    <InfoItem title="Email" value={profile.email} icon={<MailIcon sx={{ fontSize: 20 }} />} />
                    <InfoItem
                        title="Số điện thoại"
                        value={profile.phoneNumber}
                        icon={<PhoneIcon sx={{ fontSize: 20 }} />}
                    />
                    <div className={cx('divider')}>
                        <InfoItem
                            title="Giới tính"
                            value={profile.isMale ? 'Nam' : 'Nữ'}
                            iconRight={
                                profile.isMale ? (
                                    <MaleIcon sx={{ fontSize: 16, color: '#4dbbff' }} />
                                ) : (
                                    <FemaleIcon sx={{ fontSize: 16, color: '#ff47a0' }} />
                                )
                            }
                            size="medium"
                        />
                        <InfoItem
                            title="Ngày sinh"
                            value={profile.dateOfBirth}
                            icon={<CalendarMonthIcon sx={{ fontSize: 20 }} />}
                            size="medium"
                        />
                    </div>
                    <InfoItem title="Nơi ở" value={profile.address} icon={<LocationOnIcon sx={{ fontSize: 20 }} />} />
                </div>

                {/* nav menu */}
                <h4>Menu</h4>
                <nav className={cx('nav')}>
                    {navItems.map((item, index) => (
                        <Link
                            to={item.path}
                            key={index}
                            className={cx('nav-item', { active: location.pathname === item.path })}
                        >
                            <FontAwesomeIcon icon={item.icon} className={cx('icon')} />
                            <span>{item.title}</span>
                        </Link>
                    ))}
                </nav>
                <div className={cx('btn-container')}>
                    {btnItems.map((item, index) => (
                        <Button leftIcon={item.leftIcon} key={index} size="large" primary className={cx('btn')}>
                            {item.title}
                        </Button>
                    ))}
                </div>
            </div>
        </aside>
    );
}

export default SideBar;
