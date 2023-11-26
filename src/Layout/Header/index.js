import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { Fragment } from 'react';


import classNames from "classnames/bind";
import styles from './Header.module.scss'
import Button from '../../Component/Button';



const cx = classNames.bind(styles)


function Header() {
    const user = useSelector((state) => state.auth.login.currentUser)

    return (
        <div className={cx('wrapper_header')}>
            <div className={cx('img_header')}>
                <img src='https://th.bing.com/th/id/OIP.0UQaGVOAYyykB5EI83s8YwHaF7?pid=ImgDet&rs=1' alt='logo' />
            </div>
            <ul className={cx('nav_header')}>
                <Link className={cx('nav_header-items', 'home-active')} to='/' ><li>Home</li></Link>
                <Link className={cx('nav_header-items')} to='/BookingInformation' ><li>Booking Information</li></Link>
                <Link className={cx('nav_header-items')} to='/ChoiceTicket' ><li>Choice Ticket</li></Link>
                <Link className={cx('nav_header-items')} to='/Contact' ><li>Contact</li></Link>
                <Link className={cx('nav_header-items')} to='/Promotions' ><li>Promotions</li></Link>
                <Link className={cx('nav_header-items')} to='/Cart' ><li>Cart</li></Link>
                {user ? (
                    <Fragment>
                        <Link to='/Profile' className={cx('nav_header-items')}><li>Profile</li></Link>
                    </Fragment>
                ) : (
                    <Link to='/Login' ><Button primary >Login</Button></Link>)
                }
            </ul>
        </div>
    );
}

export default Header;

