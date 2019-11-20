import {useDispatch} from "react-redux";
import {screenActions} from "../../../../../store/actions/commonActions/screenActions";
import {TranslateLanguage} from "../../../../../helpers/importModule";
import MessageBoxNew from "../MessageBox";
import React from "react";

function SellLandPricePopup(props) {
    const dispatch = useDispatch();
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => dispatch( screenActions.removePopup( {name: 'SellLandPricePopup'} ) );
    const header = <TranslateLanguage direct={'alert.checkPriceAlertPopup.header'}/>;
    const body = <TranslateLanguage direct={'alert.checkPriceAlertPopup.body'}/>;
    return <MessageBoxNew modal={true} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
}

export default SellLandPricePopup;