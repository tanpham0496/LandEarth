import React from "react";
import {useDispatch} from "react-redux";
import MessageBoxNew from '../../MessageBox'
import {screenActions, TranslateLanguage} from "../../../../../../helpers/importModule";

function NoCategorySelectedPopup(props) {
    const dispatch = useDispatch();
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () =>  dispatch(screenActions.removePopup({name : 'NoCategorySelectedPopup'}));
    const header = <TranslateLanguage direct={'menuTab.myLand.landOwned.recycle.selectFolder.header'}/>;
    const body = <TranslateLanguage direct={'menuTab.myLand.landOwned.recycle.selectFolder.body'}/>;
    return <MessageBoxNew modal={true} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body}/>;
}
export default NoCategorySelectedPopup;