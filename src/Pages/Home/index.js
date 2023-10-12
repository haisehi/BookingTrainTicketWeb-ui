
import classNames from 'classnames/bind';
import styles from './Home.module.scss'
import Button from '../../Component/Button';

const cx = classNames.bind(styles)

function Home() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('wrapper_form')}>
                <h2 className={cx('form_title')}>BUY TICKETS ONLINE</h2>
                <form className={cx('form')} method="" action="">
                    <div className={cx('wrapper_form-input')}>
                        <div className={cx('form_labelInput')}>
                            <label className={cx('form_label')}>
                                From
                            </label>
                            <input type='text' name='' className={cx('form_input')} placeholder='FROM' />
                        </div>

                        <div className={cx('form_labelInput')}>
                            <label className={cx('form_label')}>
                                To
                            </label>
                            <input type='text' name='' className={cx('form_input')} placeholder='To' />
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
                                    <label className={cx('form_label')}>
                                        Time go (Departure)
                                    </label>
                                    <select type='' name='' className={cx('form_input')}  >
                                        <option>All times</option>
                                        <option>0h to 12h</option>
                                        <option>12h to 18h</option>
                                        <option>18h to 23h59</option>
                                    </select>
                                </div>
                                <div className={cx('form_labelInput')}>
                                    <label className={cx('form_label')}>
                                        Time to (Departure)
                                    </label>
                                    <select type='' name='' className={cx('form_input')}  >
                                        <option>All times</option>
                                        <option>0h to 12h</option>
                                        <option>12h to 18h</option>
                                        <option>18h to 23h59</option>
                                    </select>
                                </div>
                            </div>
                            <div className={cx('wrapper_form-select2')}>
                                <div className={cx('form_labelInput')}>
                                    <label className={cx('form_label')}>
                                        Time go (Return)
                                    </label>
                                    <select type='' name='' className={cx('form_input')}  >
                                        <option>All times</option>
                                        <option>0h to 12h</option>
                                        <option>12h to 18h</option>
                                        <option>18h to 23h59</option>
                                    </select>
                                </div>                    <div className={cx('form_labelInput')}>
                                    <label className={cx('form_label')}>
                                        Time to (Return)
                                    </label>
                                    <select type='' name='' className={cx('form_input')}  >
                                        <option>All times</option>
                                        <option>0h to 12h</option>
                                        <option>12h to 18h</option>
                                        <option>18h to 23h59</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={cx('wrapper_form-select3')}>
                        <Button text href=''>Search</Button>
                        <div className={cx('form_chexbox')}>
                            <label className={cx('form_chexbox-lable')}>One way</label>
                            <input type='checkbox' className={cx('chexbox')} id='OneWay'/>
                        </div>
                        <div className={cx('form_chexbox')}>
                            <label className={cx('form_chexbox-lable')}>Round trip</label>
                            <input type='checkbox' className={cx('chexbox')} id='roundTrip'/>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Home;