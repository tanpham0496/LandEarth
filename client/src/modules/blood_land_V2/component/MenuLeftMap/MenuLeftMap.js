// import React, {useState, useEffect, Fragment} from 'react'
// import {loadingImage} from "../../../blood_land/components/general/System";
// import DragElementChat from '../common/dragElementChat'
// import { Resizable } from 'react-resizable';
// const MenuListLeftMap = [
//     {
//         name : '1',
//         imageUrl : '/images/bloodLandNew/func/Individual-Select.png'
//     },
//     {
//         name : '2',
//         imageUrl : '/images/bloodLandNew/func/Area-select.png'
//     },
//     {
//         name : '3',
//         imageUrl : '/images/bloodLandNew/func/Clear-Select.png'
//     },
//     {
//         name : '4',
//         imageUrl : '/images/bloodLandNew/func/Notify.png'
//     },
//     {
//         name : '5',
//         imageUrl : '/images/bloodLandNew/func/Price-Land.png'
//     },
//     {
//         name : '6',
//         imageUrl : '/images/bloodLandNew/func/Advertisement.png'
//     },
//     {
//         name : '7',
//         imageUrl : '/images/bloodLandNew/func/Shopping-mall.png'
//     },
//
// ];
// const ListMap = [
//     {
//         tab : '1',
//         classname : ' map map-1',
//         state: 'toggleMap1',
//         setState: 'setToggleMap1',
//         name: 'MAP 1'
//     },
//     {
//         tab : '2',
//         classname : ' map map-2',
//         state: 'toggleMap2',
//         setState: 'setToggleMap2',
//         name: 'MAP 2'
//     } ,
//     {
//         tab : '3',
//         classname : ' map map-3',
//         state: 'toggleMap3',
//         setState: 'setToggleMap3',
//         name: 'MAP 3'
//     }
// ];
// const ListChat = [
//     {
//         tab : '1',
//         classname : 'earth',
//         imageUrl : '/images/bloodLandNew/func/Earth.png' ,
//         classImage: 'image-earth'
//     } ,
//     {
//         tab : '2',
//         classname : 'chat-Func',
//         imageUrl : '/images/bloodLandNew/func/Chat.png',
//         classImage: 'image-func'
//     }
// ]
// const MenuLeftComponent = () => {
//     const [toggleMap1, setToggleMap1] = useState(false);
//     const [toggleMap2, setToggleMap2] = useState(false);
//     const [toggleMap3, setToggleMap3] = useState(false);
//     const [toggleMap, setToggleMap] = useState(false);
//     const [toggleChat, setToggleChat] = useState(false);
//     const [activeIndexMap, setActiveIndexMap] = useState(0);
//     const [activeIndexChat, setActiveIndexChat] = useState(0);
//
//     //State width height Map
//     const [widthMap, setWidthMap] = useState(300);
//     const [heightMap, setHeightMap]= useState(55);
//     //state width height Chat
//     const [widthChat, setWidthChat] = useState(300);
//     const [heightChat, setHeightChat]= useState(55);
//     const elmnt = document.getElementById('container-chat');
//
//     useEffect(()=>{
//         if(elmnt != null){
//             DragElementChat(elmnt);
//         }
//     }, [elmnt]);
//     const onResizeMap = (event, { size}) => {
//         if(( size.width <= 510) && (size.height <= 320)) {
//             if(( size.width > 300) && (size.height > 55)) {
//                 setHeightMap(size.height);
//                 setWidthMap(size.width);
//                 setToggleMap(true);
//             }
//             else{
//                 setHeightMap(55);
//                 setWidthMap(300);
//                 setToggleMap(false);
//             }
//         }
//     };
//
//     const onResizeChat = (event, { size}) => {
//         if(( size.width <= 510) && (size.height <= 320)) {
//             if(( size.width > 300) && (size.height > 55)) {
//                 setHeightChat(size.height);
//                 setWidthChat(size.width);
//                 setToggleChat(true);
//             }
//             else{
//                 setHeightChat(55);
//                 setWidthChat(300);
//                 setToggleChat(false);
//             }
//         }
//     };
//
//     const onHandleToggleMap = (state,tab,ind) => {
//         setActiveIndexMap(ind);
//         setTimeout(()=> { setWidthMap(300);  setHeightMap(215); },0.01);
//         setToggleMap(true);
//         if(tab === '1'){
//             setToggleMap1(true);
//             setToggleMap2(false);
//             setToggleMap3(false);
//         }
//         else if (tab==='2') {
//             setToggleMap1(false);
//             setToggleMap2(true);
//             setToggleMap3(false);
//         }
//         else {
//             setToggleMap1(false);
//             setToggleMap2(false);
//             setToggleMap3(true);
//         }
//     };
//     const onHandleToggleChat = (tab,ind) => {
//         setActiveIndexChat(ind);
//     }
//     const onHandleResizeMap = () => {
//         setToggleMap(!toggleMap);
//         setTimeout(()=> {
//             if(toggleMap){setHeightMap(55); setWidthMap(300)}
//             else  setHeightMap(215);
//         },0.01)
//     };
//     const onHandleResizeChat = () => {
//         setToggleChat(!toggleChat);
//         setTimeout(()=> {
//             if(toggleChat){setHeightChat(55); setWidthChat(300)}
//             else  setHeightChat(215);
//         },0.01)
//     };
//     return (
//        <Fragment>
//            <div className="columns is-desktop">
//                <div className={'column-left'}>
//                    <div className="form-search">
//                        <div className={'line-height'}> </div>
//                        <img className={'image-search'}  src={loadingImage('/images/bloodLandNew/func/search.png')}/>
//                        <input className="form-control" type="text" placeholder="" aria-label="Search" />
//                        <div className={'line-height-2'}>  </div>
//                    </div>
//                    <div className={'menu-icon-container-left'}>
//                        {MenuListLeftMap.map((value,idx) => {
//                            const {name, imageUrl} = value;
//                            return (
//                                <div className={'icon-child-left'} key={idx}>
//                                    <img alt={name} src={loadingImage(`${imageUrl}`)}/>
//                                </div>
//                            )
//                        })}
//                    </div>
//
//                    <div className={'map-chat'}>
//                        <Resizable className="box" height={heightMap} width={widthMap} onResize={onResizeMap} resizeHandles={['se' /* , 'e' , 's' ,'sw','nw', 'ne', 'w',  'n' */]}>
//                            <div className={`${toggleMap ? 'container-child-map-show' : 'container-child-map' }`} style={{width: `${widthMap + 'px'}` , height: `${heightMap + 'px'}` }}>
//                                <div className={`${toggleMap ? 'toggle-map-active' : 'toggle-map'}`} onClick={onHandleResizeMap}>
//                                    <img src={loadingImage('/images/bloodLandNew/func/Toggle-map-chat.png')} />
//                                </div>
//                                {ListMap.map((value,ind) => {
//                                    const {tab, classname, state,name} = value;
//                                    const classActive = activeIndexMap === ind ? 'active' : '';
//                                    return(
//                                        <div key={ind} className={`${classActive} ${classname}`} onClick={()=>onHandleToggleMap(state,tab,ind)}>
//                                            {name}
//                                        </div>
//                                    )
//                                })}
//                                {toggleMap && <div className={'showMap'}>
//                                    content
//                                </div>}
//                            </div>
//                        </Resizable>
//                        <Resizable height={heightChat} width={widthChat} onResize={onResizeChat} resizeHandles={[ 'se' ]}>
//                            <div id={'container-chat'}  style={{width: `${widthChat + 'px'}` , height: `${heightChat + 'px'}`, top : `${(heightMap + 25) + 'px'}` }}>
//                                <div id={'container-chat-drag '} >
//                                    <div className={`${toggleChat ? 'toggle-chat-active' : 'toggle-chat'}`} id={'container-chat-move'}  onClick={onHandleResizeChat}>
//                                        <img  src={loadingImage('/images/bloodLandNew/func/Toggle-map-chat.png')} />
//                                    </div>
//                                    <div className={'zoom'}>
//                                        <img  src={loadingImage('/images/bloodLandNew/func/Zoom.png')} />
//                                    </div>
//                                    {ListChat.map((value,ind) => {
//                                        const {tab ,classname,imageUrl ,classImage } = value;
//                                        const classActive = activeIndexChat === ind ? 'active' : '';
//                                        return (
//                                            <div key={ind} className={`${classActive} ${classname}`} onClick={()=>onHandleToggleChat(tab,ind)}>
//                                                <img className={classImage}  src={loadingImage(`${imageUrl}`)} />
//                                            </div>
//                                        )
//                                    })}
//                                    <div className={'zoom'}>
//                                        <img  src={loadingImage('/images/bloodLandNew/func/Zoom.png')} />
//                                    </div>
//                                </div>
//                                {toggleChat && <div className={'showMap'}>
//                                    Chat
//                                </div>}
//                            </div>
//
//                        </Resizable>
//                    </div>
//                </div>
//            </div>
//        </Fragment>
//     )
// };
// export default MenuLeftComponent
