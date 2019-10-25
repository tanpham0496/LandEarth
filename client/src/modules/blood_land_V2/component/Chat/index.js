import React, {useState, useEffect, Fragment, useRef} from 'react'
import {loadingImage} from "../../../blood_land/components/general/System";
import {connect, useDispatch} from 'react-redux';
import {socketActions} from '../../../../store/actions/commonActions/socketActions';
import {screenActions} from '../../../../store/actions/commonActions/screenActions';
import {onHandleTranslate} from "../../../../helpers/Common";
import {translate} from "react-i18next";
import ContentChat from './ContentChat';
import ListFriendActivity from './ListFriendActivity'

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
    const {user} = props;
    const dispatch = useDispatch();

    const [toggleChat, setToggleChat] = useState(false);
    const [activeIndexChat, setActiveIndexChat] = useState(0);
    const [zoomChat, setZoomChat] = useState(false);

    const [widthChat, setWidthChat] = useState(353);
    const [heightChat, setHeightChat]= useState(55);

    const [message, setMessage] = useState('');

    const onHandleToggleChat = (tab,ind) => {
        setActiveIndexChat(ind);
        setTimeout(()=> { setWidthChat(353);  setHeightChat(275); },0.01);
        setToggleChat(true);
    };

    const onHandleZoomChat = () => {
        setZoomChat(!zoomChat);
        setToggleChat(false);
        if(zoomChat) {setHeightChat(55); setWidthChat(353)}
        else  { setHeightChat(387); setWidthChat(510)}
    };

    const onHandleResizeChat = () => {
        setToggleChat(!toggleChat);
        setZoomChat(false);
        setTimeout(()=> {
            if(toggleChat){setHeightChat(55); setWidthChat(353)}
            else {setHeightChat(275);setWidthChat(353)}
        },0.01)
    };

    const onHandleMessage = (e) => {
        // const {t, language,lng } = props;
        //
        // const replace = message && message.split(onHandleTranslate(t, 'characterBad.one', language, lng)).join('xxx');
        // const data = {
        //     message: replace,
        //     userId: user._id,
        // };
        // props.onSendMessage(data); setMessage('')
        const replace = message && message.split('fuck').join('xxx')
        //  const data = {
        //      message: replace,
        //      userId: user._id,
        //  };
        // props.onSendMessage(data); setMessage('')

        console.log('SEND_MESSAGE', replace);
        dispatch({ type: 'SEND_MESSAGE', message: replace, roomId: null });
    };

    return (
        <Fragment>
            <div id={'container-chat'}  style={{width: `${widthChat + 'px'}` , height: `${heightChat + 'px'}`, top : `${(props.transferState + 25) + 'px'}` }}>
                <div id={'container-chat-drag '} >
                    <div className={`${zoomChat ? 'zoom active' : 'zoom' }`} onClick={onHandleZoomChat}>
                        <img  src={loadingImage('/images/bloodLandNew/func/Zoom.png')} />
                    </div>
                    <div className={`${toggleChat || zoomChat ? 'toggle-chat-active' : 'toggle-chat'}`} id={'container-chat-move'}  onClick={onHandleResizeChat}>
                        <img  src={loadingImage('/images/bloodLandNew/func/Toggle-map-chat.png')} />
                    </div>
                    <div className={`list-friend`}  onClick={()=>{/*onHandleResizeChat();*/ props.addPopup({name : 'ListFriendActivity'})}}>
                        <img className={'image-list-friend'}  src={loadingImage('/images/bloodLandNew/func/list-friend.png')} />
                    </div>
                    {ListChat.map((value,ind) => {
                        const {tab ,classname,imageUrl ,classImage,roomName} = value;
                        const classActive = activeIndexChat === ind ? 'active' : '';
                        return (
                            <div key={ind} className={`${classActive} ${classname}`} onClick={()=>onHandleToggleChat(tab,ind, roomName)}>
                                <img className={classImage}  src={loadingImage(`${imageUrl}`)} />
                            </div>
                        )
                    })}

                </div>
                {(toggleChat || zoomChat) &&
                <div className={'showMap'} >
                    <ContentChat widthChat={widthChat} heightChat={heightChat} />
                    <div className={'form-chat'} style={{width: `${widthChat - 28  + 'px'}`, height : '40px'}} >
                        <textarea className={'input-chat'}  id="m" value={message} onChange={(e)=> setMessage(e.target.value)}/>
                        <button className={'image-chat'} type ={'submit'} style={{ top : `${heightChat - 108 + 'px'}` }} onClick={onHandleMessage}>
                            <img className={'icon-chat'} src={loadingImage('/images/bloodLandNew/func/icon-submit-chat.png')} style={{left : ''}}/>
                        </button>
                    </div>
                </div>
                }
            </div>
            {props.screens['ListFriendActivity'] && <div className={'list-my-friend animate-flicker'} style={{ top : `${(props.transferState + 25) + 'px'}`, left : `${widthChat + 15 + 'px'}` }}>
                <div  className={'zoom-in'} onClick={()=> props.removePopup({name : 'ListFriendActivity'})}>
                    <img  className={'image-zoom-in'} src={loadingImage('/images/bloodLandNew/func/zoom-in.png')}/>
                </div>
                <div className={'add-friend'}>
                    <img  src={loadingImage('/images/bloodLandNew/func/add-friend.png')}/>
                </div>
                <ListFriendActivity />
            </div>}

        </Fragment>
    )
};
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
export default connect (mapStateToProps, mapDispatchToProps)(translate('common')(MenuChat))
