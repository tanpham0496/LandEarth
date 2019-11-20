import React from "react";
import {useDispatch} from "react-redux";
import MessageBoxNew from '../../MessageBox'
import {screenActions, TranslateLanguage} from "../../../../../../helpers/importModule";

function FolderNotEmptyPopup(props) {
    const dispatch = useDispatch();
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () =>  dispatch(screenActions.removePopup({name : 'FolderNotEmptyPopup'}));
    const header = <TranslateLanguage direct={'alert.removeCategory.getFolderEmptySelectedAlertPopup.header'}/>;
    const body = <TranslateLanguage direct={'alert.removeCategory.getFolderEmptySelectedAlertPopup.body'}/>;
    return <MessageBoxNew modal={true} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body}/>;
}
export default FolderNotEmptyPopup;