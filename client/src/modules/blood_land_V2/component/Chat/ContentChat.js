import React, {useState, useEffect, Fragment, useRef} from 'react'
import {loadingImage} from "../../../blood_land/components/general/System";
import {connect, useDispatch} from 'react-redux';
import {socketActions} from '../../../../store/actions/commonActions/socketActions';
import {chatActions} from '../../../../store/actions/commonActions/chatActions';
import {screenActions} from '../../../../store/actions/commonActions/screenActions';
import {translate} from "react-i18next";
import moment from 'moment';
import ContextMenuChat from "./ContextMenuChat";

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

const ContextChat = (props) =>{
    const dispatch = useDispatch();
    const [listMessChat, setListMessChat] = useState();
    const messagesEndRef = useRef();
    const [changeLocation, setChangeLocation] = useState();

    useEffect(()=> {
        // console.log('props.chats.currentRoomId', props.chats.currentRoomId);
        dispatch(chatActions.getMessagesByRoomId({ roomId: null, pageLoadMsg: props.chats.pageLoadMsg }));
    }, []);

    useEffect(()=> {
        const publicRoom = props.chats.rooms[null];
        if(publicRoom){
            const { id, messages } = publicRoom;
            setListMessChat(messages);
            document.getElementById("list-message-chat").scrollTop = document.getElementById("list-message-chat").scrollHeight;
        }
    }, [props.chats.rooms]);

    useEffect(()=> {

        document.getElementById("list-message-chat").scrollTop = document.getElementById("list-message-chat").scrollHeight;
        // if(listMessChat && listMessChat.length !==0) {
        //     document.getElementById("list-message-chat").scrollTop = document.getElementById("list-message-chat").scrollHeight;
        // }
    },[listMessChat]);

    const handleShowContentMenu = (e) => {
        setChangeLocation({clientX : e.clientX, clientY : e.clientY});
        props.addPopup({name : 'showContextMenu'});
    };
    
    //scroll list remove popup
    const handleScroll = (e) => {
        props.removePopup({name : 'showContextMenu'});
    };

    return (
        <Fragment>
            <div ref={messagesEndRef} onScroll={handleScroll} className={'content-Chat'} style={{width : `${props.widthChat - 28  + 'px'}`, height : `${props.heightChat - 125  + 'px'}`}} id={'list-message-chat'}>
                {listMessChat && listMessChat.map((message,ind) => {
                    return (
                        <div className={props.user._id === message.senderId ? 'myself' : 'other-people'}  key={ind} >
                            <div className='item-mess' onClick={e => props.user._id !== message.senderId && handleShowContentMenu(e)} >
                                <div className='item-name'>
                                    {message.senderName} ( {message.userId}xxx) : (time : { moment(message.createdAt).format('DD-MM-YYYY') } )
                                </div>
                                <div className='item-content'>
                                    {message.message}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
            {props.screens['showContextMenu'] && <ContextMenuChat listContext={listContext} changeLocation={changeLocation}/>}
        </Fragment>
    )
};


const mapStateToProps = (state) => {
    const { authentication: {user} , screens ,  settingReducer:{language}, sockets, chats} = state;
    return {
        user,
        screens,
        language,
        sockets,
        chats
    };
};
const mapDispatchToProps = (dispatch) => ({
    onSendMessage : (data) => dispatch(socketActions.userSendMessage(data)),
    addPopup : (screen) => dispatch(screenActions.addPopup(screen)),
    removePopup : (screen) => dispatch(screenActions.removePopup(screen))
})
export default connect (mapStateToProps, mapDispatchToProps)(translate('common')(ContextChat))
