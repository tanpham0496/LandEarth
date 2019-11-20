import React  from 'react';
import { connect, useDispatch } from 'react-redux';
import {screenActions} from "../../../../../../store/actions/commonActions/screenActions";
import MessageBoxNew from '../index';
import {userActions} from "../../../../../../store/actions/commonActions/userActions";
import TranslateLanguage from "../../../../../blood_land/components/general/TranslateComponent";

function BlockFriendPopup(props) {
    const {param : {blockFriend, userId }} = props;
    console.log('{blockFriend, userId }',{blockFriend, userId });
    const dispatch = useDispatch();

    const mode = "question"; //question //info //customize
    // const sign = "error"; //blood //success //error //delete //loading

    const yesBtn = () => {
        dispatch( screenActions.removePopup( {name: 'BlockFriendPopup'} ) );
        dispatch(userActions.blockFriend({userId: userId, blockList : blockFriend}));
        dispatch( screenActions.addPopup( {name: 'BlockFriendSuccess'} ) );
    };
    const noBtn = () =>  dispatch(screenActions.removePopup({name : 'BlockFriendPopup'}));
    const header = <TranslateLanguage direct={'menuTab.user.friend.friendList.alert.getBlockConfirmAlertPopup.header'}/>;
    const body = <TranslateLanguage direct={'menuTab.user.friend.friendList.alert.getBlockConfirmAlertPopup.body'}/>;
    return <MessageBoxNew modal={true} mode={mode} noBtn={noBtn} yesBtn={yesBtn} header={header} body={body}/>;
}

export default connect (
    state => {
        const { authentication: { user }, screens, map } = state;
        return { user, screens, map };
    },
    null
)(BlockFriendPopup);