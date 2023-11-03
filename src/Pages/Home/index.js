
import classNames from 'classnames/bind';
import styles from './Home.module.scss'
import Button from '../../Component/Button';

import React, { useState, useEffect } from 'react';

const cx = classNames.bind(styles)

function Home() {

    const [formData, setFormData] = useState({
        // Khai báo các trường dữ liệu bạn muốn gửi qua API ở đây.
        from: '',
        to: '',
        departure: '',
        return: '',
        timeGodeparture: '',
        timeTodeparture: '',
        timeGoreturn: '',
        timeToreturn: '',
        ticketType: '',
        price: '',
        numberChair: '',
        kind: '',
        state: false,
        rooms: ''
    });
    const [searchResult, setSearchResult] = useState([]);
    const [RoomList, setRoomList] = useState([]);  // State để lưu danh sách toa


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Hàm xử lý sự kiện khi người dùng nhấn nút "Search".   
    // const handleSubmit = (e) => {
    //     e.preventDefault();

    //     fetch(`http://localhost:8000/v1/tickets?from=${formData.from}&to=${formData.to}`)
    //         .then((response) => response.json())
    //         .then((data) => {
    //             // Lọc dữ liệu chỉ chứa các bản ghi có 'from' và 'to' tương ứng.
    //             const filteredData = data.filter((result) => {
    //                 return result.from === formData.from && result.to === formData.to;
    //             });
    //             console.log(filteredData); // Hiển thị dữ liệu tàu trong console hoặc bạn có thể hiển thị nó trên giao diện người dùng.
    //             // Trích xuất thông tin từ mảng rooms

    //             // Cập nhật danh sách tàu trong trạng thái (state) của ứng dụng React
    //             setSearchResult(filteredData);
    //         })
    //         .catch((error) => console.error(error));
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:8000/v1/tickets?from=${formData.from}&to=${formData.to}`);
            const data = await response.json();

            // Kiểm tra xem có dữ liệu phù hợp không
            if (data.length === 0) {
                setSearchResult([]);
                console.log("Không tìm thấy thông tin phù hợp.");
            } else {
                // Sử dụng map để lấy thông tin về tàu từ mảng phòng của mỗi vé
                const datas = data.map((ticket) => {
                    return {
                        _id: ticket._id,
                        from: ticket.from,
                        to: ticket.to,
                        departure: ticket.departure,
                        return: ticket.return,
                        timeGodeparture: ticket.timeGodeparture,
                        timeTodeparture: ticket.timeTodeparture,
                        timeGoreturn: ticket.timeGoreturn,
                        timeToreturn: ticket.timeToreturn,
                        ticketType: ticket.ticketType,
                        price: ticket.price,
                        numberChair: ticket.numberChair,
                        state: ticket.state,
                        kind: ticket.kind,
                        rooms: ticket.rooms
                    };
                });
                //             // Lọc dữ liệu chỉ chứa các bản ghi có 'from' và 'to' tương ứng.
                const filteredData = datas.filter((result) => {
                    return result.from === formData.from && result.to === formData.to;
                });

                setSearchResult(filteredData);
                console.log(filteredData);
            }
        } catch (error) {
            console.error("Lỗi khi tìm kiếm dữ liệu:", error);
        }
    };


    //xem danh sách toa
    useEffect(() => {
        handleViewRoom(); // Gọi hàm này khi component được tạo
    }, []);

    const handleViewRoom = (e) => {
        // Gửi yêu cầu GET đến máy chủ để lấy danh sách toa
        fetch(`http://localhost:8000/v1/room`)
            .then((response) => response.json())
            .then((rooms) => {
                // Cập nhật danh sách ghế trong state
                setRoomList(rooms);
            })
            .catch((error) => console.error(error));
    };
    //hàm này dùng để xem tên của toa theo _id
    const findRoomID = (rooms) => {
        const room = RoomList.find(room => room._id === rooms);
        return room ? room.nameTrain : "Unknown";
    }


    return (
        <div className={cx('wrapper')} onSubmit={handleSubmit}>
            {/* form */}
            <div className={cx('wrapper_form')}>
                <h2 className={cx('form_title')}>BUY TICKETS ONLINE</h2>
                <form className={cx('form')} >
                    <div className={cx('wrapper_form-input')}>
                        <div className={cx('form_labelInput')}>
                            <label className={cx('form_label')}>
                                From
                            </label>
                            <input
                                type='text'
                                name='from'
                                value={formData.from}
                                onChange={handleInputChange}
                                className={cx('form_input')}
                                placeholder='FROM' />
                        </div>

                        <div className={cx('form_labelInput')}>
                            <label className={cx('form_label')}>
                                To
                            </label>
                            <input
                                type='text'
                                name='to'
                                value={formData.to}
                                onChange={handleInputChange}
                                className={cx('form_input')}
                                placeholder='To' />
                        </div>
                    </div>

                    <div className={cx('wrapper_form-inputSelect')}>
                        <div className={cx('wrapper_form-input2')}>
                            <div className={cx('form_labelInput')}>
                                <label className={cx('form_label')}>
                                    Departure
                                </label>
                                <input type='date' name='' className={cx('form_input')} placeholder='Departure' />
                            </div>

                            <div className={cx('form_labelInput')}>
                                <label className={cx('form_label')}>
                                    Return
                                </label>
                                <input type='date' name='' className={cx('form_input')} placeholder='Return' />
                            </div>
                        </div>

                        <div className={cx('wrapper_form-select')}>
                            <div className={cx('wrapper_form-select2')}>
                                <div className={cx('form_labelInput')}>
                                    <label className={cx('form_chexbox-lable')}>One way</label>
                                    <input type='checkbox' className={cx('chexbox')} id='OneWay' />
                                </div>
                                <div className={cx('form_labelInput')}>
                                    <label className={cx('form_chexbox-lable')}>Round trip</label>
                                    <input type='checkbox' className={cx('chexbox')} id='roundTrip' />
                                </div>
                            </div>
                            <div className={cx('wrapper_form-select3')}>
                                    <Button text href='' >Search</Button>
                            </div>
                        </div>
                    </div>


                </form>
            </div >
            {/* test dữ liệu */}
            {/* Hiển thị kết quả tìm kiếm ở đây */}

            <div className={cx('wrapper_results')}>
                {searchResult.map((result, index) => (
                    <div key={index} className={cx('results_ticket')}>
                        <div className={cx('result_item')}>{findRoomID(result.rooms)}</div>
                        <div className={cx('row')}>
                            <h4 className={cx('title_result')}>From</h4>
                            <div className={cx('result_item')}>{result.from}</div>
                            <h4 className={cx('title_result')}>To</h4>
                            <div className={cx('result_item')}>{result.to}</div>
                        </div>
                        <div className={cx('row')}>
                            <h4 className={cx('title_result')}>departure</h4>
                            <div className={cx('result_item')}>{result.departure}</div>
                            <h4 className={cx('title_result')}>return</h4>
                            <div className={cx('result_item')}>{result.return === "" ? "..." : result.return}</div>
                        </div>
                        <div className={cx('row')}>
                            <div className={cx('row_item')}>
                                <h4 className={cx('title_result')}>timeGodeparture</h4>
                                <div className={cx('result_item')}>{result.timeGodeparture} hours</div>
                                <h4 className={cx('title_result')}>timeTodeparture</h4>
                                <div className={cx('result_item')}>{result.timeTodeparture} hours</div>
                            </div>
                            <div className={cx('row_item')}>
                                <h4 className={cx('title_result')}>timeGoreturn</h4>
                                <div className={cx('result_item')}>{result.timeGoreturn === "" ? "..." : `${result.timeGoreturn} hours`}</div>
                                <h4 className={cx('title_result')}>timeToreturn</h4>
                                <div className={cx('result_item')}>{result.timeToreturn === "" ? "..." : `${result.timeToreturn} hours`} </div>
                            </div>
                        </div>
                        <div className={cx('row')}>
                            <h4 className={cx('title_result')}>ticketType</h4>
                            <div className={cx('result_item')}>{result.ticketType}</div>
                            <h4 className={cx('title_result')}>numberChair</h4>
                            <div className={cx('result_item')}>{result.numberChair}</div>
                        </div>
                        <div className={cx('row')}>
                            <h4 className={cx('title_result')}>kind</h4>
                            <div className={cx('result_item')}>{result.kind}</div>
                        </div>
                        <div className={cx('row')}>
                            <h4 className={cx('title_result')}>price</h4>
                            <div className={cx('result_item')}>{result.price} VND</div>
                            <h4 className={cx('title_result')}>state</h4>
                            <div className={cx('result_item')}>{result.state ? "booked" : "still empty"}</div>
                        </div>


                        <button className={cx('button_result')}>Add to cart</button>
                    </div>
                ))
                }
            </div>

        </div >
    );
}

export default Home;