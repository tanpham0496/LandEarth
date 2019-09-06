import React from 'react';
import { connect } from 'react-redux';
import {screenActions, TranslateLanguage, MessageBox} from "../../../../../../../helpers/importModule";


function SendMailSuccessAlert(props) {
    const {removePopup , screens: {SendMailSuccessAlert: {handleCloseAllPopup}}} = props;
    const mode = "info"; //question //info //customize
    const sign = "success"; //blood //success //error //delete //loading
    const confirmBtn = () => {
        removePopup({name: 'SendMailSuccessAlert'});
        handleCloseAllPopup()
    };
    const header = <TranslateLanguage direct={'alert.getSuccessReplyAlertPopup.header'}/>
    const body = <TranslateLanguage direct={'alert.getSuccessReplyAlertPopup.body'}/>
    return <MessageBox modal={true} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
}

export default connect (
    state => {
        const { authentication: { user }, screens, map } = state;
        return { user, screens, map };
    },
    dispatch => ({
        //addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
        removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
    })
)(SendMailSuccessAlert);