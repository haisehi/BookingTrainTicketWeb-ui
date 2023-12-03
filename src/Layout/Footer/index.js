// Footer.js

import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faInstagram, faFacebookF, faReddit } from '@fortawesome/free-brands-svg-icons';
import classNames from 'classnames/bind';
import styles from './Footer.module.scss';

const cx = classNames.bind(styles);

const FooterSection = ({ title, content }) => (
    <div className={cx('footer-section')}>
        <h4>{title}</h4>
        <div>{content}</div>
    </div>
);

const SocialLink = ({ to, icon }) => (
    <Link to={to} className={cx('icon-link')}>
        <FontAwesomeIcon icon={icon} />
    </Link>
);

function Footer() {
    return (
        <footer className={cx('footer')}>
            <div className={cx('container')}>
                <div className={cx('footer-content')}>
                    <FooterSection
                        title="About Us"
                        content="Welcome to Our Railway, your one-stop destination for hassle-free train ticket bookings. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in quam id urna consectetur aliquet at eget justo."
                    />
                    <FooterSection
                        title="Contact Us"
                        content={
                            <>
                                Email: <a href="mailto:info@yourrailway.com">info@yourrailway.com</a>
                                <br />
                                Phone: +1 123 456 7890
                            </>
                        }
                    />
                    <FooterSection title="Follow Us" content={<SocialIcons />} />
                </div>
            </div>
            <div className={cx('footer-bottom')}>
                <p>&copy; 2023 Your Railway. All rights reserved.</p>
            </div>
        </footer>
    );
}

const SocialIcons = () => (
    <div className={cx('social-icons')}>
        <div><SocialLink to="#" icon={faFacebookF} /><span> Facebook</span></div>
        <div><SocialLink to="#" icon={faTwitter} /><span> Twitter</span></div>
        <div><SocialLink to="#" icon={faInstagram} /><span> Instagram</span></div>
        <div><SocialLink to="#" icon={faReddit} /><span> Reddit</span></div>
    </div>
);

export default Footer;
