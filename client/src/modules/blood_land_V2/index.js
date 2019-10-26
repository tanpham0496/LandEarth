import React, {Component, Fragment , memo, useEffect} from 'react';
import { translate } from 'react-i18next';
import connect from "react-redux/es/connect/connect";
import MultipleMap from "../blood_land/components/general/MultipleMap";
import { settingActions } from "../../store/actions/commonActions/settingActions";
import ReactHowler from 'react-howler'
import { bloodAppId } from '../../helpers/config';
import { getTokenErrorAlert } from "../blood_land/alertPopup";
import { landActions } from "../../store/actions/landActions/landActions";
import { shopsActions } from "../../store/actions/gameActions/shopsActions";
import BloodLand from "./BloodLand";

const SoundHowlerComponent = memo((props) => {
    const {setting:{bgMusic}, sound } = props;
    return (
        <Fragment>
            {!bgMusic ? null : bgMusic.turnOn && <ReactHowler
                src={sound}
                playing={true}
                volume={bgMusic.volume / 100}
            />}
        </Fragment>
    )
});


function WrapperCompomnent(props) {
    useEffect(() => {
        props.getDefault();
        props.getSetting(props.user._id);
    }, [])
    return (
        <Fragment>
            {/*{<MultipleMap checkDisplay={checkDisplay}/>}*/}
            <BloodLand/>
            {props.settingReducer && <SoundHowlerComponent
                setting={props.settingReducer}
                sound={`${process.env.PUBLIC_URL}/sounds/bg3.mp3`}
                playing={true}
            />}
            { props.alert.tokenError && getTokenErrorAlert() }
            {/*{this.handleShowPopup()}*/}
        </Fragment>
    )
}

const mapStateToProps = (state) => {
    const {settingReducer, alert, lands, authentication: {user}} = state;
    return {
        settingReducer,
        lands,
        user,
        alert
    };
};

const mapDispatchToProps = (dispatch) => ({
    getSetting: (userId) => dispatch(settingActions.getSetting({userId})),
    getDefault: () => dispatch(landActions.getDefault()),
    getAllLandMarkCategoryInMap: () => dispatch(landActions.getAllLandMarkCategoryInMap()),
    onHandleGetShop: () => dispatch(shopsActions.getShop()),
});

export default connect(mapStateToProps, mapDispatchToProps)(WrapperCompomnent);






