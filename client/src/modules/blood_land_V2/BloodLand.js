import React, {Fragment, useEffect, useState} from 'react'
import MenuComponent from "./component/Menu";
import MenuLeftComponent from "./component/MenuLeftMap";
import LandMapBox from "./component/mapBoxComponent/LandMapBox";
import MiniMapBox from "./component/mapBoxComponent/MiniMapBox";
import NotificationBlood from '../blood_land/components/common/Components/AdsToggle';
import {connect, useDispatch} from 'react-redux';
import PopupComponent from "./component/Popup";
import LandPrice from "./component/Function/LandPrice";

import { getFisrtLocation } from './component/mapBoxComponent/mapFunction';
import {ADD_POPUP, screenActions} from "../../store/actions/commonActions/screenActions";

//import { socketActions } from '../../store/actions/socketActions';

const BloodLand = (props) => {

    const dispatch = useDispatch();
    const [defaultMap, setDefaultMap] = useState(null);

    useEffect(() => {
        
        //user connect socket
        dispatch({ type: 'USER_NEW_CONNECT' });

        //set default land
        getFisrtLocation().then(location => {
            setDefaultMap({
                center: location,
                zoom: 19,
            });
        });

        props.addPopup({name : 'selectLand'});
        dispatch({ type: 'USER_NEW_CONNECT' });

    }, []);
    return (
        //may cai Map se nam trong component nay
        <div className='bd-example is-fullwidth'>
            {/*//Menu component*/}
            <MenuLeftComponent/>
            {props.screens['NotificationBlood'] && <NotificationBlood/>}
            {props.screens['LandPrice'] && <LandPrice />}
            <MenuComponent/>
            { defaultMap && <LandMapBox {...defaultMap}/> }
            {/*<MiniMapBox {...infoMapCity}/>*/}
            <PopupComponent/>
        </div>
    )
};
const mapStateToProps = (state) => {
    const {screens, sockets} = state;
    return {
        screens,
        sockets,
    }
};
const mapDispatchToProps = (dispatch) => ({
    addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
});
export default connect(mapStateToProps,mapDispatchToProps)(BloodLand)
