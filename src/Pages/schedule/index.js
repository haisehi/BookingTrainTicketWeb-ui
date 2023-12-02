import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { useEffect, useState } from 'react';

import classNames from 'classnames/bind';
import styles from './schedule.module.scss';

const cx = classNames.bind(styles);
const apiURL = process.env.REACT_APP_API_URL;

function Schedule() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [contentList, setContentList] = useState([]);
    const swiperParams = {
        modules: [Navigation, Pagination, Scrollbar, A11y],
        spaceBetween: 50,
        slidesPerView: 1,
        navigation: {
            nextEl: `.${cx('swiper-button-next')}`,
            prevEl: `.${cx('swiper-button-prev')}`,
        },
        pagination: { clickable: true },
        scrollbar: { draggable: true },
        autoplay: { delay: 3000 }, // Chuyển trang tự động sau mỗi 3 giây
    };

    useEffect(() => {
        fetch(`${apiURL}/v1/content`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                return response.json();
            })
            .then((ContentData) => {
                setContentList(ContentData);
            })
            .catch((error) => {
                setError(error.message);
            })
            .finally(() => {
                setLoading(false);
            });

    }, []);

    return (

        <div className={cx('container')}>
            <div className={cx('swiper-container')}>
                <Swiper {...swiperParams}>
                    {contentList.map((contentData, index) => (
                        <SwiperSlide key={index} className={cx('swiper-slide')}>
                            <img className={cx('swiperImg')} src={contentData.Imagecontent} alt={`Slide ${index + 1}`} />
                            <img src={contentData.Imagecontent} alt={`Slide ${index + 1}`} />
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className={cx('swiper-container_btn')}>
                    <div className={cx('swiper-button-prev')} onClick={() => { }}></div>
                    <div className={cx('swiper-button-next')} onClick={() => { }}></div>
                </div>
            </div>
            <h2>Lộ trình di chuyển từ Bắc vào Nam bằng tàu hỏa quốc nội</h2>
            {contentList.map((contentData) => (
                <div className={cx('content-container')}>
                    <div className={cx('box_content')}>
                        <h2>{contentData.title}</h2>
                        <div className={cx('box_content-item')}>
                            <img src={contentData.Imagecontent} />
                            <p>
                                {contentData.content}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Schedule;
