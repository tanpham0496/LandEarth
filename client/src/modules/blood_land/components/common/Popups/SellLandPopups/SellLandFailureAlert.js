import React from 'react';
import { connect } from 'react-redux';
import {
    screenActions,
    MessageBox, TranslateLanguage
} from "../../../../../../helpers/importModule";

function SellLandFailureAlert(props) {
    const { removePopup } = props;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => {
        //handleHidePopup();
        removePopup({name: 'SellLandFailureAlert'});
    };
    const header = <TranslateLanguage direct={'alert.getSellLandFailureAlert.header'}/>
    const body = <TranslateLanguage direct={'alert.getSellLandFailureAlert.body'}/>
    return <MessageBox modal={true} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
}

export default connect (
    state => {
        const { authentication: { user }, screens, map } = state;
        return { user, screens, map };
    },
    dispatch => ({
        removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
    })
)(SellLandFailureAlert);