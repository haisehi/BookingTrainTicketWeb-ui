import classNames from "classnames/bind";
import styles from "./Login.module.scss"

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSpring, animated } from "react-spring";

const cx = classNames.bind(styles)

function Login() {
    const [userName, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const gradientColor = useSpring({
        background: `linear-gradient(180deg, #a3ffef, #0eb517e8)`,
    });

    return (
        <div className={cx('login-container')}>
            <animated.form style={{ ...gradientColor }} className={cx("login-form")}>
                <h2>Login</h2>
                <label className={cx('login-label')}>User name</label>
                <input
                    className={cx('login-input')}
                    placeholder="User Name"
                    name="userName"
                    type="text"
                    onChange={(e) => setUsername(e.target.value)}
                />
                <label className={cx('login-label')}>Password</label>
                <input
                    className={cx('login-input')}
                    placeholder="Password"
                    name="password"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className={cx('login-button')} type="submit">
                    Login
                </button>
                <Link to="/register" className={cx('login-button-link')}><button className={cx('login-button')}>Register</button></Link>
            </animated.form>
        </div>
    );
}

export default Login;