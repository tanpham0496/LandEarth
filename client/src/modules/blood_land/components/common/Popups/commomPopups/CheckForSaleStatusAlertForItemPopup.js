import React from 'react';
import { connect } from 'react-redux';
import {
     screenActions,
    TranslateLanguage,
    MessageBox
} from "../../../../../../helpers/importModule";


function CheckForSaleStatusAlertForItemPopup(props) {
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => {

        props.removePopup({ name: "CheckForSaleStatusAlertForItemPopup" });
    };
    const header = <TranslateLanguage direct={'alert.checkForSaleStatusAlertForItemPopup.header'}/>;
    const body = <TranslateLanguage direct={'alert.checkForSaleStatusAlertForItemPopup.body'}/>;
    return <MessageBox modal={true} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body}/>;
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
)(CheckForSaleStatusAlertForItemPopup);