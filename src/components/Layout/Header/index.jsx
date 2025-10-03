import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

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
            <div className="action">
                {/* <Button primary>Sign in</Button>
                <Button outline>Sign up</Button> */}
                <div className={cx('search')}>
                    <input type="text" placeholder="Tìm kiếm..." />
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </div>
                <img className={cx('avatar')} alt="avatar" />
            </div>
        </header>
    );
}

export default Header;
