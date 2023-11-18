import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { logoutUser } from '../../redux/apiRequest';
import { createAxios } from '../../createInstance';
import classNames from 'classnames/bind';
import styles from './Profive.module.scss';

const cx = classNames.bind(styles);

const Profive = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.login.currentUser);
  const accessToken = user?.accessToken;
  const id = user?._id;
  const axiosJWT = createAxios(user, dispatch, logoutUser);

  const handleLogOut = () => {
    logoutUser(dispatch, id, navigate, accessToken, axiosJWT);
  };

  return (
    <div className={cx('profive-container')}>
      <div className={cx('sidebar')}>
        <Link to="/profile">Profile</Link>
        <Link to="/tickets">Your Tickets</Link>
        <Link to="/shipping">Your Shipping</Link>
        <button onClick={handleLogOut} className={cx('logout-button')}>
          Log out
        </button>
      </div>
      <div className={cx('main-content')}>
        {user ? (
          <div>
            <h1 className={cx('profive-header')}>Hi, {user.userName}!</h1>
            <div className={cx('user-info')}>
              <div className={cx('info-item')}>
                <span className={cx('info-label')}>Name:</span>
                <span className={cx('info-value')}>{user.userName}</span>
              </div>
              <div className={cx('info-item')}>
                <span className={cx('info-label')}>Email:</span>
                <span className={cx('info-value')}>{user.email}</span>
              </div>
            </div>
          </div>
        ) : (
          <h1 className={cx('profive-header')}>Not logged in</h1>
        )}
      </div>
    </div>
  );
};

export default Profive;
