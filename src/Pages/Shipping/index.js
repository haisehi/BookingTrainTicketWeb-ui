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
const apiURL = process.env.REACT_APP_API_URL;

const Shipping = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.login.currentUser);
  const accessToken = user?.accessToken;
  const id = user?._id;
  const axiosJWT = createAxios(user, dispatch, logoutUser);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customer, setCustomer] = useState([]);
  const [RoomList, setRoomList] = useState([]);
  const [trainList, setTrainList] = useState([]);

  const handleLogOut = () => {
    logoutUser(dispatch, id, navigate, accessToken, axiosJWT);
  };

  const handleViewRoom = () => {
    fetch(`${apiURL}/v1/room`)
      .then((response) => response.json())
      .then((rooms) => {
        setRoomList(rooms);
        setTrainList(rooms);
      })
      .catch((error) => console.error(error));
  };

  const findRoomID = (rooms) => {
    const room = RoomList.find((room) => room._id === rooms);
    return room ? room.roomNumber : "Unknown";
  };

  const findTrainID = (trains) => {
    const room = RoomList.find((train) => train._id === trains);
    return room ? room.nameTrain : "Unknown";
  };

  useEffect(() => {
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
          timeout={3000}
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
        <table border="1">
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
            {customer.map((customerData, index) =>
              customerData.ticket.map((ticket) => (
                <tr key={ticket._id}>
                  <th className={cx('thMobile')}>{index}</th>
                  <th className={cx('thMobile')}>From</th>
                  <td>{ticket.from}</td>
                  <th className={cx('thMobile')}>To</th>
                  <td>{ticket.to}</td>
                  <th className={cx('thMobile')}>Departure</th>
                  <td>{ticket.departure}</td>
                  <th className={cx('thMobile')}>Return</th>
                  <td>{ticket.return}</td>
                  <th className={cx('thMobile')}>Time go departure</th>
                  <td>{ticket.timeGodeparture}</td>
                  <th className={cx('thMobile')}>Time go return</th>
                  <td>{ticket.timeGoreturn}</td>
                  <th className={cx('thMobile')}>Ticket Type</th>
                  <td>{ticket.ticketType}</td>
                  <th className={cx('thMobile')}>Price</th>
                  <td>{ticket.price}</td>
                  <th className={cx('thMobile')}>Number chair</th>
                  <td>{ticket.numberChair}</td>
                  <th className={cx('thMobile')}>kind</th>
                  <td>{ticket.kind}</td>
                  <th className={cx('thMobile')}>Room</th>
                  <td>{findRoomID(ticket.rooms)}</td>
                  <th className={cx('thMobile')}>Train</th>
                  <td>{findTrainID(ticket.rooms)}</td>
                  <th className={cx('thMobile')}>Name</th>
                  <td>{customerData.name}</td>
                  <th className={cx('thMobile')}>Phone</th>
                  <td>{customerData.phone}</td>
                  <th className={cx('thMobile')}>Address</th>
                  <td>{customerData.address}</td>
                  <th className={cx('thMobile')}>Time Order</th>
                  <td>{customerData.createdAt}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Shipping;
