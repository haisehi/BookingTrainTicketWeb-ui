import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartArrowDown, faMap, faPhone, faTicket, faUser } from '@fortawesome/free-solid-svg-icons';

import classNames from "classnames/bind";
import styles from './Header.module.scss'
import Button from '../../Component/Button';

const cx = classNames.bind(styles)

function Header() {
    const user = useSelector((state) => state.auth.login.currentUser)
    const [isMenuActive, setMenuActive] = useState(false);

    const toggleMenu = () => {
        setMenuActive(!isMenuActive);
    };

    return (
        <div className={cx('wrapper_header')}>
            <div className={cx('img_header')}>
                <img src='https://th.bing.com/th/id/OIP.0UQaGVOAYyykB5EI83s8YwHaF7?pid=ImgDet&rs=1' alt='logo' />
            </div>
            <div className={cx('nav_header', { active: isMenuActive })}>
                <Link className={cx('nav_header-items', 'home-active')} to='/'>
                    <li>
                        <FontAwesomeIcon icon={faTicket} /> Home
                    </li>
                </Link>
                <Link className={cx('nav_header-items')} to='/BookingInformation'>
                    <li>Booking Information</li>
                </Link>
                <Link className={cx('nav_header-items')} to='/Contact'>
                    <li>
                        <FontAwesomeIcon icon={faPhone} /> Contact
                    </li>
                </Link>
                <Link className={cx('nav_header-items')} to='/schedule'>
                    <li>
                        <FontAwesomeIcon icon={faMap} /> schedule
                    </li>
                </Link>
                <Link className={cx('nav_header-items')} to='/Cart'>
                    <li>
                        <FontAwesomeIcon icon={faCartArrowDown} /> Cart
                    </li>
                </Link>
                {user ? (
                    <Link to='/Profile' className={cx('nav_header-items')}>
                        <li>
                            <FontAwesomeIcon icon={faUser} />
                        </li>
                    </Link>
                ) : (
                    <Link to='/Login'>
                        <Button primary>Login</Button>
                    </Link>
                )}
            </div>
            <div className={cx('menu-toggle')} onClick={toggleMenu}>
                ☰
            </div>
        </div>
    );
}

export default Header;

