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

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className={cx('product-container')}>
            {loading && (
                <div className="loader-container">
                    <Puff type="Puff" color="#00BFFF" height={100} width={100} timeout={3000} />
                    <p className="loader-text">Loading...</p>
                </div>
            )}

            {error && <p className="error-message">Error: {error}</p>}

            {!loading && !error && (
                <div className={cx('product-details')}>
                    <div className={cx('product-image-container')}>
                        <img className={cx('product-image')} src={`${apiURL}/${Ticket.img}`} alt="Product" />
                    </div>
                    <div className={cx('product-info')}>
                        <h2>{Ticket.from} to {Ticket.to}</h2>
                        <div className={cx('details-row')}>
                            <span>Departure:</span>
                            <div>{Ticket.departure}</div>
                        </div>
                        <div className={cx('details-row')}>
                            <span>Return:</span>
                            <div>{Ticket.return}</div>
                        </div>
                        <div className={cx('details-row')}>
                            <span>Price:</span>
                            <div>{Ticket.price}</div>
                        </div >
                        <div className={cx('details-row')}>
                            < span > Number of Chairs:</ span>
                            <div>{Ticket.numberChair}</div>
                        </div >
                        <div className={cx('details-row')}>
                            <span span > Ticket Type:</span >
                            <div>{Ticket.ticketType}</div>
                        </div >
                        <div className={cx('details-row')}>
                            <span span > Room:</span >
                            <div>{findRoomID(Ticket.rooms._id)}</div>
                        </div >
                        <div className={cx('details-row')}>
                            <span span > Train:</span >
                            <div>{findTrainID(Ticket.rooms._id)}</div>
                        </div >
                    </div >
                </div >
            )}
        </ div>
    );


}

export default Products;
