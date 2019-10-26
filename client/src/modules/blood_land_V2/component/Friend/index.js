import React , {Fragment}from 'react';
import {useDispatch, useSelector} from 'react-redux'
import FriendListComponent from "./friendList";
import AddFriendComponent from "./addFriend";
import BlockFriendComponent from "./blockFriend";


const FriendComponent = () => {
    const {screens} = useSelector(state => state);

    return(
        <Fragment>
            {screens['friendList'] && <FriendListComponent/>}
            {screens['addFriend'] && <AddFriendComponent/>}
            {screens['blockFriend'] && <BlockFriendComponent/>}
        </Fragment>
    )
};
export default FriendComponent
