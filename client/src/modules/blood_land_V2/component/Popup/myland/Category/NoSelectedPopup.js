import React from "react";
import {useDispatch} from "react-redux";
import MessageBoxNew from '../../MessageBox'
import {screenActions, TranslateLanguage} from "../../../../../../helpers/importModule";

function NoSelectedPopup(props) {
    const dispatch = useDispatch();
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () =>  dispatch(screenActions.removePopup({name : 'NoSelectedPopup'}));
    const header = <TranslateLanguage direct={'menuTab.myLand.landOwned.tree.notice'}/>;
    const body = <TranslateLanguage direct={'menuTab.myLand.landOwned.tree.selectLand'}/>;
    return <MessageBoxNew modal={true} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body}/>;
}
export default NoSelectedPopup;