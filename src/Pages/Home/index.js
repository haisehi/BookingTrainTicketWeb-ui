
import classNames from 'classnames/bind';
import styles from './Home.module.scss'
import Button from '../../Component/Button';

import React, { useState, useEffect } from 'react';

const cx = classNames.bind(styles)
const apiURL = process.env.REACT_APP_API_URL
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
        rooms: '',
        img: ''
    });
    const [searchResult, setSearchResult] = useState([]);
    const [RoomList, setRoomList] = useState([]);  // State để lưu danh sách toa
    const [oneWayChecked, setOneWayChecked] = useState(false); //để theo dõi trạng thái của checkbox "OneWay"
    const [addToCartDisabled, setAddToCartDisabled] = useState(false); //để kiểm soát trạng thái của nút add to cart

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // Kiểm tra nếu checkbox "OneWay" được chọn, thì làm cho ô "Return" không thể sửa đổi
        if (name === 'return' && oneWayChecked) {
            return;
        }
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${apiURL}/v1/tickets?from=${formData.from}&to=${formData.to}&departure=${formData.departure}&return=${formData.return}`);
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
                        rooms: ticket.rooms,
                        img: ticket.img
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
        fetch(`${apiURL}/v1/room`)
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

    const addToCart = (productId) => {
        // Lấy thông tin sản phẩm từ searchResult dựa vào productId
        const product = searchResult.find(item => item._id === productId);
    
        // Kiểm tra nếu sản phẩm đã tồn tại trong giỏ hàng
        const existingCartItem = JSON.parse(localStorage.getItem('cart')) || [];
        const isProductInCart = existingCartItem.find(item => item._id === productId);
    
        if (isProductInCart) {
            // Nếu sản phẩm đã tồn tại trong giỏ hàng, có thể thực hiện cập nhật số lượng hoặc thêm logic khác theo yêu cầu
            // Ví dụ: tăng số lượng sản phẩm
            isProductInCart.quantity += 1;
        } else {
            // Nếu sản phẩm chưa tồn tại trong giỏ hàng, thêm mới vào giỏ hàng
            existingCartItem.push({ ...product, quantity: 1 });
        }
    
        // Lưu giỏ hàng vào localStorage
        localStorage.setItem('cart', JSON.stringify(existingCartItem));
    };
    

    return (
        <div className={cx('wrapper')} onSubmit={handleSubmit}>
            {/* form */}
            <div className={cx('wrapper_form-bg')}>
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
                                    <input
                                        type='date'
                                        name='departure'
                                        value={formData.departure}
                                        className={cx('form_input')}
                                        placeholder='Departure'
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className={cx('form_labelInput')}>
                                    <label className={cx('form_label')}>
                                        Return
                                    </label>
                                    <input
                                        type='date'
                                        name='return'
                                        value={formData.return}
                                        className={cx('form_input')}
                                        placeholder='Return'
                                        onChange={handleInputChange}
                                        disabled={oneWayChecked}
                                    />

                                </div>
                            </div>

                            <div className={cx('wrapper_form-select')}>
                                <div className={cx('wrapper_form-select2')}>
                                    <div className={cx('form_labelInput')}>
                                        <label className={cx('form_chexbox-lable')}>One way</label>
                                        <input
                                            type='checkbox'
                                            className={cx('chexbox')}
                                            id='OneWay'
                                            checked={oneWayChecked}
                                            onChange={() => setOneWayChecked(!oneWayChecked)}
                                        />

                                    </div>
                                    <div className={cx('form_labelInput')}>
                                        <label className={cx('form_chexbox-lable')}>Round trip</label>
                                        <input type='checkbox' className={cx('chexbox')} id='roundTrip' />
                                    </div>
                                </div>
                                <div className={cx('wrapper_form-select3')}>
                                    <Button primary href='' >Search</Button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div >
            </div>
            {/* test dữ liệu */}
            {/* Hiển thị kết quả tìm kiếm ở đây */}

            <div className={cx('wrapper_results')}>
                {searchResult.map((result, index) => (
                    <div key={index} className={cx('results_ticket')}>
                        <div className={cx('result_item-title')}>{findRoomID(result.rooms)}</div>
                        <div>{result.img && <img className={cx('image_result')} src={`${apiURL}/${result.img}`} alt="Uploaded" />}</div>
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

                        <button
                            className={cx('button_result')}
                            onClick={() => addToCart(result._id)}
                        >
                            Add to cart
                        </button>
                    </div>
                ))
                }
            </div>

        </div >
    );
}

export default Home;