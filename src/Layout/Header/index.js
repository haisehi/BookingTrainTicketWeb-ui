import {Link} from 'react-router-dom'

import classNames from "classnames/bind";
import styles from './Header.module.scss'
import Button from '../../Component/Button';

const cx = classNames.bind(styles)


function Header() {
    return ( 
        <div className={cx('wrapper_header')}>
        <div className={cx('img_header')}>
        <img src='https://th.bing.com/th/id/OIP.0UQaGVOAYyykB5EI83s8YwHaF7?pid=ImgDet&rs=1' alt='logo' />
        </div>
        <ul className={cx('nav_header')}>
            <Link className={cx('nav_header-items','home-active')} to='/' ><li>Home</li></Link>
            <Link className={cx('nav_header-items')} to='/BookingInformation' ><li>Booking Information</li></Link>
            <Link className={cx('nav_header-items')} to='/ChoiceTicket' ><li>Choice Ticket</li></Link>
            <Link className={cx('nav_header-items')} to='/Contact' ><li>Contact</li></Link>
            <Link className={cx('nav_header-items')} to='/Promotions' ><li>Promotions</li></Link>
            <Button primary >Login</Button>
        </ul>
        </div>
     );
}

export default Header;

