import React, {useState, useEffect, Fragment, useRef} from 'react'
import {loadingImage} from "../../../blood_land/components/general/System";
import {connect} from 'react-redux';
import {socketActions} from '../../../../store/actions/commonActions/socketActions';
import {screenActions} from '../../../../store/actions/commonActions/screenActions';
import {translate} from "react-i18next";
import useInfiniteScroll from "../../../blood_land/components/general/UseInfinityScroll";
import ContextMenuChat from "./ContextMenuChat";

let listFriend = [];
for (let i=0; i <= 10000; i++) {
    let tmp = {'name' : 'Chị Loan', 'activity' : i%5===0 ? 'online' : 'offline', 'IdMyFriend' : '123' };
    listFriend.push(tmp);
}

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
]

const ListFriendActivity = (props) => {
    const [friendList, setFriendList] = useState();
    const [changeLocation, setChangeLocation] = useState();

    const fetchMoreListItems = () => {
        setTimeout(() => {
            setFriendList(prevState => ([...prevState, ...listFriend.slice(prevState.length, prevState.length + 30)]));
            setIsFetching(false);
        }, 500);
    };

    const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems, "list-contact-friend");

    useEffect(() => {
        if (listFriend) {
            setFriendList(listFriend.slice(0, 30))
        }
    }, [listFriend]);

    const handleChatWithMyFriend = (IdMyFriend, e) => {
        setChangeLocation({clientX : e.clientX, clientY : e.clientY})
        props.receiptState(IdMyFriend);
        props.addPopup({name: 'ContextMenuChat'})
    };

    const handleAddFriend = () => {
        props.addPopup({name : 'myAccount'});
        setTimeout(()=> {
            props.addPopup({name : 'addFriend'})
        },200)
    };
    
    //scroll list remove popup
    const handleScroll = () => {
        props.removePopup({name : 'ContextMenuChat'})
    };

    return (
        <Fragment>
            <div  className={'zoom-in'} onClick={()=> props.removePopup({names : ['ListFriendActivity','ContextMenuChat']})}>
                <img  className={'image-zoom-in'} src={loadingImage('/images/bloodLandNew/func/zoom-in.png')}/>
            </div>
            <div className={'add-friend'} onClick={ handleAddFriend}>
                <img  src={loadingImage('/images/bloodLandNew/func/add-friend.png')}/>
            </div>
            <div className={'list-contact-friend'} id={'list-contact-friend'} onScroll={handleScroll}>
                {friendList && friendList.map((value,ind)=> {
                    const {IdMyFriend, name , activity} = value;
                    return(
                        <div key={ind} className={'row-list-friend'} onClick={(e)=>handleChatWithMyFriend(IdMyFriend,e)} >
                            <div className={'name'}>
                                {name}
                            </div>
                            <div className={`${activity}`}>
                                {activity}
                            </div>
                        </div>
                    )
                })}

            </div>
            {props.screens['ContextMenuChat'] && <ContextMenuChat listContext={listContext} changeLocation={changeLocation}/>}
        </Fragment>
    )
}

const mapStateToProps = (state) => {
    const { authentication: {user} , screens ,  settingReducer:{language}} = state;
    return {
        user,
        screens,
        language
    };
};
const mapDispatchToProps = (dispatch) => ({
    onSendMessage : (data) => dispatch(socketActions.userSendMessage(data)),
    addPopup : (screen) => dispatch(screenActions.addPopup(screen)),
    removePopup : (screen) => dispatch(screenActions.removePopup(screen))
})
export default connect (mapStateToProps, mapDispatchToProps)(translate('common')(ListFriendActivity))
