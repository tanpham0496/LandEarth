import React from 'react';
import {connect, useDispatch, useSelector} from 'react-redux';
import {screenActions, TranslateLanguage} from "../../../../../../helpers/importModule";
import MessageBoxNew from '../index'


function UnBlockFriendSuccess(props) {
    const dispatch = useDispatch();

    const mode = "info"; //question //info //customize
    const sign = "success"; //blood //success //error //delete //loading
    const confirmBtn = () => {
        dispatch( screenActions.removePopup( {name: 'UnBlockFriendSuccess'} ) );
    } ;
    const header = <TranslateLanguage direct={'menuTab.user.friend.friendList.alert.getDeleteConfirmAlertPopup.header'}/>;
    const body = <TranslateLanguage direct={'menuTab.user.friend.friendList.alert.getDeleteConfirmAlertPopup.body'}/>;
    return <MessageBoxNew modal={true} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
}

export default UnBlockFriendSuccess;