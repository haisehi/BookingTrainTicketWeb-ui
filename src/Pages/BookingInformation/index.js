import { useState, useEffect } from 'react';
import { Puff } from 'react-loader-spinner';
import Button from '../../Component/Button';
import classNames from 'classnames/bind';
import styles from './BookingInfor.module.scss';

const cx = classNames.bind(styles);
const apiURL = process.env.REACT_APP_API_URL;

function BookingInformation() {
    const [formData, setFormData] = useState({
        CMND: '',
    });
    const [customer, setCustomer] = useState(null);
    const [RoomList, setRoomList] = useState([]);
    const [trainList, setTrainList] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleViewRoom = (e) => {
        setLoading(true);
        fetch(`${apiURL}/v1/room`)
            .then((response) => response.json())
            .then((rooms) => {
                setRoomList(rooms);
                setTrainList(rooms);
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    };

    const findRoomID = (rooms) => {
        const room = RoomList.find((room) => room._id === rooms);
        return room ? room.roomNumber : 'Unknown';
    };

    const findTrainID = (trains) => {
        const room = RoomList.find((train) => train._id === trains);
        return room ? room.nameTrain : 'Unknown';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${apiURL}/v1/customer/by-idCard/${formData.CMND}`);
            const data = await response.json();
            if (response.ok) {
                console.log(data);
                setCustomer(data);
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('Error fetching customer data:', error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        handleViewRoom();
        console.log('Customer information:', customer);
    }, [customer]);

    return (
        <div className={cx('wrapper_form-bg')}>
            <div className={cx('wrapper_form')}>
                <h2 className={cx('form_title')}>
                    SEARCH YOUR INFORMATION TICKET BY IDENTIFICATION CARD
                </h2>
                <form className={cx('form')}>
                    <div className={cx('wrapper_form-input')}>
                        <div className={cx('form_labelInput')}>
                            <label className={cx('form_label')}>IDENTIFICATION CARD</label>
                            <input
                                type="text"
                                name="CMND"
                                value={formData.CMND}
                                onChange={handleInputChange}
                                className={cx('form_input')}
                                placeholder="Your Identification card"
                            />
                        </div>
                    </div>
                    <Button text className={cx('btn')} onClick={handleSubmit}>
                        Search
                    </Button>
                </form>
            </div>
            {loading ? (
                <div className={cx('loading-container')}>
                    <div className={cx('loading')}>
                        <Puff type="Puff" color="#00BFFF" height={100} width={100} timeout={3000} />
                        <p className={cx('loading-text')}>Loading...</p>
                    </div>
                </div>
            ) : (
                customer && customer.map((customerData) => (
                    <div key={customerData._id} className={cx('inforCus')}>
                        <h2>Customer Information</h2>
                        <p>Name: {customerData.name}</p>
                        <p>Object: {customerData.object}</p>
                        <p>Phone: {customerData.phone}</p>
                        <p>Email: {customerData.email}</p>
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
                            {customerData.ticket.map((ticket) => (
                                <tbody key={ticket._id}>
                                    <tr>
                                        <td>{ticket.from}</td>
                                        <td>{ticket.to}</td>
                                        <td>{ticket.ticketType}</td>
                                        <td>{ticket.departure}</td>
                                        <td>{ticket.return}</td>
                                        <td>{ticket.timeTodeparture}</td>
                                        <td>{ticket.timeGoreturn}</td>
                                        <td>{ticket.numberChair}</td>
                                        <td>{findRoomID(ticket.rooms)}</td>
                                        <td>{findTrainID(ticket.rooms)}</td>
                                        <td>{ticket.kind}</td>
                                        <td>{ticket.price}</td>
                                    </tr>
                                </tbody>
                            ))}
                        </table>
                    </div>
                ))
            )}
        </div>
    );

}

export default BookingInformation;
