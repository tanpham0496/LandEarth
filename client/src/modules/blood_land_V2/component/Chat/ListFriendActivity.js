import React, {useState, useEffect, Fragment} from 'react'
import {loadingImage} from "../../../blood_land/components/general/System";
import {useSelector, useDispatch} from 'react-redux';
import {screenActions} from '../../../../store/actions/commonActions/screenActions';
import {translate} from "react-i18next";
import useInfiniteScroll from "../../../blood_land/components/general/UseInfinityScroll";
import ContextMenuChat from "./ContextMenuChat";
import {userActions} from "../../../../store/actions/commonActions/userActions";
import {TranslateLanguage} from "../../../../helpers/importModule";

const listContext = [
    {
        name : '채팅',
        tab : '1'
    },
    {
        name : '친구 차단',
        tab : '2'
    },
    {
        name : '편지 보냄',
        tab : '3'
    }
];

const ListFriendActivity = (props) => {
    const [friendListState, setFriendListState] = useState();
    const [changeLocation, setChangeLocation] = useState();
    const dispatch = useDispatch();
    const {authentication : {user}, users : {friendList,addFriendList ,blockStatus},screens ,settingReducer:{language}} = useSelector(state=> state);
    useEffect(()=> {
        dispatch(userActions.getFriendList({userId : user._id}));
    },[]);
    const fetchMoreListItems = () => {
        setTimeout(() => {
            setFriendListState(prevState => ([...prevState, ...friendList.slice(prevState.length, prevState.length + 30)]));
            setIsFetching(false);
        }, 500);
    };

    const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems, "list-contact-friend");

    useEffect(() => {
        if (friendList && Array.isArray(friendList))  setFriendListState(friendList.slice(0, 30));
    }, [friendList]);

    const handleChatWithMyFriend = (IdMyFriend, e) => {
        setChangeLocation({clientX : e.clientX, clientY : e.clientY});
        props.receiptState(IdMyFriend);
        dispatch(screenActions.addPopup({name: 'ContextMenuChat'}))
    };
    //scroll list remove popup
    const handleScroll = () => {
        dispatch(screenActions.addPopup({name: 'ContextMenuChat'}))

    };

    return (
        <Fragment>
            <div  className={'zoom-in'} onClick={()=> dispatch(screenActions.removePopup({names : ['ListFriendActivity','ContextMenuChat']}))}>
                <img  className={'image-zoom-in'} src={loadingImage('/images/bloodLandNew/func/zoom-in.png')}/>
            </div>
            <div className={'add-friend'} /* onClick={ handleAddFriend} */>
                <img  src={loadingImage('/images/bloodLandNew/func/add-friend.png')}/>
            </div>
            <div className={'list-contact-friend'} id={'list-contact-friend'} onScroll={handleScroll}>
                { (friendList && friendList.length === 0) || (!friendList && typeof friendList === 'undefined') ? <div className='list-contact-friend-empty'>
                    <img alt={'empty'} src={loadingImage('images/bloodlandNew/error-icon.png')}/>
                    <TranslateLanguage direct={'MenuTabLeft.myAccount.friendList.noFriends'}/>
                </div> :
                <Fragment>
                    {friendListState && friendListState.map((value,ind)=> {
                        const {checked, friend : {name , userId}} = value;
                        return(
                            <div key={ind} className={'row-list-friend'} onClick={(e)=>handleChatWithMyFriend(userId,e)} >
                                <div className={'name'}>
                                    {name}
                                </div>
                                <div className={'online'}>
                                    online
                                </div>
                            </div>
                        )
                    })}

                </Fragment>
                }

            </div>
            {screens['ContextMenuChat'] && <ContextMenuChat listContext={listContext} changeLocation={changeLocation}/>}
        </Fragment>
    )
};
export default (translate('common')(ListFriendActivity));
