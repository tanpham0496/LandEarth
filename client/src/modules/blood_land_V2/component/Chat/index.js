import React, {useState, useEffect, Fragment, useRef} from 'react'
import {loadingImage} from "../../../blood_land/components/general/System";
import {useDispatch, useSelector} from 'react-redux';
import {socketActions} from '../../../../store/actions/commonActions/socketActions';
import {screenActions} from '../../../../store/actions/commonActions/screenActions';
import {chatActions} from '../../../../store/actions/commonActions/chatActions';
import {onHandleTranslate} from "../../../../helpers/Common";
import {translate} from "react-i18next";
import ContentChat from './ContentChat';
import ListFriendActivity from './ListFriendActivity';

const ListChat = [
    {
        tab : '1',
        classname : 'earth',
        imageUrl : '/images/bloodLandNew/func/Earth.png' ,
        classImage: 'image-earth',
        roomName : 'publish'
    } ,
    {
        tab : '2',
        classname : 'chat-Func',
        imageUrl : '/images/bloodLandNew/func/Chat.png',
        classImage: 'image-func',
        roomName : 'private'
    }
];

const SIZES = [
    { width: 353, height: 55 },
    { width: 353, height: 275 },
    { width: 510, height: 387 },
]

const MenuChat = (props) =>{
    const dispatch = useDispatch();
    const [CLOSE, SMALL, LARGE] = SIZES;

    const [toggleChat, setToggleChat] = useState(false);
    const [zoomChat, setZoomChat] = useState(false);

    const [size, setSize] = useState(CLOSE);

    const [message, setMessage] = useState('');
    const {screens} = useSelector(state => state);
    const [tabOpen, setTabOpen] = useState('');

    // useEffect(()=> {
    //     dispatch(screenActions.addPopup({name : `publish`}))
    // }, []);

    const openRoom = (name) => {
        setTabOpen(name);
        dispatch(screenActions.addPopup({ name }));
    }

    const closeRoom = (name) => {
        setTabOpen(name);
        dispatch(screenActions.addPopup({ close: name }));
    }

    const onHandleToggleChat = (tab,roomName) => {
        if(screens['showContextMenu'] )dispatch(screenActions.removePopup({name: 'showContextMenu'}));
        setTabOpen(roomName);
        dispatch(screenActions.addPopup({name : roomName , close: tabOpen }));
        setTimeout(() => setSize(SMALL), 0.01);
        setToggleChat(true);
        dispatch(chatActions.setCurrentRoom({roomId: null, pageLoadMsg: 0}));
    };

    const closeChat = () => {
        setSize(CLOSE);
        dispatch(screenActions.removePopup({name : `ListFriendActivity`}))
    }

    const onHandleZoomChat = (zoom) => {
        if(screens['ContextMenuChat']) dispatch(screenActions.removePopup({name : 'ContextMenuChat' }));
        if(zoom === 'zoomSmall')  {
            setToggleChat(!toggleChat);
            setZoomChat(false);
            if(toggleChat){
                closeChat();
            } else {
                setSize(SMALL);
            }
            setTabOpen('publish');
        } else if(zoom === 'zoomLarge') {
            setZoomChat(!zoomChat);
            setToggleChat(false);
            if(zoomChat){
                closeChat();
            } else {
                setSize(LARGE);
            }
            setTabOpen('publish');
        }
        dispatch(chatActions.setCurrentRoom({roomId: null, pageLoadMsg: 0}));
    };

    const sendMessage = (e) => {
        const replace = message && message.split('fuck').join('xxx');

        dispatch(socketActions.sendMessage({ message: replace, roomId: null }))
        setMessage('');
    }

    const _handleKeyDown = e => {
        if (e.keyCode === 13/* && e.ctrlKey*/) {
            e.preventDefault();
            // console.log('sendMessage')
            sendMessage();
        }
    };
    const receiptState  =  (IdMyFriend) => {

    }
    const onHandleOpenListFriend = () => {
        if(toggleChat || zoomChat) {
            dispatch(screenActions.addPopup({name : `ListFriendActivity`}))
        }
    }
    return (
        <Fragment>
            <div id={'container-chat'}  style={{width: `${size.width + 'px'}` , height: `${size.height + 'px'}`, top : `${(props.transferState + 25) + 'px'}` }}>
                <div id={'container-chat-drag '} >

                    <div className={`${toggleChat || zoomChat ? 'toggle-chat-active' : 'toggle-chat'}`} id={'container-chat-move'}
                         onClick={() => onHandleZoomChat('zoomSmall')}>
                        <img alt='toggle-map-chat' src={loadingImage('/images/bloodLandNew/func/Toggle-map-chat.png')} />
                    </div>

                    <div className={`${zoomChat ? 'zoom active' : 'zoom' }`}
                         onClick={() => onHandleZoomChat('zoomLarge')}>
                        <img alt='zoom' src={loadingImage('/images/bloodLandNew/func/Zoom.png')} />
                    </div>

                    {ListChat.map((value, ind) => {
                        const { tab, classname, imageUrl, classImage, roomName } = value;
                        const classActive = screens[`${roomName}`] ? 'active' : '';
                        return (
                            <div key={ind}>

                                <div className={`list-friend`}  onClick={onHandleOpenListFriend}>
                                    <img alt='list-friend' className={'image-list-friend'}  src={loadingImage('/images/bloodLandNew/func/list-friend.png')} />
                                </div>
                                <div className={`${classActive} ${classname}`} onClick={() => onHandleToggleChat(tab, roomName)}>
                                    <img alt='room' className={classImage}  src={loadingImage(`${imageUrl}`)} />
                                </div>
                             
                                {(toggleChat || zoomChat)&& screens[`${roomName}`] &&
                                    <div className={'showChat'} >
                                        <ContentChat widthChat={size.width} heightChat={size.height} />
                                        <div className={'form-chat'} style={{width: `${size.width - 28  + 'px'}`, height : '40px'}} >
                                            <textarea className={'input-chat'}  id="m" value={message} onChange={(e)=> setMessage(e.target.value)} onKeyDown={_handleKeyDown}/>
                                            <button className={'image-chat'} type ={'submit'} style={{ top : `${size.height - 108 + 'px'}` }} onClick={sendMessage}>
                                                <img alt='icon-submit-chat' className={'icon-chat'} src={loadingImage('/images/bloodLandNew/func/icon-submit-chat.png')} style={{left : ''}}/>
                                            </button>
                                        </div>
                                    </div>
                                }
                            </div>
                        )
                    })}

                </div>
            </div>
            {screens['ListFriendActivity'] && <div className={'list-my-friend animate-flicker'} style={{ top : `${(props.transferState + 25) + 'px'}`, left : `${size.width + 15 + 'px'}` }}>
                <div  className={'zoom-in'} onClick={()=>dispatch(screenActions.removePopup({name : `ListFriendActivity`})) }>
                    <img alt='zoom-in' className={'image-zoom-in'} src={loadingImage('/images/bloodLandNew/func/zoom-in.png')}/>
                </div>
                <div className={'add-friend'}>
                    <img alt='add-friend' src={loadingImage('/images/bloodLandNew/func/add-friend.png')}/>
                </div>
                <ListFriendActivity receiptState = {receiptState}  />
            </div>}


        </Fragment>
    )
};

export default (translate('common')(MenuChat))
