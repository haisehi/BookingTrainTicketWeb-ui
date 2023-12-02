import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVanShuttle  } from '@fortawesome/free-solid-svg-icons';

import classNames from 'classnames/bind';
import styles from './Contract.module.scss';

const cx = classNames.bind(styles);
const apiURL = process.env.REACT_APP_API_URL;

function Contact() {
    return (
        <div className={cx('contact-container')}>
            <div className={cx('promotion-message')}>
                <p>
                    <FontAwesomeIcon icon={faVanShuttle} flip="horizontal" />
                    <span> The North - South railway route is proudly selected by Lonely Planet as the World's most incredible and worth - experiencing train journey</span>
                </p>
            </div>
            <h2>Thông tin liên hệ</h2>
            <div className={cx('company-info')}>
                <p>Tổng công ty Đường sắt Việt Nam</p>
                <p>Số 118 Lê Duẩn, Hoàn Kiếm, Hà Nội.</p>
                <p>Giấy chứng nhận ĐKKD số 113642 theo QĐ thành lập số 973/QĐ-TTg ngày 25/06/2010 của Thủ tướng Chính phủ.</p>
                <p>Mã số doanh nghiệp: 0100105052, đăng ký lần đầu ngày 26/07/2010, đăng ký thay đổi lần 4 ngày 27/06/2014 tại Sở KHĐT Thành phố Hà Nội.</p>
            </div>
            <div className={cx('customer-support')}>
                <h3>Tổng đài hỗ trợ khách hàng</h3>
                <p>Điện thoại: 19006469</p>
                <p>Email: <a href="mailto:support1@dsvn.vn">support1@dsvn.vn</a></p>
                <p>Email: <a href="mailto:support2@dsvn.vn">support2@dsvn.vn</a></p>
            </div>
        </div>
    );
}

export default Contact;
