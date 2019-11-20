import React from "react";
import {MessageBoxNew, screenActions, TranslateLanguage} from "../../../../../../helpers/importModule";
import {useDispatch} from "react-redux";

function NoSelectedToRemove() {
    const dispatch = useDispatch();
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () =>dispatch(screenActions.removePopup({name : 'NoSelectedToRemove'}));
    const header = <TranslateLanguage direct={'alert.getNoSelectedLandToDeletePopup.header'}/>
    const body = <TranslateLanguage direct={'alert.getNoSelectedLandToDeletePopup.body'}/>
    return <MessageBoxNew modal={true} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
}
export default NoSelectedToRemove;