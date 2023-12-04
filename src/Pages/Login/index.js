import classNames from "classnames/bind";
import styles from "./Login.module.scss"

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSpring, animated } from "react-spring";
import { loginUserAdmin } from "../../redux/apiRequest";
import { useDispatch } from "react-redux";

const cx = classNames.bind(styles)

function Login() {
    const [userName, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault();
        const newUser = {
            userName: userName,
            password: password,
        };
        loginUserAdmin(newUser, dispatch, navigate)
    }


    return (
        <div className={cx('login-container')}>
            <form className={cx("login-form")} onSubmit={handleSubmit}>
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
            </form>
        </div>
    );
}

export default Login;