import React  from 'react';
import { connect, useDispatch } from 'react-redux';
import {screenActions} from "../../../../../../store/actions/commonActions/screenActions";
import MessageBoxNew from '../index';
import {userActions} from "../../../../../../store/actions/commonActions/userActions";
import TranslateLanguage from "../../../../../blood_land/components/general/TranslateComponent";

function RemoveFriendPopup(props) {
    const {param : {userId , friendList}} = props;
    const dispatch = useDispatch();

    const mode = "question"; //question //info //customize
    // const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => dispatch(screenActions.removePopup({name : 'BlockFriendPopup'}));

    const yesBtn = () => {
        dispatch( screenActions.removePopup( {name: 'RemoveFriendPopup'} ) );
        dispatch(userActions.unFriend({userId, friendList}));
        dispatch( screenActions.addPopup( {name: 'RemoveFriendSuccess'} ) );
    }
    const noBtn = () =>  dispatch(screenActions.removePopup({name : 'RemoveFriendPopup'}));
    const header = <TranslateLanguage direct={'menuTab.user.friend.friendList.alert.getDeleteConfirmAlertPopup.header'}/>;
    const body = <TranslateLanguage direct={'menuTab.user.friend.friendList.alert.getDeleteConfirmAlertPopup.body'}/>;
    return <MessageBoxNew modal={true} mode={mode} noBtn={noBtn} yesBtn={yesBtn} confirmBtn={confirmBtn} header={header} body={body}/>;
}

export default connect (
    state => {
        const { authentication: { user }, screens, map } = state;
        return { user, screens, map };
    },
    null
)(RemoveFriendPopup);