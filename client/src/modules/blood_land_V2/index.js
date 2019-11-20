import React, {Component, Fragment , memo, useEffect} from 'react';
import { translate } from 'react-i18next';
import { connect, useSelector, useDispatch } from "react-redux";
import MultipleMap from "../blood_land/components/general/MultipleMap";
import { settingActions } from "../../store/actions/commonActions/settingActions";
import ReactHowler from 'react-howler'
import { bloodAppId } from '../../helpers/config';
import { getTokenErrorAlert } from "../blood_land/alertPopup";
import { landActions } from "../../store/actions/landActions/landActions";
import { shopsActions } from "../../store/actions/gameActions/shopsActions";
import BloodLand from "./BloodLand";
import SoundHowlerComponent from '../blood_land_V2/component/Setting/SoundHowlerComponent';

function WrapperCompomnent(props) {

    const dispatch = useDispatch();
    const { auth: { user }, settings, alert } = useSelector(state => state);

    useEffect(() => {
        dispatch(landActions.getDefault());
        dispatch(settingActions.getSetting({ userId: user._id }));
    }, [])

    return (
        <Fragment>
            {/*{<MultipleMap checkDisplay={checkDisplay}/>}*/}
            <BloodLand/>
            { settings && settings.bgMusic && settings.bgMusic.turnOn && <SoundHowlerComponent {...settings} /> }
            { alert.tokenError && getTokenErrorAlert() }
        </Fragment>
    )
}

export default WrapperCompomnent






