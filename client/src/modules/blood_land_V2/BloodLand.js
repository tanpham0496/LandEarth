import React, { useEffect } from 'react'
import MenuComponent from "./component/Menu";
import MenuLeftComponent from "./component/MenuLeftMap";
import LandMapBox from "../blood_land/components/mapBoxComponent/LandMapBox";
import NotificationBlood from '../blood_land/components/common/Components/AdsToggle';
import {connect, useDispatch} from 'react-redux';
import PopupComponent from "./component/Popup";
//import { socketActions } from '../../store/actions/socketActions';

const BloodLand = (props) => {

    const dispatch = useDispatch();


    const defaultMap = {
        center: [37.566535, 126.9779692],
        zoom: 22,
        size: null,
        bounds: null,
        map: null,
    };

    useEffect(() => {
        //console.log('props', props);
        dispatch({ type: 'USER_NEW_CONNECT', data: { io: 8 } });



    }, [])

    return (
        //may cai Map se nam trong component nay
        <div className='bd-example is-fullwidth'>
            {/*//Menu component*/}
            <MenuLeftComponent/>
            {props.screens['NotificationBlood'] && <NotificationBlood/>}
            <MenuComponent/>
            <LandMapBox dataMap={defaultMap}/>
            <PopupComponent/>


        </div>
    )
};
const mapStateToProps = (state) => {
    const {screens, sockets} = state;
    return {
        screens,
        sockets
    }
}
const mapDispatchToProps = (dispatch) => {

}
export default connect(mapStateToProps,mapDispatchToProps)(BloodLand)
