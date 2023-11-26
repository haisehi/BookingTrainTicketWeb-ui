import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Puff } from 'react-loader-spinner';
import 'react-loader-spinner';

import { logoutUser } from '../../redux/apiRequest';
import { createAxios } from '../../createInstance';
import classNames from 'classnames/bind';
import styles from './Shipping.module.scss';

const cx = classNames.bind(styles);
const apiURL = process.env.REACT_APP_API_URL

const Shipping = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.login.currentUser);
  const accessToken = user?.accessToken;
  const id = user?._id;
  const axiosJWT = createAxios(user, dispatch, logoutUser);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [RoomList, setRoomList] = useState([]);  // State để lưu danh sách toa
  const [trainList, setTrainList] = useState([]);  // State để lưu danh sách toa


  const handleLogOut = () => {
    logoutUser(dispatch, id, navigate, accessToken, axiosJWT);
  };

  //xem danh sách toa
  const handleViewRoom = (e) => {
    // Gửi yêu cầu GET đến máy chủ để lấy danh sách toa
    fetch(`${apiURL}/v1/room`)
      .then((response) => response.json())
      .then((rooms) => {
        // Cập nhật danh sách ghế trong state
        setRoomList(rooms);
        setTrainList(rooms)
      })
      .catch((error) => console.error(error));
  };
  //hàm này dùng để xem tên của toa theo _id
  const findRoomID = (rooms) => {
    const room = RoomList.find(room => room._id === rooms);
    return room ? room.roomNumber : "Unknown";
  }
  const findTrainID = (trains) => {
    const room = RoomList.find(train => train._id === trains);
    return room ? room.nameTrain : "Unknown";
  }

  useEffect(() => {
    // Gửi yêu cầu GET đến máy chủ để lấy thông tin khách hàng
    fetch(`${apiURL}/v1/customer/by-accuser/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        return response.json();
      })
      .then((customerData) => {
        setCustomer(customerData);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
    // Moved this outside the conditional useEffect
    handleViewRoom();
  }, [id]);
  if (loading) {
    return (
      <div className={cx('loading-container')}>
        <Puff
          type="Puff"
          color="#00BFFF"
          height={100}
          width={100}
          timeout={3000} // 3 seconds timeout
        />
        <p className={cx('loading-text')}>Loading...</p>
      </div>
    );
  }
  if (error) {
    return <p>Error: {error}</p>;
  }


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
              <td>Time Order</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{customer.ticket[0].from}</td>
              <td>{customer.ticket[0].to}</td>
              <td>{customer.ticket[0].departure}</td>
              <td>{customer.ticket[0].return}</td>
              <td>{customer.ticket[0].timeGodeparture}</td>
              <td>{customer.ticket[0].timeGoreturn}</td>
              <td>{customer.ticket[0].ticketType}</td>
              <td>{customer.ticket[0].price} VND</td>
              <td>{customer.ticket[0].numberChair}</td>
              <td>{customer.ticket[0].kind}</td>
              <td>{findRoomID(customer.ticket[0].rooms)}</td>
              <td>{findTrainID(customer.ticket[0].rooms)}</td>
              <td>{customer.name}</td>
              <td>{customer.phone}</td>
              <td>{customer.address}</td>
              <td>{customer.createdAt}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Shipping;
