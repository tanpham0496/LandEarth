//
// // import React, {useState, useEffect, Fragment, useRef} from 'react'
// // import {loadingImage} from "../../../blood_land/components/general/System";
// // import {connect} from 'react-redux';
// // import {socketActions} from '../../../../store/actions/commonActions/socketActions';
// // import {screenActions} from '../../../../store/actions/commonActions/screenActions';
// // import {onHandleTranslate} from "../../../../helpers/Common";
// // import {translate} from "react-i18next";
// // import useInfiniteScroll from "../../../blood_land/components/general/UseInfinityScroll";
// //
// // const ListChat = [
// //     {
// //         tab : '1',
// //         classname : 'earth',
// //         imageUrl : '/images/bloodLandNew/func/Earth.png' ,
// //         classImage: 'image-earth',
// //         roomName : 'publish'
// //     } ,
// //     {
// //         tab : '2',
// //         classname : 'chat-Func',
// //         imageUrl : '/images/bloodLandNew/func/Chat.png',
// //         classImage: 'image-func',
// //         roomName : 'private'
// //     }
// // ];
// // let list = [];
// // function getRndInteger(min, max) {
// //     return Math.floor(Math.random() * (max - min) ) + min;
// // }
// // for (let i = 1; i <= 100; i++) {
// //     let tmp = {"time": i, "name": "Tan", 'userId': getRndInteger(0,9999) ,'content' : 'Hôm nay giá tăng thêm 10% chị ạ, ok nhé!', 'classname': i%5===0 ? 'myself' : 'other-people'};
// //     list.push(tmp)
// // }
// // let listFriend = [];
// // for (let i=0; i <= 10000; i++) {
// //    let tmp = {'name' : 'Chị Loan', 'activity' : i%5===0 ? 'online' : 'offline' };
// //    listFriend.push(tmp);
// // }
// //
// // const ContentChat = (props) =>{
// //     const [listMessChat, setListMessChat] = useState();
// //     const messagesEndRef = useRef();
// //
// //     useEffect(()=> {
// //         setListMessChat(list);
// //         const objDiv = document.getElementById("list-message-chat");
// //         objDiv.scrollTop = objDiv.scrollHeight;
// //     });
// //
// //     return (
// //         <Fragment>
// //             <div ref={messagesEndRef} className={'content-Chat'} style={{width : `${props.widthChat - 28  + 'px'}`, height : `${props.heightChat - 125  + 'px'}`}} id={'list-message-chat'}>
// //                 {listMessChat && listMessChat.map((value,ind) => {
// //                     return (
// //                         <div className={value.classname}  key={ind}>
// //                             <div className='item-mess'>
// //                                 <div className='item-name'>
// //                                     {value.name} ( {value.userId}xxx) : (time : {value.time} )
// //                                 </div>
// //                                 <div className='item-content'>
// //                                     {value.content}
// //                                 </div>
// //                             </div>
// //                         </div>
// //                     )
// //                 })}
// //             </div>
// //         </Fragment>
// //     )
// // };
// //
// // const ListFriendActivity = (props) => {
// //     const [friendList, setFriendList] = useState();
// //     const fetchMoreListItems = () => {
// //         setTimeout(() => {
// //             setFriendList(prevState => ([...prevState, ...listFriend.slice(prevState.length, prevState.length + 30)]));
// //             setIsFetching(false);
// //         }, 500);
// //     };
// //     const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems, "list-contact-friend");
// //
// //     useEffect(() => {
// //         if (listFriend) {
// //             setFriendList(listFriend.slice(0, 30))
// //         }
// //     }, [listFriend]);
// //
// //     return (
// //          <Fragment>
// //              <div className={'list-contact-friend'} id={'list-contact-friend'}>
// //                  {friendList && friendList.map((value,ind)=> {
// //                      return(
// //                      <div key={ind} className={'row-list-friend'}>
// //                          <div className={'name'}>
// //                              {value.name}
// //                          </div>
// //                          <div className={`${value.activity}`}>
// //                              {value.activity}
// //                          </div>
// //                      </div>
// //                      )
// //                  })}
// //
// //              </div>
// //          </Fragment>
// //      )
// // }
// //
// // const MenuChat = (props) =>{
// //     const {user} = props;
// //
// //     const [toggleChat, setToggleChat] = useState(false);
// //     const [activeIndexChat, setActiveIndexChat] = useState(0);
// //     const [zoomChat, setZoomChat] = useState(false);
// //
// //     const [widthChat, setWidthChat] = useState(353);
// //     const [heightChat, setHeightChat]= useState(55);
// //
// //     const [message, setMessage] = useState('');
// //
// //     const onHandleToggleChat = (tab,ind) => {
// //         setActiveIndexChat(ind);
// //         setTimeout(()=> { setWidthChat(353);  setHeightChat(275); },0.01);
// //         setToggleChat(true);
// //     };
// //
// //     const onHandleZoomChat = () => {
// //         setZoomChat(!zoomChat);
// //         setToggleChat(false);
// //         if(zoomChat) {setHeightChat(55); setWidthChat(353)}
// //         else  { setHeightChat(387); setWidthChat(510)}
// //     };
// //
// //     const onHandleResizeChat = () => {
// //         setToggleChat(!toggleChat);
// //         setZoomChat(false);
// //         setTimeout(()=> {
// //             if(toggleChat){setHeightChat(55); setWidthChat(353)}
// //             else {setHeightChat(275);setWidthChat(353)}
// //         },0.01)
// //     };
// //
// //     const onHandleMessage = (e) => {
// //          const {t, language,lng } = props;
// //
// //          const replace = message && message.split(onHandleTranslate(t, 'characterBad.one', language, lng)).join('xxx');
// //          const data = {
// //              message: replace,
// //              userId: user._id,
// //          };
// //          props.onSendMessage(data); setMessage('')
// //     };
// //
// //     return (
// //         <Fragment>
// //             <div id={'container-chat'}  style={{width: `${widthChat + 'px'}` , height: `${heightChat + 'px'}`, top : `${(props.transferState + 25) + 'px'}` }}>
// //                 <div id={'container-chat-drag '} >
// //                     <div className={`${zoomChat ? 'zoom active' : 'zoom' }`} onClick={onHandleZoomChat}>
// //                         <img  src={loadingImage('/images/bloodLandNew/func/Zoom.png')} />
// //                     </div>
// //                     <div className={`${toggleChat || zoomChat ? 'toggle-chat-active' : 'toggle-chat'}`} id={'container-chat-move'}  onClick={onHandleResizeChat}>
// //                         <img  src={loadingImage('/images/bloodLandNew/func/Toggle-map-chat.png')} />
// //                     </div>
// //                     <div className={`list-friend`}  onClick={()=>{/*onHandleResizeChat();*/ props.addPopup({name : 'ListFriendActivity'})}}>
// //                         <img className={'image-list-friend'}  src={loadingImage('/images/bloodLandNew/func/list-friend.png')} />
// //                     </div>
// //                     {ListChat.map((value,ind) => {
// //                         const {tab ,classname,imageUrl ,classImage,roomName} = value;
// //                         const classActive = activeIndexChat === ind ? 'active' : '';
// //                         return (
// //                             <div key={ind} className={`${classActive} ${classname}`} onClick={()=>onHandleToggleChat(tab,ind, roomName)}>
// //                                 <img className={classImage}  src={loadingImage(`${imageUrl}`)} />
// //                             </div>
// //                         )
// //                     })}
// //
// //                 </div>
// //                 {(toggleChat || zoomChat) &&
// //                     <div className={'showMap'} >
// //                        <ContentChat widthChat={widthChat} heightChat={heightChat} />
// //                         <div className={'form-chat'} style={{width: `${widthChat - 28  + 'px'}`, height : '40px'}} >
// //                             <textarea className={'input-chat'}  id="m" value={message} onChange={(e)=> setMessage(e.target.value)}/>
// //                             <button className={'image-chat'} type ={'submit'} style={{ top : `${heightChat - 108 + 'px'}` }} onClick={onHandleMessage}>
// //                                 <img className={'icon-chat'} src={loadingImage('/images/bloodLandNew/func/icon-submit-chat.png')} style={{left : ''}}/>
// //                             </button>
// //                         </div>
// //                     </div>
// //                 }
// //             </div>
// //             {props.screens['ListFriendActivity'] && <div className={'list-my-friend animate-flicker'} style={{ top : `${(props.transferState + 25) + 'px'}`, left : `${widthChat + 15 + 'px'}` }}>
// //                 <div  className={'zoom-in'} onClick={()=> props.removePopup({name : 'ListFriendActivity'})}>
// //                     <img  className={'image-zoom-in'} src={loadingImage('/images/bloodLandNew/func/zoom-in.png')}/>
// //                 </div>
// //                 <div className={'add-friend'}>
// //                     <img  src={loadingImage('/images/bloodLandNew/func/add-friend.png')}/>
// //                 </div>
// //                  <ListFriendActivity />
// //             </div>}
// //
// //         </Fragment>
// //     )
// // };
// // const mapStateToProps = (state) => {
// //     const { authentication: {user} , screens ,  settingReducer:{language}} = state;
// //     return {
// //         user,
// //         screens,
// //         language
// //     };
// // };
// // const mapDispatchToProps = (dispatch) => ({
// //      onSendMessage : (data) => dispatch(socketActions.userSendMessage(data)),
// //      addPopup : (screen) => dispatch(screenActions.addPopup(screen)),
// //      removePopup : (screen) => dispatch(screenActions.removePopup(screen))
// // })
// // export default connect (mapStateToProps, mapDispatchToProps)(translate('common')(MenuChat))
// import React, {useState, useEffect, Fragment, useRef} from 'react'
// import {loadingImage} from "../../../blood_land/components/general/System";
// import {connect, useDispatch} from 'react-redux';
// import {socketActions} from '../../../../store/actions/commonActions/socketActions';
// // import useInfiniteScroll from "../../../blood_land/components/general/UseInfinityScroll";
// // import ContentChat from '../Chat/index'
//
// const ListChat = [
//     {
//         tab : '1',
//         classname : 'earth',
//         imageUrl : '/images/bloodLandNew/func/Earth.png' ,
//         classImage: 'image-earth',
//         roomName : 'publish'
//     } ,
//     {
//         tab : '2',
//         classname : 'chat-Func',
//         imageUrl : '/images/bloodLandNew/func/Chat.png',
//         classImage: 'image-func',
//         roomName : 'private'
//     }
// ];
// let list = [];
// function getRndInteger(min, max) {
//     return Math.floor(Math.random() * (max - min) ) + min;
// }
// for (let i = 1; i <= 100; i++) {
//     let tmp = {"time": i, "name": "Tan", 'userId': getRndInteger(0,9999) ,'content' : 'Hôm nay giá tăng thêm 10% chị ạ, ok nhé!', 'classname': i%2===0 ? 'myself' : 'other-people'};
//     list.push(tmp)
// }
//
// const ContentChat = (props) =>{
//     const [listMessChat, setListMessChat] = useState();
//     const messagesEndRef = useRef();
//
//     useEffect(()=> {
//         setListMessChat(list);
//         const objDiv = document.getElementById("list-message-chat");
//         objDiv.scrollTop = objDiv.scrollHeight;
//
//     })
//
//     return (
//         <Fragment>
//             <div ref={messagesEndRef} className={'content-Chat'} style={{width : `${props.widthChat - 28  + 'px'}`, height : `${props.heightChat - 125  + 'px'}`}} id={'list-message-chat'}>
//                 {listMessChat && listMessChat.map((value,ind) => {
//                     return (
//                         <div className={value.classname}  key={ind}>
//                             <div className='item-mess'>
//                                 <div className='item-name'>
//                                     {value.name} ( {value.userId}xxx) : (time : {value.time} )
//                                 </div>
//                                 <div className='item-content'>
//                                     {value.content}
//                                 </div>
//                             </div>
//                         </div>
//                     )
//                 })}
//             </div>
//         </Fragment>
//     )
// };
//
// const MenuChat = (props) =>{
//     const dispatch = useDispatch();
//     const {user} = props;
//
//     const [toggleChat, setToggleChat] = useState(false);
//     const [activeIndexChat, setActiveIndexChat] = useState(0);
//     const [zoomChat, setZoomChat] = useState(false);
//
//     const [widthChat, setWidthChat] = useState(353);
//     const [heightChat, setHeightChat]= useState(55);
//
//     const [message, setMessage] = useState('');
//
//     const onHandleToggleChat = (tab,ind) => {
//         setActiveIndexChat(ind);
//         setTimeout(()=> { setWidthChat(353);  setHeightChat(275); },0.01);
//         setToggleChat(true);
//     };
//
//     const onHandleZoomChat = () => {
//         setZoomChat(!zoomChat);
//         setToggleChat(false);
//         if(zoomChat) {setHeightChat(55); setWidthChat(353)}
//         else  { setHeightChat(387); setWidthChat(510)}
//     };
//
//     const onHandleResizeChat = () => {
//         setToggleChat(!toggleChat);
//         setZoomChat(false);
//         setTimeout(()=> {
//             if(toggleChat){setHeightChat(55); setWidthChat(353)}
//             else {setHeightChat(275);setWidthChat(353)}
//         },0.01)
//     };
//
//     const onHandleMessage = (e) => {
//              const replace = message && message.split('fuck').join('xxx')
//             //  const data = {
//             //      message: replace,
//             //      userId: user._id,
//             //  };
//             // props.onSendMessage(data); setMessage('')
//
//             console.log('SEND_MESSAGE', replace);
//             dispatch({ type: 'SEND_MESSAGE', message: replace, roomId: null });
//
//     }
//
//     return (
//         <Fragment>
//             <div id={'container-chat'}  style={{width: `${widthChat + 'px'}` , height: `${heightChat + 'px'}`, top : `${(props.transferState + 25) + 'px'}` }}>
//                 <div id={'container-chat-drag '} >
//                     <div className={`${zoomChat ? 'zoom active' : 'zoom' }`} onClick={onHandleZoomChat}>
//                         <img  src={loadingImage('/images/bloodLandNew/func/Zoom.png')} />
//                     </div>
//                     {ListChat.map((value,ind) => {
//                         const {tab ,classname,imageUrl ,classImage,roomName} = value;
//                         const classActive = activeIndexChat === ind ? 'active' : '';
//                         return (
//                             <div key={ind} className={`${classActive} ${classname}`} onClick={()=>onHandleToggleChat(tab,ind, roomName)}>
//                                 <img className={classImage}  src={loadingImage(`${imageUrl}`)} />
//                             </div>
//                         )
//                     })}
//                     <div className={`${toggleChat || zoomChat ? 'toggle-chat-active' : 'toggle-chat'}`} id={'container-chat-move'}  onClick={onHandleResizeChat}>
//                         <img  src={loadingImage('/images/bloodLandNew/func/Toggle-map-chat.png')} />
//                     </div>
//                 </div>
//                 {(toggleChat || zoomChat) &&
//                     <div className={'showMap'} >
//                        <ContentChat widthChat={widthChat} heightChat={heightChat} />
//                         <div className={'form-chat'} style={{width: `${widthChat - 28  + 'px'}`, height : '40px'}} >
//                             <textarea className={'input-chat'}  id="m" value={message} onChange={(e)=> setMessage(e.target.value)}/>
//                             <button className={'image-chat'} type ={'submit'} style={{ top : `${heightChat - 108 + 'px'}` }} onClick={onHandleMessage}>
//                                 <img className={'icon-chat'} src={loadingImage('/images/bloodLandNew/func/icon-submit-chat.png')} style={{left : ''}}/>
//                             </button>
//                         </div>
//                     </div>
//                 }
//             </div>
//
//         </Fragment>
//     )
// };
// const mapStateToProps = (state) => {
//     const {authentication : {user}} = state;
//     return {
//         user
//     }
// };
// const mapDispatchToProps = (dispatch) => ({
//      onSendMessage : (data) => dispatch(socketActions.userSendMessage(data))
// })
// export default connect (mapStateToProps, mapDispatchToProps)(MenuChat)
// >>>>>>> origin/Bloodv4
