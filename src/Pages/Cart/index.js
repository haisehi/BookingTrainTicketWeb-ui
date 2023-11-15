// Cart.js
import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Cart.module.scss';

const cx = classNames.bind(styles);

function Cart() {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        // Lấy thông tin giỏ hàng từ localStorage khi component được tạo
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(storedCart);
    }, []);

    // Hàm thanh toán (ví dụ)
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
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map(item => (
                                <tr key={item._id} className={cx('cart-item')}>
                                    <td>{item.from}</td>
                                    <td>{item.to}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.price * item.quantity} VND</td>
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
