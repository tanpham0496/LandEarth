import React from 'react';
import {connect} from 'react-redux';
import {
    screenActions, mapGameAction,
    TranslateLanguage,
    MessageBox
} from "../../../../../../helpers/importModule";

function PlantTreeOnOtherUserLand(props) {
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => {
        props.removePopup({name: "PlantTreeOnOtherUserLand"});
        props.onHandleGetQuadKeyBitamin();
    };
    const header = <TranslateLanguage direct={'alert.getPlantingUnsuccessAlert.header'}/>
    const body = <TranslateLanguage direct={'alert.getPlantingUnsuccessAlert.body'}/>
    return <MessageBox modal={true} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body}/>;
}

export default connect(
    state => {
        const {authentication: {user}, screens, map} = state;
        return {user, screens, map};
    },
    dispatch => ({
        //addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
        removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
        onHandleGetQuadKeyBitamin: (quadKey) => dispatch(mapGameAction.onHandleGetQuadKeyBitamin(quadKey)),
    })
)(PlantTreeOnOtherUserLand);