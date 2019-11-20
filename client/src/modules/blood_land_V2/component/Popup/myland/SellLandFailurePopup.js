import React from "react";
import {screenActions, TranslateLanguage} from "../../../../../helpers/importModule";
import MessageBoxNew from '../MessageBox';
import {useDispatch} from "react-redux";


function SellLandFailurePopup(props) {
    const dispatch = useDispatch();
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => dispatch(screenActions.removePopup({name: 'SellLandFailureAlert'}));
    const header = <TranslateLanguage direct={'alert.getSellLandFailureAlert.header'}/>
    const body = <TranslateLanguage direct={'alert.getSellLandFailureAlert.body'}/>
    return <MessageBoxNew modal={true} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
}
export default SellLandFailurePopup;