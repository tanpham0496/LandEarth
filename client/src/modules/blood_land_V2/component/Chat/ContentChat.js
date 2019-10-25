import React, {useState, useEffect, Fragment, useRef} from 'react'
import {loadingImage} from "../../../blood_land/components/general/System";
import {connect} from 'react-redux';
import {socketActions} from '../../../../store/actions/commonActions/socketActions';
import {screenActions} from '../../../../store/actions/commonActions/screenActions';
import {translate} from "react-i18next";

let list = [];
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}
for (let i = 1; i <= 100; i++) {
    let tmp = {"time": i, "name": "Tan", 'userId': getRndInteger(0,9999) ,'content' : 'Hôm nay giá tăng thêm 10% chị ạ, ok nhé!', 'classname': i%5===0 ? 'myself' : 'other-people'};
    list.push(tmp)
}


const ContentChat = (props) =>{
    const [listMessChat, setListMessChat] = useState();
    const messagesEndRef = useRef();

    useEffect(()=> {
        setListMessChat(list);
        const objDiv = document.getElementById("list-message-chat");
        objDiv.scrollTop = objDiv.scrollHeight;
    });

    return (
        <Fragment>
            <div ref={messagesEndRef} className={'content-Chat'} style={{width : `${props.widthChat - 28  + 'px'}`, height : `${props.heightChat - 125  + 'px'}`}} id={'list-message-chat'}>
                {listMessChat && listMessChat.map((value,ind) => {
                    return (
                        <div className={value.classname}  key={ind}>
                            <div className='item-mess'>
                                <div className='item-name'>
                                    {value.name} ( {value.userId}xxx) : (time : {value.time} )
                                </div>
                                <div className='item-content'>
                                    {value.content}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
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
export default connect (mapStateToProps, mapDispatchToProps)(translate('common')(ContentChat))
