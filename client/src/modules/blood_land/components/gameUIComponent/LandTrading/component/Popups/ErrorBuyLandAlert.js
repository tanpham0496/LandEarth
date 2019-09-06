import React  from 'react';
import { connect, useDispatch } from 'react-redux';
import {screenActions, TranslateLanguage, MessageBox} from "../../../../../../../helpers/importModule";

//validation alert
function ErrorBuyLandAlert(props) {
    const dispatch = useDispatch();

    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => dispatch(screenActions.removePopup({ name: "ErrorBuyLandAlert" }));
    const header = <TranslateLanguage direct={'menuTab.transaction.buyLand.alert.getErrorAlertPopup.header'}/>;
    const body = <TranslateLanguage direct={'menuTab.transaction.buyLand.alert.getErrorAlertPopup.body'}/>;
    return <MessageBox modal={true} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body}/>;
}

export default connect (
    state => {
        const { authentication: { user }, screens, map } = state;
        return { user, screens, map };
    },
    null
)(ErrorBuyLandAlert);