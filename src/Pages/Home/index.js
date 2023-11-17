
import classNames from 'classnames/bind';
import styles from './Home.module.scss'
import Button from '../../Component/Button';


import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSuitcase, faUtensils, faGamepad, faChild, faDog, faHeadset, faOtter } from '@fortawesome/free-solid-svg-icons';
import io from 'socket.io-client';
const socket = io('http://localhost:8000'); 

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
                    return result.from === formData.from && result.to === formData.to && result.departure === formData.departure && result.return === formData.return;
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

    //hàm thêm sản phẩm vào giỏ hàng
    const addToCart = async (productId) => {
        // Lấy thông tin sản phẩm từ searchResult dựa vào productId
        const product = searchResult.find(item => item._id === productId);
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
                // Cập nhật trạng thái của sản phẩm trong searchResult ngay sau khi thêm vào giỏ hàng
                const updatedSearchResult = searchResult.map(item => (item._id === productId ? { ...item, state: true } : item));
                setSearchResult(updatedSearchResult);

                // Gửi thông điệp đến server với sự kiện 'updateCartState'
                socket.emit('updateCartState');
            }
        } else {
            // Nếu sản phẩm chưa tồn tại trong giỏ hàng, thêm mới vào giỏ hàng
            existingCartItem.push({ ...product, quantity: 1 });
            // Cập nhật trạng thái của sản phẩm trong searchResult ngay sau khi thêm vào giỏ hàng
            const updatedSearchResult = searchResult.map(item => (item._id === productId ? { ...item, state: true } : item));
            setSearchResult(updatedSearchResult);
            socket.emit('updateCartState');
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
                                    <Button primary href='' className={cx('btn')}>Search</Button>
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

                        {result.state ? (
                            <button
                                className={cx('button_result','btnTrue')}
                                onClick={() => alert("Train tickets are being purchased, please wait or choose another ticket")}
                                disabled={addToCartDisabled} // Sử dụng trạng thái addToCartDisabled để kiểm soát trạng thái của nút
                            >
                                Add to cart
                            </button>
                        ) : (
                            <button
                                className={cx('button_result','btnFalse')}
                                onClick={() => addToCart(result._id)}
                                disabled={addToCartDisabled} // Sử dụng trạng thái addToCartDisabled để kiểm soát trạng thái của nút
                            >
                                Add to cart
                            </button>
                        )}
                    </div>
                ))}
            </div>
            {/* content */}
            <div className={cx('wrapper_content')} >
                <div className={cx('content_item')}>
                    <h2 className={cx('title_content')}>Vietnam Railway Map</h2>
                    <p className={cx('content')}>
                        Vietnam Railway Map – The Vietnamese railway system now has the total length of about 2.600km, connecting most cities and provinces all over Vietnam, including many cultural, societal and tourism destinations from the North to the South of Vietnam.
                        The domestic railway system is also linked with the Chinese railway that allows the train to come across the borderline and reach stations in Nanning and Beijing.
                    </p>
                    <div className={cx('image_content')}>
                        <img src="https://i0.wp.com/vietnamrailway.com.vn/wp-content/uploads/2019/10/Vietnam-train-map-detail-vietnamrailway.com_.vn-02.png?w=1500&ssl=1" />
                    </div>
                </div>
            </div>
            {/* content service */}
            <div className={cx('service_wrapper')}>
                <div className={cx('service_wrapper_title')}>
                    <h2 className={cx('service_title')}>Onboard services on Train</h2>
                    <p className={cx('service_title_content')}>Discover more about the onboard services offered on Vietnam Domestic trains.</p>
                </div>
                <div className={cx('service_content')}>
                    {/* box item */}
                    <div className={cx('service_content_item')}>
                        <div className={cx('service_title_item')}>
                            <FontAwesomeIcon icon={faSuitcase} />
                            <h3 >Luggage</h3></div>
                        <div className={cx('service_content-item-right')}>
                            Although there is no limit on luggage weight when participating in domestic train trips in Vietnam, please take responsibility for ensuring the safety of your personal luggage.<br />
                            Remember to label each bag clearly and adhere to the size regulations. For trains to and from domestic cities, the length of the luggage must not exceed 85 cm, while the maximum dimensions are 75 x 53 x 30 cm for trains running within Europe.
                        </div>
                    </div>
                    {/* box item */}
                    <div className={cx('service_content_item')}>
                        <div className={cx('service_title_item')}>
                            <FontAwesomeIcon icon={faUtensils} />
                            <h3 >Food and drink</h3>
                        </div>
                        <div className={cx('service_content-item-right')}>
                            If you are experiencing domestic train travel in Vietnam, depending on your ticket class, you will have different culinary experiences.<br />
                            For passengers in standard class, you can choose from a variety of drinks and snacks at the onboard service counter. Payment can be made by card or cash in Vietnamese Dong.<br />
                            If you choose Standard Premier class, you will be served snacks and drinks right at your seat.<br />
                            With Business or Premium class, you will enjoy a delicious meal and continuous beverage service throughout the journey.<br />
                            Visit the onboard bar to choose from a wide range of hot and cold drinks, as well as sweet and savory snacks on all domestic trains. For Premium class, your meal will be served directly to your seat, making your journey comfortable and convenient.<br />
                        </div>
                    </div>
                    {/* box item */}
                    <div className={cx('service_content_item')}>
                        <div className={cx('service_title_item')}>
                            <FontAwesomeIcon icon={faGamepad} />
                            <h3 >Entertainment</h3>
                        </div>
                        <div className={cx('service_content-item-right')}>
                            During your domestic train journey in Vietnam, you will enjoy free WiFi to stay connected online. Furthermore, at your seat, there will be power sockets that correspond to UK and EU plug standards. This makes it easy to recharge your devices during domestic travel, ensuring you're always connected and ready to capture those special moments.
                        </div>
                    </div>
                    {/* box item */}
                    <div className={cx('service_content_item')}>
                        <div className={cx('service_title_item')}>
                            <FontAwesomeIcon icon={faChild} />
                            <h3 >Travel with children</h3>
                        </div>
                        <div className={cx('service_content-item-right')}>
                            In Vietnam, children under 4 years old often have a free travel policy on domestic trains, as long as they travel with an adult and sit on their lap or can buy a child ticket to ensure their own seat.<br />
                            On domestic trains, you can find dedicated family areas with changing desks to cater to your needs. The seats can be arranged to create a comfortable space for the family, perhaps 4 seats facing each other so you can conveniently experience the journey together.<br />
                        </div>
                    </div>
                    {/* box item */}
                    <div className={cx('service_content_item')}>
                        <div className={cx('service_title_item')}>
                            <FontAwesomeIcon icon={faDog} />
                            <h3 >Pet</h3>
                        </div>
                        <div className={cx('service_content-item-right')}>
                            If you want to travel domestically by train in Vietnam with pets, check specific regulations before your trip, as rules may vary depending on the specific station and service. Here are some general guidelines:<br />
                            <h4>Domestic Train:</h4><br />
                            Small pets may be allowed to go free, but need to be placed in a cage or specialized bag of a certain size.
                            If your pet is larger in size, you may need to purchase a ticket for them and take the safest measures for both passengers and pets.
                            <h4>Seating and Private Areas:</h4><br />
                            Some stations may provide separate seating or areas for passengers traveling with pets.
                            Please contact the station or train service directly for detailed information and reservations.
                            <h4>Special Rules:</h4><br />
                            For guide and service dogs, check specific booking rules and other measures required.
                            <br />
                            Note that traveling with pets may require special measures to ensure the safety and comfort of both passengers and pets.
                        </div>
                    </div>
                    {/* box item */}
                    <div className={cx('service_content_item')}>
                        <div className={cx('service_title_item')}>
                            <FontAwesomeIcon icon={faHeadset} />
                            <h3 >Special support</h3>
                        </div>
                        <div className={cx('service_content-item-right')}>
                            If you need help getting on or off the train during your domestic train travel in Vietnam, please contact the station or train service directly before your trip for details about the programs. Special support available.
                            <br />
                            Here are some general guidelines:
                            <br />
                            <h4>Contact Before:</h4>

                            Contact the train service or station directly at least 48 hours before your trip to advise of the need for assistance and make appropriate arrangements.
                            <br />
                            <h4>Wheelchair Reservations:</h4>
                            <br />
                            If you use a wheelchair, make sure you book a wheelchair space, and check if there are any requests or costs that need to be dealt with.
                            <br />
                            <h4>Prepare Before Arriving at the Station:</h4>
                            <br />
                            Arrive at the station at least one hour before your scheduled departure time to allow time to arrange support measures and check your condition.
                            <br />
                            <h4>Regulations for Wheelchairs:</h4>
                            <br />
                            For wheelchairs, check specific regulations regarding acceptable wheelchair sizes, weights and types.
                            <br />
                            Note that advance notice and contact will help ensure that all arrangements are made to ensure you have a smooth and comfortable journey.
                        </div>
                    </div>
                    {/* box item */}
                    <div className={cx('service_content_item')}>
                        <div className={cx('service_title_item')}>
                            <FontAwesomeIcon icon={faOtter} />
                            <h3 >Other</h3>
                        </div>
                        <div className={cx('service_content-item-right')}>
                            If you are traveling by domestic train in Vietnam, check the train service and station's specific regulations regarding special items. Here are some general guidelines:
                            <br />
                            <h4>Liquid:</h4>
                            Normally, there are no restrictions on liquids on domestic trains, but there may be specific regulations for special types. As for alcohol, check to see if there are restrictions on the amount and type of alcohol you can bring.
                            <h4>Sport equipment:</h4>
                            Carrying of golf bags and items such as tents, bats, billiards, and darts may depend on the specific regulations of the train service and station.
                            For camping equipment, butane, and camping gas bottles, it may be necessary to check whether they are allowed on board or not.
                            <h4>Repair Tools and Pocket Knives:</h4>
                            If you carry a pocket knife or repair tool, check to see if there are specific regulations regarding acceptable blade sizes and types.
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Home;