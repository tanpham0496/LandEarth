import React , {Fragment}from 'react';
import {useDispatch, useSelector} from 'react-redux'
import FriendListComponent from "./friendList";
import AddFriendComponent from "./addFriend";
import BlockFriendComponent from "./blockFriend";
// const FriendListMenu = [
//     {
//         name: 'addFriend',
//         imageUrl: loadingImage('/images/bloodLandNew/addFriend.png'),
//     }, {
//         name: 'friendList',
//         imageUrl: loadingImage('/images/bloodLandNew/friendList.png'),
//         imageUrlActive: loadingImage('/images/bloodLandNew/friendList/friendList.png'),
//     }, {
//         name: 'blockFriend',
//         imageUrl: loadingImage('/images/bloodLandNew/blockFriend.png'),
//         imageUrlActive: loadingImage('/images/bloodLandNew/blockFriendHover.png'),
//     }
// ];

const FriendComponent = () => {
    const dispatch = useDispatch();
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
