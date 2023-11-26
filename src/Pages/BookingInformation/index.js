import { useState, useEffect } from 'react';
import { Puff } from 'react-loader-spinner';


import Button from '../../Component/Button';
import classNames from 'classnames/bind';
import styles from './BookingInfor.module.scss';

const cx = classNames.bind(styles);
const apiURL = process.env.REACT_APP_API_URL;

function BookingInformation() {
    const [formData, setFormData] = useState({
        // Khai báo các trường dữ liệu bạn muốn gửi qua API ở đây.
        CMND: '',
    });
    const [customer, setCustomer] = useState(null);
    const [RoomList, setRoomList] = useState([]);  // State để lưu danh sách toa
    const [trainList, setTrainList] = useState([]);  // State để lưu danh sách toa

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${apiURL}/v1/customer/by-idCard/${formData.CMND}`);
            const data = await response.json();
            if (response.ok) {
                console.log(data)
                setFormData(data);
                setCustomer(data);
            } else {
                console.error(data.message); // Handle error message
            }
        } catch (error) {
            console.error('Error fetching customer data:', error);
        }
    };
    useEffect(() => {
        // You can perform additional actions when customerInfo is updated
        handleViewRoom()
        console.log('Customer information:', customer);
    }, [customer]);


    return (
        <div className={cx('wrapper_form-bg')}>
            <div className={cx('wrapper_form')}>
                <h2 className={cx('form_title')}>SEARCH YOUR INFORMATION TICKET BY IDENTIFICATION CARD</h2>
                <form className={cx('form')}>
                    <div className={cx('wrapper_form-input')}>
                        <div className={cx('form_labelInput')}>
                            <label className={cx('form_label')}>IDENTIFICATION CARD</label>
                            <input
                                type='text'
                                name='CMND'
                                value={formData.CMND}
                                onChange={handleInputChange}
                                className={cx('form_input')}
                                placeholder='Your Identification card'
                            />
                        </div>
                    </div>
                    <Button text className={cx('btn')} onClick={handleSubmit}>
                        Search
                    </Button>
                </form>
            </div>
            {customer && (
                <div className={cx('inforCus')}>
                    <h2>Customer Information</h2>
                    <p>Name: {customer.name}</p>
                    <p>Object: {customer.object}</p>
                    <p>Phone: {customer.phone}</p>
                    <p>Email: {customer.email}</p>
                    <table border={1}>
                        <thead>
                            <tr>
                                <td>From</td>
                                <td>To</td>
                                <td>Type</td>
                                <td>Departure</td>
                                <td>Return</td>
                                <td>Time Go Departure</td>
                                <td>Time Go Return</td>
                                <td>Chair</td>
                                <td>Room</td>
                                <td>Train</td>
                                <td>Kind of tikcet</td>
                                <td>price</td>
                            </tr>
                        </thead>
                        {/* Render customer information from the API call */}
                        {setCustomer && (
                            <tbody>
                                {customer.ticket.map((ticket) => (
                                    <tr key={ticket._id}>
                                        <td>{ticket.from}</td>
                                        <td>{ticket.to}</td>
                                        <td>{ticket.ticketType}</td>
                                        <td>{ticket.departure}</td>
                                        <td>{ticket.return}</td>
                                        <td>{ticket.timeTodeparture}</td>
                                        <td>{ticket.timeGoreturn}</td>
                                        <td>{ticket.numberChair}</td>
                                        <td>{ticket.numberChair}</td>
                                        <td>{findTrainID(ticket.rooms)}</td>
                                        <td>{findRoomID(ticket.rooms)}</td>
                                        <td>{ticket.price}</td>
                                        {/* ... other ticket information */}
                                    </tr>
                                ))}
                            </tbody>
                        )}
                    </table>
                </div>
            )}
        </div>
    );
}

export default BookingInformation;
