import React, {useState, useEffect, Fragment, useRef} from 'react'
import {loadingImage} from "../../../blood_land/components/general/System";
import {connect, useDispatch, useSelector} from 'react-redux';
import {socketActions} from '../../../../store/actions/commonActions/socketActions';
import {screenActions} from '../../../../store/actions/commonActions/screenActions';
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


const MenuChat = (props) =>{
    const dispatch = useDispatch();

    const [toggleChat, setToggleChat] = useState(false);
    const [zoomChat, setZoomChat] = useState(false);

    const [widthChat, setWidthChat] = useState(353);
    const [heightChat, setHeightChat]= useState(55);

    const [message, setMessage] = useState('');
    const {screens} = useSelector(state=> state);
    const [tabOpen, setTabOpen] = useState('publish');

    useEffect(()=> {
        console.log('1312312')
        dispatch(screenActions.addPopup({name : `publish`}))
    }, []);

    const onHandleToggleChat = (tab,roomName) => {
        setTabOpen(roomName);
        dispatch(screenActions.addPopup({name : roomName , close: tabOpen }));
        setTimeout(()=> { setWidthChat(353);  setHeightChat(275); },0.01);
        setToggleChat(true);
        dispatch({ type: 'SET_CURRENT_ROOM', roomId: null, pageLoadMsg: 0 });
    };

    const onHandleZoomChat = (tab,roomName,ind,zoom) => {
        if(zoom === 'zoomOutDefault')  {
            setToggleChat(!toggleChat);
            setZoomChat(false);
            if(toggleChat){setHeightChat(55); setWidthChat(353)}
            else {setHeightChat(275);setWidthChat(353)}
        }
        if(zoom === 'zoomOutBig') {
            setZoomChat(!zoomChat);
            setToggleChat(false);
            if(zoomChat) {setHeightChat(55); setWidthChat(353)}
            else  { setHeightChat(387); setWidthChat(510)}
        }
    };


    const sendMessage = (e) => {
        const replace = message && message.split('fuck').join('xxx')
        //console.log('SEND_MESSAGE', replace);
        dispatch({ type: 'SEND_MESSAGE', message: replace, roomId: null });
        setMessage('');
    }

    const _handleKeyDown = e => {
        //console.log('_handleKeyDown');

        if (e.keyCode === 13/* && e.ctrlKey*/) {
            e.preventDefault();
            // console.log('sendMessage')
            sendMessage();
        }
    }

    const receiptState  =  (IdMyFriend) => {
        setZoomChat(false); setToggleChat(true); setHeightChat(275);setWidthChat(353)
    }

    return (
        <Fragment>
            <div id={'container-chat'}  style={{width: `${widthChat + 'px'}` , height: `${heightChat + 'px'}`, top : `${(props.transferState + 25) + 'px'}` }}>
                <div id={'container-chat-drag '} >

                    {ListChat.map((value,ind) => {
                        const {tab ,classname,imageUrl ,classImage,roomName } = value;
                        const classActive = screens[`${roomName}`] ? 'active' : '';
                        return (
                            <div key={ind}>
                                <div className={`${toggleChat || zoomChat ? 'toggle-chat-active' : 'toggle-chat'}`} id={'container-chat-move'}
                                     onClick={()=>onHandleZoomChat(tab,roomName,ind,'zoomOutDefault' )}>
                                    <img  src={loadingImage('/images/bloodLandNew/func/Toggle-map-chat.png')} />
                                </div>

                                <div className={`${zoomChat ? 'zoom active' : 'zoom' }`}
                                     onClick={()=>onHandleZoomChat(tab,roomName,ind,'zoomOutBig' )}>
                                    <img  src={loadingImage('/images/bloodLandNew/func/Zoom.png')} />
                                </div>

                                <div className={`list-friend`}  onClick={()=>{dispatch(screenActions.addPopup({name : `ListFriendActivity`}))}}>
                                    <img className={'image-list-friend'}  src={loadingImage('/images/bloodLandNew/func/list-friend.png')} />
                                </div>
                                <div className={`${classActive} ${classname}`} onClick={()=>onHandleToggleChat(tab,roomName)}>
                                    <img className={classImage}  src={loadingImage(`${imageUrl}`)} />
                                </div>
                             
                                {(toggleChat || zoomChat)&& screens[`${roomName}`] &&
                                    <div className={'showChat'} >
                                        <ContentChat widthChat={widthChat} heightChat={heightChat} />
                                        <div className={'form-chat'} style={{width: `${widthChat - 28  + 'px'}`, height : '40px'}} >
                                            <textarea className={'input-chat'}  id="m" value={message} onChange={(e)=> setMessage(e.target.value)} onKeyDown={_handleKeyDown}/>
                                            <button className={'image-chat'} type ={'submit'} style={{ top : `${heightChat - 108 + 'px'}` }} onClick={sendMessage}>
                                                <img className={'icon-chat'} src={loadingImage('/images/bloodLandNew/func/icon-submit-chat.png')} style={{left : ''}}/>
                                            </button>
                                        </div>
                                    </div>
                                }
                            </div>
                        )
                    })}

                </div>
            </div>
            {screens['ListFriendActivity'] && <div className={'list-my-friend animate-flicker'} style={{ top : `${(props.transferState + 25) + 'px'}`, left : `${widthChat + 15 + 'px'}` }}>
                <div  className={'zoom-in'} onClick={()=>dispatch(screenActions.removePopup({name : `ListFriendActivity`})) }>
                    <img  className={'image-zoom-in'} src={loadingImage('/images/bloodLandNew/func/zoom-in.png')}/>
                </div>
                <div className={'add-friend'}>
                    <img  src={loadingImage('/images/bloodLandNew/func/add-friend.png')}/>
                </div>
                <ListFriendActivity receiptState = {receiptState}  />
            </div>}


        </Fragment>
    )
};
// const mapStateToProps = (state) => {
//     const {  screens } = state;
//     return {
//
//         screens,
//
//     };
// };
// const mapDispatchToProps = (dispatch) => ({
//     onSendMessage: (data) => dispatch(socketActions.userSendMessage(data)),
//     addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
//     removePopup: (screen) => dispatch(screenActions.removePopup(screen))
// })
export default (translate('common')(MenuChat))
