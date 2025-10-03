import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import MailOutlineIcon from '@mui/icons-material/MailOutline';

import images from '@/assets/images';
import styles from './Header.module.scss';
import Button from '@/components/Button';
import Icon from './Icon';

const cx = classNames.bind(styles);

function Header() {
    return (
        <header className={cx('wrapper')}>
            <div className={cx('header-text')}>
                <h2 className={cx('title')}>Dashboard tổng quan</h2>
                <p className={cx('description')}>Chào mừng bạn quay trở lại!</p>
            </div>
            <div className={cx('actions')}>
                {/* <Button primary>Sign in</Button>
                <Button outline>Sign up</Button> */}
                <div className={cx('search')}>
                    <input type="text" placeholder="Tìm kiếm..." className={cx('input')} />
                    <button className={cx('search-btn')}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} className={cx('search-icon')} />
                    </button>
                </div>
                <div className={cx('action-btn')}>
                    <Icon IconName={NotificationsNoneIcon} badge={4} />
                </div>
                <div className={cx('action-btn')}>
                    <Icon IconName={MailOutlineIcon} badge={2} />
                </div>
                <img className={cx('avatar')} alt="avatar" src={images.avatar} />
            </div>
        </header>
    );
}

export default Header;
