import React  from 'react';
import { connect, useDispatch } from 'react-redux';
import {screenActions, TranslateLanguage} from "../../../../../../helpers/importModule";
import MessageBoxNew from '../index';
import {userActions} from "../../../../../../store/actions/commonActions/userActions";

function UnBlockFriendPopup(props) {
    const {param : {userId , unblockFriends}} = props;
    console.log('props',props);
    const dispatch = useDispatch();

    const mode = "question"; //question //info //customize
    // const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => dispatch(screenActions.removePopup({name : 'UnBlockFriendPopup'}));

    const yesBtn = () => {
        dispatch( screenActions.removePopup( {name: 'UnBlockFriendPopup'} ) );
        dispatch(userActions.unBlockFriend({userId,unblockFriends}));
        dispatch( screenActions.addPopup( {name: 'UnBlockFriendSuccess'} ) );
    }
    const noBtn = () =>  dispatch(screenActions.removePopup({name : 'UnBlockFriendPopup'}));
    const header = <TranslateLanguage direct={'menuTab.shop.alert.getPurchaseUnSuccessAlertPopup.header'}/>;
    const body = <TranslateLanguage direct={'menuTab.user.friend.friendList.getListFriend.deleteUserUnselectedAlertContent'}/>;
    return <MessageBoxNew modal={true} mode={mode} noBtn={noBtn} yesBtn={yesBtn} confirmBtn={confirmBtn} header={header} body={body}/>;
}

export default UnBlockFriendPopup;