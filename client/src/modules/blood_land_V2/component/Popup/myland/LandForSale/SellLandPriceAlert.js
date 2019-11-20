import React from "react";
import {useDispatch} from "react-redux";
import {MessageBoxNew, screenActions, TranslateLanguage} from "../../../../../../helpers/importModule";



function SellLandPriceAlert(props) {
    const dispatch = useDispatch();
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => dispatch(screenActions.removePopup({name: 'SellLandPriceAlert'}));
    const header = <TranslateLanguage direct={'alert.checkPriceAlertPopup.header'}/>;
    const body = <TranslateLanguage direct={'alert.checkPriceAlertPopup.body'}/>;
    return <MessageBoxNew modal={true} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
}

export default SellLandPriceAlert;