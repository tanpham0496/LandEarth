import React from 'react';
import {connect, useDispatch, useSelector} from 'react-redux';
import {screenActions, TranslateLanguage} from "../../../../../../helpers/importModule";
import MessageBoxNew from '../../MessageBox'


function CreateNewCategorySuccess(props) {
    const dispatch = useDispatch();
    const mode = "info"; //question //info //customize
    const sign = "success"; //blood //success //error //delete //loading
    const confirmBtn = () => {
        dispatch( screenActions.removePopup( {name: 'CreateNewCategorySuccess'} ) );
    } ;
    const header = <TranslateLanguage direct={'alert.createNewFolderSuccess.header'}/>;
    const body = <TranslateLanguage direct={'alert.createNewFolderSuccess.body'}/>;
    return <MessageBoxNew modal={true} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
}

export default CreateNewCategorySuccess;
