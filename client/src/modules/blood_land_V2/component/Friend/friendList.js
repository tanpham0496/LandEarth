import React, {Fragment, useEffect, useState} from 'react';
import {loadingImage} from "../../../blood_land/components/general/System";
import {StyledCheckbox2} from "../../../../components/customStyled/Checkbox2_style";
import useInfiniteScroll from "../../../blood_land/components/general/UseInfinityScroll";
import _ from 'lodash';
import classNames from 'classnames';
import {screenActions} from "../../../../store/actions/commonActions/screenActions";
import {useDispatch, useSelector} from "react-redux";
import {userActions} from "../../../../store/actions/commonActions/userActions";
import BlockFriendPopup from '../Popup/MessageBox/BlockFriend/BlockFriendPopup'
import BlockFriendSuccess from '../Popup/MessageBox/BlockFriend/BloockFriendSuccess'
import RemoveFriendPopup from '../Popup/MessageBox/RemoveFriend/RemoveFriendPopup'
import RemoveFriendSuccess from '../Popup/MessageBox/RemoveFriend/RemoveFriendSuccess'
import SendMailPopup from '../Popup/MessageBox/SendMail/SendMailPopup'
import SendMailSuccess from "../Popup/MessageBox/SendMail/SendMailSuccess";
import {TranslateLanguage} from "../../../../helpers/importModule";

const FriendListButton = [
    {
        name:  <TranslateLanguage direct={'MenuTabLeft.myAccount.friendList.chatting'}/>,
        type: 'chat',
        imageUrl: loadingImage('/images/bloodLandNew/friend/chat.png'),
        tab: '1'
    }, {
        name: <TranslateLanguage direct={'MenuTabLeft.myAccount.friendList.letter'}/>,
        type: 'mail',
        imageUrl: loadingImage('/images/bloodLandNew/friend/mail.png'),
        tab: '2'
    }, {
        name:  <TranslateLanguage direct={'MenuTabLeft.myAccount.friendList.blockFriend'}/>,
        type: 'block',
        imageUrl: loadingImage('/images/bloodLandNew/friend/block.png') ,
        tab: '3'
    }, {
        name: <TranslateLanguage direct={'MenuTabLeft.myAccount.friendList.deleteFriend'}/>,
        type: 'remove',
        imageUrl: loadingImage('/images/bloodLandNew/friend/remove.png'),
        tab: '4'
    },
];
const FriendListComponent = () => {
    const dispatch = useDispatch();
    const {authentication : {user}, users : {friendList,addFriendList ,blockStatus},screens } = useSelector(state=> state);
    //get list friend
    useEffect(()=> {
       dispatch(userActions.getFriendList({userId : user._id}));
    },[]);

    const [friendListState, setFriendListState] = useState();
    const fetchMoreListItems = () => {
        if(friendList) {
            setTimeout(() => {
                setFriendListState(prevState => ([...prevState, ...friendList.slice(prevState.length, prevState.length + 30)]));
                setIsFetching(false);
            }, 500);
        }
    };
    const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems, "friend-list-container");

    useEffect(() => {
        if(user && blockStatus === true && friendList && friendList.length === 0 && addFriendList && addFriendList.length === 0){
            setFriendListState('');
        }
        if (friendList) {
            setFriendListState(friendList.slice(0, 30))
        }
    }, [friendList]);

    const onFriendSelected = (e, userId) => {
        let friendSelectedNew = [...friendListState];
        friendSelectedNew.map(fl=>
        {
             if(fl.friend.userId === userId) {
                 fl.checked = !fl.checked;
             }
             return fl;
         });
        setFriendListState(friendSelectedNew);
    };
    const onCheckAll = () => {
        const onCheckAll = friendList && [...friendList].filter(fl => fl.checked === true).length  ===  [...friendList].length;
        if(onCheckAll) {
            let  friendListCheckAll = [...friendList].map(fl => fl.checked = false);
            setFriendListState([...friendList],friendListCheckAll);
        }
        else{
            let  friendListCheckAll = [...friendList].map(fl => fl.checked = true);
            setFriendListState([...friendList],friendListCheckAll);
        }

    };
    const _onHandleFriendBtn = (type) => {
        const onCheckAmount =  [...friendListState].filter(fl => fl.checked === true);
        switch (type) {
            case 'chat' :
                break;
            case 'mail' :
                onCheckAmount.length !== 0 && dispatch(screenActions.addPopup({name : 'SendMailPopup', data : {userId : user._id,userName : user.userName ,sendAmountFriend : onCheckAmount} }));
                break;
            case 'block' :
                onCheckAmount.length !== 0 && dispatch(screenActions.addPopup({name : 'BlockFriendPopup', data : {userId : user._id ,blockFriend : onCheckAmount}  }));
                break;
            case 'remove' :
                onCheckAmount.length !== 0 && onCheckAmount.length !== 0 && dispatch(screenActions.addPopup({name : 'RemoveFriendPopup',data : {userId : user._id ,friendList : onCheckAmount}}));
                break;
            default :
                return ''
        }
    };

    //waiting accept friend
    const [friendWaiting, setFriendWaiting] = useState();
    
    const fetchMoreListItemsWaiting = () => {
        if(addFriendList) {
            setTimeout(() => {
                setFriendWaiting(prevState => ([...prevState, ...addFriendList.slice(prevState.length, prevState.length + 30)]));
                setIsFetchingWaitingFriend(false);
            }, 500);
        }
    };
    const [isFetchingWaitingFriend, setIsFetchingWaitingFriend] = useInfiniteScroll(fetchMoreListItemsWaiting, "friend-list-waiting-accept-container");

    useEffect(() => {
        if (addFriendList && Array.isArray(addFriendList)) {
            setFriendWaiting(addFriendList.slice(0, 30))
        }
    }, [addFriendList]);

    const _onHandleAddFriend = (userId,name) => {
        dispatch(userActions.addFriend({userId: user._id, friendList : [{'userId': userId, 'name': name}]}));
        friendWaiting.splice(friendWaiting.findIndex(ft=> ft.friend.userId === userId),1);
    };
    const _onHandleBlockfriend = (blockList) => {
        dispatch(userActions.blockFriend({userId: user._id, blockList}));
    }
    return (
        <Fragment>
            <div className='friend-header'>
                <div className='icon-header'>
                    <img  alt='friendList' src={loadingImage('/images/bloodLandNew/friend/friendList.png')}/>}
                </div>
                <div className='title-header'>
                    <TranslateLanguage direct={'MenuTabLeft.myAccount.friendList'}/>
                </div>
                <div className='button-header'>
                    <div className='button-return' onClick={() =>  dispatch(screenActions.removePopup({names: ['friendList'] }))}>
                        <div className='icon-button'/>
                    </div>
                </div>
            </div>
            <div className='friend-body'>
                { friendList && friendList.length !==0 && <Fragment>
                    <div className='friend-list-function-button-container'>
                        {FriendListButton.map((item, index) => {
                            return (
                                <div className='friend-list-button' key={index} onClick={()=>_onHandleFriendBtn(item.type)}>
                                    <img alt={item.type} src={item.imageUrl}/>
                                    <div className='button-name'>{item.name}</div>
                                </div>
                            )
                        })}
                    </div>
                    <div className='checkAll-container'>
                        <div className='checkAll-button'>
                            <StyledCheckbox2 value='checkAll' onChange={onCheckAll}
                                             checked={friendListState && friendListState.filter(fl=> fl.checked === true).length === friendListState.length }
                            />
                        </div>
                        <div className='checkAll-title'>
                            <TranslateLanguage direct={'MenuTabLeft.myAccount.friendList.selected'}/>
                        </div>
                        <div className='friend-selected'>
                            <div style={{color: '#12354F'}}>(</div>
                            {friendListState && friendListState.filter(fl=> fl.checked === true).length }
                            <div style={{color: '#12354F'}}>)</div>
                        </div>

                    </div>
                    <div className='line-container'/>
                    <div className= {`${friendListState && friendListState.length !== 0 ? 'friend-list-container' : 'none' }`} id='friend-list-container'>
                        {friendListState && friendListState.map(({checked, friend: { name, userId }}, index) => {
                            const itemEffectClass = classNames({
                                active: checked
                            });
                            return (
                                <div className='friend-list-item' key={index}>
                                    <div className='item-check-button'>
                                        <StyledCheckbox2 onChange={(e) => onFriendSelected(e , userId)} checked={/*friendSelected.some(fs => fs.checked) */ checked}/>
                                    </div>
                                    <div className='item-name'>
                                        {name}
                                    </div>
                                    <div className='item-effect'>
                                        <div className={itemEffectClass}/>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </Fragment> }
                {friendWaiting && friendWaiting.length !== 0 &&
                    <Fragment>
                        <div className='line-container'/>
                            <div className='header-accept-friend'>
                                <div className='title' >
                                친구요청 대기
                                </div>
                                <div className='friend-waiting-accept'>
                                <div style={{color: '#12354F'}}>(</div>
                                {friendWaiting && friendWaiting.length }
                                <div style={{color: '#12354F'}}>)</div>
                                </div>

                            </div>
                        <div className='line-container'/>
                        <div className='friend-list-container' id='friend-list-waiting-accept-container'>
                            {friendWaiting && friendWaiting.map(({checked, friend: { name, userId,createdDate }}, index) => {
                                return (
                                    <div className='friend-list-item' key={index}>
                                        <div className='item-check-button'>
                                        </div>
                                        <div className='item-name'>
                                            {name}
                                        </div>
                                        <div className={'accept-friend'} onClick={()=>_onHandleAddFriend(userId,name)}>
                                            <img alt={'icon-accept'} src={loadingImage('images/bloodlandNew/icon-accept.png')}/>
                                        </div>
                                        <div className={'block-friend'} onClick={() =>  dispatch(screenActions.addPopup({name : 'RemoveFriendPopup', data : {userId : user._id ,friendList :[{checked, friend: { name, userId,createdDate }}]  }  }))  } >
                                            <img alt={'icon-block'} src={loadingImage('images/bloodlandNew/icon-block.png')}/>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </Fragment>
                }
                {  friendList && friendList.length === 0 && addFriendList && addFriendList.length === 0 && <div className='friend-empty-container'>
                        <img alt={'empty'} src={loadingImage('images/bloodlandNew/error-icon.png')}/>
                            <TranslateLanguage direct={'MenuTabLeft.myAccount.friendList.noFriends'}/>
                    </div>
                }

            </div>


            {screens['BlockFriendPopup'] && <BlockFriendPopup  param={screens.BlockFriendPopup}/>}
            {screens['BlockFriendSuccess'] && <BlockFriendSuccess />}
            {screens['RemoveFriendPopup'] && <RemoveFriendPopup param={screens.RemoveFriendPopup}  />}
            {screens['RemoveFriendSuccess'] && <RemoveFriendSuccess />}
            {screens['SendMailPopup'] && <SendMailPopup param={screens.SendMailPopup} />}
            {screens['SendMailSuccess'] && <SendMailSuccess />}
        </Fragment>
    )
};
export default FriendListComponent
