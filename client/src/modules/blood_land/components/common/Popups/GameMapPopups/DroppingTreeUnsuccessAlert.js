import React from 'react';
import { connect } from 'react-redux';
import {
    screenActions, inventoryActions, mapGameAction,
    TranslateLanguage,
    MessageBox
} from "../../../../../../helpers/importModule";

function DroppingTreeUnsuccessAlert(props) {
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => {
        props.onHandleGetQuadKeyBitamin();
        props.removePopup({ name: "DroppingTreeUnsuccessAlert" });
        if(props.user && props.user._id) props.getCharacterInventoryByUserId({ userId: props.user._id });
    };
    const header = <TranslateLanguage direct={'alert.getDroppingTreeUnsuccessAlert.header'}/>
    const body = <TranslateLanguage direct={'alert.getDroppingTreeUnsuccessAlert.body'}/>
    return <MessageBox modal={true} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body}/>;
}

export default connect (
    state => {
        const { authentication: { user }, screens } = state;
        return { user, screens };
    },
    dispatch => ({
        //addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
        removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
        getCharacterInventoryByUserId: (param) => dispatch(inventoryActions.getCharacterInventoryByUserId(param)),
        onHandleGetQuadKeyBitamin: (quadKey) => dispatch(mapGameAction.onHandleGetQuadKeyBitamin(quadKey)),
    })
)(DroppingTreeUnsuccessAlert);


