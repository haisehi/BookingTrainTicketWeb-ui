import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Cart.module.scss';

const cx = classNames.bind(styles);
const apiURL = process.env.REACT_APP_API_URL

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [countdown, setCountdown] = useState(300); // Thời gian đếm ngược ban đầu, tính bằng giây

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

    const handleDeleteItem = (itemId) => {
        // Xoá sản phẩm khỏi giỏ hàng dựa trên itemId
        const updatedCart = cartItems.filter(item => item._id !== itemId);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setCartItems(updatedCart);

        // Update ticket state in the database when removing from the cart
        updateTicketState(itemId);
    };

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

    const handleCheckout = () => {
        // Thực hiện xử lý thanh toán theo nhu cầu của bạn
        console.log("Processing payment...");

        // Làm mới giỏ hàng
        localStorage.removeItem('cart');
        setCartItems([]);
    };


    return (
        <div className={cx('cart-container')}>
            <h2>Your Cart</h2>
            {cartItems.length > 0 ? (
                <div>
                    <table className={cx('cart-table')}>
                        <thead>
                            <tr>
                                <th>From</th>
                                <th>To</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Time</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map(item => (
                                <tr key={item._id} className={cx('cart-item')}>
                                    <td>{item.from}</td>
                                    <td>{item.to}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.price * item.quantity} VND</td>
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
                    <form>
                        <label>Fullname</label>
                        <input type='text' />
                        <label>Object</label>
                        <input type='text' />
                        <label>phone</label>
                        <input type='number' />
                        <label>Email</label>
                        <input type='email' />
                        <label>Address</label>
                        <input type='text' />
                        <label>CCCD</label>
                        <input type='text' />
                        <label>Pay method</label>
                        <input type='text' />
                    </form>
                </div>
            ) : (
                <p>Your cart is empty.</p>
            )}
            {cartItems.length > 0 && (
                <button onClick={handleCheckout} className={cx('checkout-button')}>
                    Proceed to Checkout
                </button>
            )}
        </div>
    );
}

export default Cart;
