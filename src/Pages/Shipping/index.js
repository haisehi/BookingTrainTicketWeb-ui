import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { logoutUser } from '../../redux/apiRequest';
import { createAxios } from '../../createInstance';
import classNames from 'classnames/bind';
import styles from './Shipping.module.scss';

const cx = classNames.bind(styles);

const Shipping = () => {
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
        <Link className={cx('link1')} to="/shipping">Your Tickets</Link>

        <button onClick={handleLogOut} className={cx('logout-button')}>
          Log out
        </button>
      </div>
      <div className={cx('main-content')}>
        <table border='1'>
          <thead>
              <tr>
                <td>From</td>
                <td>To</td>
                <td>Departure</td>
                <td>Return</td>
                <td>Time Go Departure</td>
                <td>Time Go Return</td>
                <td>Type</td>
                <td>Price</td>
                <td>Number Chair</td>
                <td>Kind</td>
                <td>Room</td>
                <td>Train</td>
                <td>Name</td>
                <td>Phone</td>
                <td>Address</td>
              </tr>           
          </thead>
          <tbody>
            <tr>
              <td>Dan Nang</td>
              <td>Hue</td>
              <td>12-20-2023</td>
              <td>...</td>
              <td>6:00 PM</td>
              <td>...</td>
              <td>One Way</td>
              <td>500000 VND</td>
              <td>1</td>
              <td>Normal</td>
              <td>01</td>
              <td>SE01</td>
              <td>AAA</td>
              <td>0123456789</td>
              <td>Address</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Shipping;
