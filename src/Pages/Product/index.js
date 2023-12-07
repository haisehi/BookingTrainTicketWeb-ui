import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Puff } from 'react-loader-spinner';
import 'react-loader-spinner';

import classNames from 'classnames/bind';
import styles from './Product.module.scss'


const cx = classNames.bind(styles);
const apiURL = process.env.REACT_APP_API_URL;
// Trong component Products hoặc bất kỳ component nào khác
function Products() {
    const location = useLocation();
    const { productId } = location.state || {};
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [Ticket, setTicket] = useState([]);
    const [formData, setFormData] = useState({
        state: false,
    });
    const [RoomList, setRoomList] = useState([]);
    const [trainList, setTrainList] = useState([]);
    const [addToCartDisabled, setAddToCartDisabled] = useState(false); //để kiểm soát trạng thái của nút add to cart


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
        fetch(`${apiURL}/v1/tickets/${productId}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                return response.json();
            })
            .then((TicketData) => {
                setTicket(TicketData);
                // console.log(TicketData);
            })
            .catch((error) => {
                setError(error.message);
            })
            .finally(() => {
                setLoading(false);
            });

        handleViewRoom();
    }, [productId]);

    // if (loading) {
    //     return (
    //         <div >
    //             <Puff
    //                 type="Puff"
    //                 color="#00BFFF"
    //                 height={100}
    //                 width={100}
    //                 timeout={3000}
    //             />
    //             <p >Loading...</p>
    //         </div>
    //     );
    // }

    if (error) {
        return <p>Error: {error}</p>;
    }

    //hàm thêm sản phẩm vào giỏ hàng
    const addToCart = async (productId) => {
        const product = Ticket; // Sử dụng Ticket trực tiếp nếu nó là một đối tượng, không phải mảng
        // Kiểm tra nếu sản phẩm đã tồn tại trong giỏ hàng
        const existingCartItem = JSON.parse(localStorage.getItem('cart')) || [];
        const isProductInCart = existingCartItem.find(item => item._id === productId);
        try {
            // Make an API call to update the ticket state to true
            await fetch(`${apiURL}/v1/tickets/update-ticket-state/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ state: true }),
            });
            console.log('Ticket state updated successfully.');
        } catch (error) {
            console.error('Error updating ticket state:', error);
        }
        if (isProductInCart && isProductInCart.addToCartDisabled) {
            // Nếu sản phẩm đã tồn tại trong giỏ hàng và có thuộc tính addToCartDisabled, không thực hiện thêm vào giỏ hàng
            console.log("Train tickets are being purchased, please wait or choose another ticket");
            return;
        }
        if (isProductInCart) {
            // Nếu sản phẩm đã tồn tại trong giỏ hàng, thêm thuộc tính addToCartDisabled và đặt thời gian chờ khi trở lại trạng thai state
            isProductInCart.addToCartDisabled = true;
            setAddToCartDisabled(true); // Set trạng thái addToCartDisabled của component
            if (formData.state === false) {
                isProductInCart.addToCartDisabled = false;
                setAddToCartDisabled(false); // Set trạng thái addToCartDisabled của component trở lại false sau khi trở lại trạng thai state
                console.log("Now you can add to cart.");
                // Cập nhật trạng thái của sản phẩm trong Ticket ngay sau khi thêm vào giỏ hàng
                const updatedTicket = Ticket.map(item => (item._id === productId ? { ...item, state: true } : item));
                setTicket(updatedTicket);
            }
        } else {
            // Nếu sản phẩm chưa tồn tại trong giỏ hàng, thêm mới vào giỏ hàng
            existingCartItem.push({ ...product, quantity: 1 });
            // Cập nhật trạng thái của sản phẩm trong Ticket ngay sau khi thêm vào giỏ hàng
            const updatedTicket = { ...Ticket, state: true };
            setTicket(updatedTicket);
        }
        // Lưu giỏ hàng vào localStorage
        localStorage.setItem('cart', JSON.stringify(existingCartItem));
    };
    return (
        <div className={cx('product-container')}>
            {loading && (
                <div>
                    <Puff type="Puff" color="#00BFFF" height={100} width={100} timeout={3000} />
                    <p>Loading...</p>
                </div>
            )}

            {error && <p>Error: {error}</p>}

            {!loading && !error && (
                <div className={cx('product-details')}>
                    <h2>Product Details</h2>
                    <img className={cx('product-image')} src={`${apiURL}/${Ticket.img}`} alt="Uploaded" />
                    <div>{Ticket.from}</div>
                    <div>{Ticket.To}</div>
                    <div>{Ticket.departure}</div>
                    <div>{Ticket.return}</div>
                    <div>{Ticket.timeGodeparture}</div>
                    <div>{Ticket.timeTodeparture}</div>
                    <div>{Ticket.timeGoreturn}</div>
                    <div>{Ticket.timeToreturn}</div>
                    <div>{Ticket.ticketType}</div>
                    <div>{Ticket.price}</div>
                    <div>{Ticket.numberChair}</div>
                    <div>{Ticket.state}</div>
                    <div>{Ticket.kind}</div>
                    <div>{findRoomID(Ticket.rooms._id)}</div>
                    <div>{findTrainID(Ticket.rooms._id)}</div>

                    <div>
                        {Ticket.state ? (
                            <button
                                className={cx('button-result', 'btn-true')}
                                onClick={() => alert('Train tickets are being purchased, please wait or choose another ticket')}
                                disabled={addToCartDisabled}
                            >
                                Add to cart
                            </button>
                        ) : (
                            <button
                                className={cx('button-result', 'btn-false')}
                                onClick={() => addToCart(Ticket._id)}
                                disabled={addToCartDisabled}
                            >
                                Add to cart
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Products;
