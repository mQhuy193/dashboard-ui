import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-regular-svg-icons';

import images from '@/assets/images';
import styles from './Header.module.scss';
import Button from '@/components/Button';

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
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </div>
                <div className={cx('notification')}>
                    <FontAwesomeIcon icon={faBell} />
                </div>
                <img className={cx('avatar')} alt="avatar" src={images.avatar} />
            </div>
        </header>
    );
}

export default Header;
