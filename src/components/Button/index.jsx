import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import styles from './Button.module.scss';

const cx = classNames.bind(styles);

function Button({
    to,
    href,
    primary,
    outline = false,
    text = false,
    disabled = false,
    rounded = false,
    size = 'medium',
    leftIcon,
    rightIcon,
    className,
    children,
    onClick,
    ...passProps
}) {
    let Comp = 'button';
    const props = {
        onClick,
    };

    if (disabled) {
        Object.assign(props, {
            disabled,
            className: `${className} ${styles.disabled}`,
        });
    }

    if (to) {
        props.to = to;
        comp = Link;
    } else if (href) {
        props.href = href;
        comp = 'a';
    }

    const classes = cx('wrapper', {
        primary,
        outline,
        text,
        disabled,
        rounded,
        leftIcon,
        rightIcon,
        [className]: className,
        [size]: size,
    });

    return (
        <Comp className={classes} {...props}>
            {leftIcon && <span className={cx('icon')}>{leftIcon}</span>}
            <span className={cx('title')}>{children}</span>
            {rightIcon && <span className={cx('icon')}>{rightIcon}</span>}
        </Comp>
    );
}

export default Button;
