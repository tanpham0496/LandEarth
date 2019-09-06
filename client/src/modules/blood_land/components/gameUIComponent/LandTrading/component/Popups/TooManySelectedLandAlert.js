import React from 'react';
import { connect, useDispatch } from 'react-redux';
import {screenActions, TranslateLanguage, MessageBox} from "../../../../../../../helpers/importModule";

function TooManySelectedLandAlert(props) {
    const dispatch = useDispatch();
    // const [state] = useReducer(state => {
    //     const { authentication: { user }, screens, map } = state;
    //     return { user, screens, map };
    // }, null);
    console.log('state');

    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => dispatch(screenActions.removePopup({ name: "TooManySelectedLandAlert" }))
    const header = <TranslateLanguage direct={'menuTab.transaction.buyLand.alert.getTooManyLandAlertPopup.header'}/>;
    const body = <TranslateLanguage direct={'menuTab.transaction.buyLand.alert.getTooManyLandAlertPopup.body'}/>;
    return <MessageBox modal={true} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body}/>;
}

export default connect (
    state => {
        const { authentication: { user }, screens, map } = state;
        return { user, screens, map };
    },
    null
)(TooManySelectedLandAlert);