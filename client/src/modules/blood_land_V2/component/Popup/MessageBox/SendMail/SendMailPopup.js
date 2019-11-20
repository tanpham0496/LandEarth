import React, {Fragment, useState, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Modal} from "reactstrap";
import {loadingImage} from "../../../../../blood_land/components/general/System";
import {screenActions} from "../../../../../../store/actions/commonActions/screenActions";
import {userActions} from "../../../../../../store/actions/commonActions/userActions";

const SendMailPopup = (props) => {
    const {param : {sendAmountFriend,userId,userName } } = props ;
    const dispatch = useDispatch();
    const {authentication : {user}, users :{success, sendlist}} = useSelector(state => state);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [checkMail, setCheckMail] = useState(false);
    const _onHandleSendMail = () => {
        if( title.length === 0 || content.length === 0 ) {
            setCheckMail(true);
        }
        else {
            const data = {title,content};
            let mails = [];
            for(let item of sendAmountFriend) {
                let param = { title, content: content,  fromId: userId, fromName: userName , toId: item.friend.userId, toName: item.friend.name
                };
                mails.push(param)
            }
            dispatch(userActions.sendMail(mails));
            setCheckMail(false);
            setTitle('');
            setContent('');
            dispatch(screenActions.removePopup({name : 'SendMailPopup'}));
            dispatch(screenActions.addPopup({name : 'SendMailSuccess'}));
        }

    };
    useEffect(()=> {

    }, [checkMail]);
    return(
        <Fragment>
            <Modal isOpen={true} backdrop="static" className={`modal-container-send-mail`}>
                <div className={'header-send-mail'}>
                    <img src={loadingImage('/images/bloodLandNew/mail/receive-mail-logo.png')} alt="send mail" />
                    <div className={'title-send-mail'}> 편지쓰기 </div>
                    <div className='button-header'>  <div className='button-return' onClick={()=>  dispatch(screenActions.removePopup({name : 'SendMailPopup'}))} > <div className='icon-button'/> </div> </div>
                </div>
                <div className={'body-send-mail'}>
                    <div className={'people-receive-mail'}>
                        {sendAmountFriend && sendAmountFriend.map(({friend : {name}},ind) => {
                            return(
                                <div style={{'padding-right' : '10px'}}>{name} </div>
                            )
                        })}
                    </div>
                    <div className={'title-mail'}>
                        {checkMail && title.length === 0 &&  <p style={{color : 'red',textAlign : 'left'}}> Please! Let's typing title </p>}

                        <input type="text" value={title} onChange={(e)=> setTitle(e.target.value)} placeholder={'제목을 입력하세요.(35자 이내)'} maxLength="35"/>
                    </div>
                    <div className={'content-mail'}>
                        {checkMail && content.length === 0 &&  <p style={{color : 'red',textAlign : 'left'}}> Please! Let's typing title </p>}
                        <textarea className={'input-chat'}  id="m" value={content} onChange={(e)=> setContent(e.target.value)} placeholder={'내용을 입력해 주세요'} />
                    </div>
                </div>
                <div className={'footer-send-mail'}>
                    <button onClick={()=>  dispatch(screenActions.removePopup({name : 'SendMailPopup'}))}> 취소보내기 </button>
                    <button onClick={_onHandleSendMail}> 취소 </button>
                </div>
            </Modal>
        </Fragment>
    )
}
export default SendMailPopup;
