import {Link} from 'react-router-dom'

import classNames from "classnames/bind";
import styles from './Header.module.scss'

const cx = classNames.bind(styles)


function Header() {
    return ( 
        <>
        <ul>
            <Link to='/' ><li>Home</li></Link>
            <Link to='/BookingInformation' ><li>Booking Information</li></Link>
            <Link to='/ChoiceTicket' ><li>Choice Ticket</li></Link>
            <Link to='/Contact' ><li>Contact</li></Link>
            <Link to='/Promotions' ><li>Promotions</li></Link>
        </ul>
        </>
     );
}

export default Header;