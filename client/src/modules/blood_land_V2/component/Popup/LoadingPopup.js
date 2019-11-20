import React from "react";
import MessageBoxNew from './MessageBox'
import {TranslateLanguage} from "../../../../helpers/importModule";

function LoadingPopup(props) {
    const sign = "loading"; //blood //success //error //delete //loading
    const header = <TranslateLanguage direct={'alert.loadingPopup.header'}/>;
    const body = <TranslateLanguage direct={'alert.loadingPopup.body'}/>;
    return <MessageBoxNew modal={true} sign={sign} header={header} body={body}/>;
}
export default LoadingPopup;