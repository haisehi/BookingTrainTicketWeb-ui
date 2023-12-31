import React, { useState, useEffect, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";


import classNames from 'classnames/bind';
import styles from './Cart.module.scss';

const cx = classNames.bind(styles);
const apiURL = process.env.REACT_APP_API_URL

function Cart() {
    const [data, setData] = useState([]);
    const [formData, setFormData] = useState({
        name: '', object: '', phone: '', email: '', CMND: '', address: '', paymethod: '', ticket: '', accUser: ''
    });
    const [cartItems, setCartItems] = useState([]);
    const [countdown, setCountdown] = useState(800); // Thời gian đếm ngược ban đầu, tính bằng giây
    const [RoomList, setRoomList] = useState([]);  // State để lưu danh sách toa
    const user = useSelector((state) => state.auth.login.currentUser);


    useEffect(() => {
        // Lấy thông tin giỏ hàng từ localStorage khi component được tạo
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        // Thiết lập thời gian hết hạn cho từng sản phẩm trong giỏ hàng
        const updatedCart = storedCart.map(item => ({
            ...item,
            expiration: countdown,
        }));

        setCartItems(updatedCart);
    }, [countdown]);

    useEffect(() => {
        // Bắt đầu hẹn giờ đếm ngược
        const intervalId = setInterval(() => {
            setCountdown(prevCountdown => prevCountdown - 1);
        }, 1000);
        // Lưu ý: useEffect trả về một hàm sẽ được gọi khi component unmount hoặc dependency thay đổi.
        // Trong trường hợp này, chúng ta sẽ xóa hẹn giờ nếu component bị unmount.
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    useEffect(() => {
        // Khi thời gian đếm ngược hết, xoá giỏ hàng và local storage
        if (countdown === 0) {
            cartItems.forEach(async (item) => {
                await updateTicketState(item._id); // Update ticket state in the database
            });
            localStorage.removeItem('cart');
            setCartItems([]);
        }
    }, [countdown]);

    //xoá vé tàu khỏi giỏ hàng
    const handleDeleteItem = (itemId) => {
        // Xoá sản phẩm khỏi giỏ hàng dựa trên itemId
        const updatedCart = cartItems.filter(item => item._id !== itemId);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setCartItems(updatedCart);
        // Update ticket state in the database when removing from the cart
        updateTicketState(itemId);
    };
    //cập nhật trạng thái vé tàu
    const updateTicketState = async (itemId) => {
        try {
            // Make an API call to update the ticket state to false
            await fetch(`${apiURL}/v1/tickets/update-ticket-state/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ state: false }),
            });
            console.log(`Ticket state for item ${itemId} updated to false.`);
        } catch (error) {
            console.error('Error updating ticket state:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    //thực hiện thanh toán
    const handleCheckout = (e) => {
        // Thực hiện xử lý thanh toán theo nhu cầu của bạn
        console.log("Processing payment...");
        e.preventDefault();
        fetch(`${apiURL}/v1/customer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((newCustomerShip) => {
                // Cập nhật danh sách tàu hỏa sau khi thêm thành công
                setData([...data, newCustomerShip]);
                setFormData({
                    name: '', object: '', phone: '', email: '', CMND: '', address: '', paymethod: '', ticket: '', accUser: ''
                });
                console.log("Checkout successful")
            })
            .catch((error) => console.error(error));

        // Làm mới giỏ hàng
        localStorage.removeItem('cart');
        setCartItems([]);
    };

    //----------------------------------------------------------------
    //xem danh sách toa
    useEffect(() => {
        handleViewRoom(); // Gọi hàm này khi component được tạo
    }, []);
    const handleViewRoom = (e) => {
        // Gửi yêu cầu GET đến máy chủ để lấy danh sách toa
        fetch(`${apiURL}/v1/room`)
            .then((response) => response.json())
            .then((rooms) => {
                // Cập nhật danh sách ghế trong state
                setRoomList(rooms);
            })
            .catch((error) => console.error(error));
    };
    //hàm này dùng để xem tên của toa theo _id
    const findTrainID = (rooms) => {
        const room = RoomList.find(room => room._id === rooms);
        return room ? room.nameTrain : "Unknown";
    }
    const findRoomID = (rooms) => {
        const room = RoomList.find(room => room._id === rooms);
        return room ? room.roomNumber : "Unknown";
    }

    return (
        <div className={cx('cart-container')}>
            <h2>Your Cart</h2>
            {cartItems.length > 0 ? (
                <div>
                    <table className={cx('cart-table')}>
                        <thead>
                            <tr>
                                {/* <th>Image</th> */}
                                <th>From</th>
                                <th>To</th>
                                <th>Departure</th>
                                <th>Return</th>
                                <th>Time go departure</th>
                                <th>Time go return</th>
                                <th>kind</th>
                                <th>Number chair</th>
                                <th>Train</th>
                                <th>Room</th>
                                {/* <th>Quantity</th> */}
                                <th>Price</th>
                                <th>Time</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item,index) => (
                                <tr key={item._id} className={cx('cart-item')}>
                                    {/* <td>
                                        {item.img && (
                                            <img src={`${apiURL}/${item.img}`} alt="Uploaded" style={{ height: '50px' }} />
                                        )}
                                    </td> */}
                                    <th className={cx('thMobile')}>{index}</th>
                                    <th className={cx('thMobile')}>From</th>
                                    <td>{item.from}</td>
                                    <th className={cx('thMobile')}>To</th>
                                    <td>{item.to}</td>
                                    <th className={cx('thMobile')}>Departure</th>
                                    <td>{item.departure}</td>
                                    <th className={cx('thMobile')}>Return</th>
                                    <td>{item.return}</td>
                                    <th className={cx('thMobile')}>Time go departure</th>
                                    <td>{item.timeGodeparture}</td>
                                    <th className={cx('thMobile')}>Time go return</th>
                                    <td>{item.timeGoreturn}</td>
                                    <th className={cx('thMobile')}>kind</th>
                                    <td>{item.kind}</td>
                                    <th className={cx('thMobile')}>Number chair</th>
                                    <td>{item.numberChair}</td>
                                    <th className={cx('thMobile')}>Train</th>
                                    <td>{findTrainID(item.rooms)}</td>
                                    <th className={cx('thMobile')}>Room</th>
                                    <td>{findRoomID(item.rooms)}</td>
                                    {/* <td>{item.quantity}</td> */}
                                    <th className={cx('thMobile')}>Price</th>
                                    <td>{item.price * item.quantity} VND</td>
                                    <th className={cx('thMobile')}>Time</th>
                                    <td>{item.expiration}s</td>
                                    <td>
                                        <button onClick={() => handleDeleteItem(item._id)} className={cx('delete-button')}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {user ? (
                        <Fragment>
                            <form>
                                {cartItems.map(item => (
                                    <input
                                        key={item._id}
                                        type='hidden'
                                        name='ticket'
                                        value={formData.ticket = item._id}
                                        onChange={handleInputChange}
                                    />
                                ))}
                                <input
                                    type='hidden'
                                    name='accUser'
                                    value={formData.accUser = user._id}
                                    onChange={handleInputChange}
                                />
                                <label>Fullname</label>
                                <input
                                    type='text'
                                    name='name'
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder='Nguyen Van A'
                                    required
                                />
                                <label>Object</label>
                                <input
                                    type='text'
                                    name='object'
                                    value={formData.object}
                                    onChange={handleInputChange}
                                    placeholder='child or adult'
                                    required
                                />
                                <label>phone</label>
                                <input
                                    type='number'
                                    name='phone'
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder='xx486xxxxx'
                                    required
                                />
                                <label>Email</label>
                                <input
                                    type='email'
                                    name='email'
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder='xx@example.com'
                                    required
                                />
                                <label>Address</label>
                                <input
                                    type='text'
                                    name='address'
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder='Ha Noi city'
                                    required
                                />
                                <label>CCCD</label>
                                <input
                                    type='text'
                                    name='CMND'
                                    value={formData.CMND}
                                    onChange={handleInputChange}
                                    placeholder='xx4452xxxxxx'
                                    required
                                />
                                <label>Pay method (Pay at Station)</label>
                                <input
                                    type='hidden'
                                    name='paymethod'
                                    value={formData.paymethod = "pay at station"}
                                    onChange={handleInputChange}
                                    placeholder='pay later'
                                />
                            </form>
                            {cartItems.length > 0 && (
                                <button onClick={handleCheckout} className={cx('checkout-button')} type='submit'>
                                    Proceed to Checkout
                                </button>
                            )}
                        </Fragment>
                    ) : (
                        <Fragment>
                            <Link to="/Login">
                                <button className={cx('checkout-button')}>
                                    Login to checkout
                                </button>
                            </Link>
                        </Fragment>
                    )}
                </div>
            ) : (
                <div >
                    <p>Your cart is empty.</p>
                    <div className={cx('image')} >
                        <img src="https://th.bing.com/th/id/OIG.tz.kN.VLSv8FUD6XrhBh?pid=ImgGn" />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart;
