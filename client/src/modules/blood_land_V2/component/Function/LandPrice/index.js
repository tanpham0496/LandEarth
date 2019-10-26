import React, { Fragment ,useState  } from 'react';
import {  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import DatePicker from "react-datepicker";
import {  Modal, Carousel,  CarouselItem,  CarouselControl } from 'reactstrap';
import {loadingImage} from "../../../../blood_land/components/general/System";
import {connect} from 'react-redux'
import {screenActions} from "../../../../../store/actions/commonActions/screenActions";
import "react-datepicker/dist/react-datepicker.css";

const data = [
    {
        name: 'sun', uv: 4000, pv: 2400, amt: 2400, time : '2019/10/11', date : 'Today', price : '50.000'
    },
    {
        name: 'mon', uv: 3000, pv: 1398, amt: 2210, time : '2019/10/12', date : 'Today', price : '60.000'
    },
    {
        name: 'tue', uv: 2000, pv: 9800, amt: 2290, time : '2019/10/13', date : 'Today', price : '45.000'
    },
    {
        name: 'wed', uv: 2780, pv: 3908, amt: 2000, time : '2019/10/14', date : 'Today', price : '47.000'
    },
    {
        name: 'thu', uv: 1890, pv: 4800, amt: 2181, time : '2019/10/15', date : 'Today', price : '53.000'
    },
    {
        name: 'fri', uv: 2390, pv: 3800, amt: 2500, time : '2019/10/16', date : 'Today', price : '51.000'
    },
    {
        name: 'sat', uv: 3490, pv: 4300, amt: 2100, time : '2019/10/17', date : 'Today', price : '58.000'
    },
];

function LandPrice (props){
    const [activeIndex, setActiveIndex] = useState(0);
    const [animating, setAnimating] = useState(false);

    const next = () => {
        if (animating) return;
        const nextIndex = activeIndex === data.length - 1 ? 0 : activeIndex + 1;
        setActiveIndex(nextIndex);
    }

    const previous = () => {
        if (animating) return;
        const nextIndex = activeIndex === 0 ? data.length - 1 : activeIndex - 1;
        setActiveIndex(nextIndex);
    };
    //  controll DatePicker
    const [startDate, setStartDate] = useState(new Date());
    const CustomDatePicker = ({ value, onClick }) => (
        <button className="custom-icon" onClick={onClick}>
            <img  src={loadingImage('/images/bloodLandNew/func/icon-calendar.png')}/>
        </button>
    );

    return (
        <Fragment>
            <Modal isOpen={true} className={'land-Price'} >
                <div className={'header'}>
                    <img className={'img-land-price'} src={loadingImage(`/images/bloodLandNew/func/icon-price-land.png`)}/>
                    <div className={'title'}> 랜드 시세 </div>
                    <div className={'close-popup'} onClick={()=> props.removePopup({name : 'LandPrice'})}>
                        <img  className={'image-zoom-in'} src={loadingImage('/images/bloodLandNew/func/zoom-in.png')}/>
                    </div>
                </div>
                <div className={'body'}>
                    <Carousel  activeIndex={activeIndex}  next={next}  previous={previous} interval={false}  >
                        {data.map((item) => {
                            return (
                                <CarouselItem onExiting={() => setAnimating(true)} onExited={() => setAnimating(false)}  key={item.src} className={{width: '100%', height: '300px'}}>
                                    <div className={'carouselItem'}  style={{color : '#0F2E4E'}}>
                                        <div className={'price-date'}>
                                            {item.time}  <span style={{color : '#6EF488'}}>   {item.date} </span>
                                        </div>
                                        <div className={'price'}>
                                            <h2>{item.price} <span style={{color : '#AC0000'}}> BLOOD </span></h2>
                                        </div>
                                    </div>
                                </CarouselItem>
                            );
                        })}
                        <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous} />
                        <CarouselControl direction="next" directionText="Next" onClickHandler={next} />
                    </Carousel>
                    <LineChart width={600}  height={320} data={data}>
                        <CartesianGrid vertical={false}  strokeDasharray="4 4" stroke="#aab8c2" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="pv" stroke="#6EF488" activeDot={{ r: 8 }} />
                    </LineChart>
                    <DatePicker
                        selected={startDate}
                        onChange={date => setStartDate(date)}
                        customInput={<CustomDatePicker />}
                    />
                </div>
            </Modal>
        </Fragment>

    );
}
const mapStateToProps = (state) => {
    const {screens} = state;
    return {
        screens
    }
};

const mapDispatchToProps = (dispatch) => ({
    removePopup : (screen) => dispatch(screenActions.removePopup(screen))
})
export default connect(mapStateToProps,mapDispatchToProps)(LandPrice);
