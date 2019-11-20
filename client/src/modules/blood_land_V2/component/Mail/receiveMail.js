import React, {Fragment, useEffect, useState} from 'react';
import {loadingImage} from "../../../blood_land/components/general/System";
import {StyledCheckbox2} from "../../../../components/customStyled/Checkbox2_style";
import useInfiniteScroll from "../../../blood_land/components/general/UseInfinityScroll";

import {screenActions} from "../../../../store/actions/commonActions/screenActions";
import {useDispatch, useSelector} from "react-redux";
import DeleteMailPopup from '../Popup/MessageBox/DeleteMail/DeleteMailPopup'
import DeleteMailSuccess from '../Popup/MessageBox/DeleteMail/DeleteMailSuccess'
import {userActions} from "../../../../store/actions/commonActions/userActions";
import moment from 'moment'
import {TranslateLanguage} from "../../../../helpers/importModule";

const FriendListButton = [
    {
        name: '읽음',
        type: 'ReadMailList',
        imageUrl: loadingImage('/images/bloodLandNew/mail/readMail.png')
    }, {
        name: '삭제',
        type: 'DeleteMailList',
        imageUrl: loadingImage('/images/bloodLandNew/mail/deleteMail.png')
    }
];
const ReceiveMailComponent = () => {
    const {screens, authentication : {user}, users : {receivedList}} = useSelector(state=> state);
    const dispatch = useDispatch();
    const [mailListState, setMailListState] = useState();
    const [mailSelected , setMailSelected] = useState([]);
    useEffect(() => {
        dispatch(userActions.getAllMails({userId: user._id}))
    },[]);
    const fetchMoreListItems = () => {
        setTimeout(() => {
            setMailListState(prevState => ([...prevState, ...receivedList.slice(prevState.length, prevState.length + 30)]));
            setIsFetching(false);
        }, 500);
    };
    const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems, "mail-list-container");

    useEffect(() => {
        if (receivedList && Array.isArray(receivedList)) {
            setMailListState(receivedList.slice(0, 30))
        }
    }, [receivedList]);



    const onMailSelected = (idMail) => {
        let mailSelectedNew = [...mailListState];
        mailSelectedNew.map(mailselected=> {
            if(mailselected.mail._id === idMail)  mailselected.checked = !mailselected.checked;
            return mailselected;
        });
        setMailListState(mailSelectedNew);
    };
    const onCheckAll = (e) => {
        const onCheckAll =  [...receivedList].filter(fl => fl.checked === true).length  ===  [...receivedList].length;
        if(onCheckAll) {
            let mailListCheckAll = [...receivedList].map(fl => fl.checked = false);
            setMailListState([...receivedList],mailListCheckAll);
        }
        else{
            let mailListCheckAll = [...receivedList].map(fl => fl.checked = true);
            setMailListState([...receivedList],mailListCheckAll);
        }
    };

    const onReadMailDetail = (mail) => {
        console.log(mail);
        dispatch(screenActions.addPopup({name: 'readMail' , data: {userId :user._id,mail} , close: 'receiveMail'}));
        mail.mail.status !== 1 && dispatch(userActions.readMail({userId :user._id, mailId : mail.mail._id}))
    };
    const handleReadOrDeleteMail = (type) => {
        let checkChooseMail = [...mailListState].map(ml =>
            {
                if(ml.checked) return ml.mail._id;
                return null 
            }
        );
        console.log('checkChooseMail',checkChooseMail);
        switch (type) {
            case 'ReadMailList' :
                checkChooseMail && checkChooseMail.length !== 0 && dispatch(userActions.readManyMail({userId: user._id, mailIds : checkChooseMail}));
                break;
            case 'DeleteMailList' :
                checkChooseMail && checkChooseMail.length !== 0 &&  dispatch( screenActions.addPopup( {name: 'DeleteMailPopup', data : {emailIdArr : checkChooseMail, userId : user._id}} ) );
                break;
            default:
                return  ''

        }
    };
    return (
        <Fragment>
            <div className='mail-header'>
                <div className='icon-header'>
                    <img  alt='mailList' src={loadingImage('/images/bloodLandNew/mail/receive-mail-hover.png')}/>
                </div>
                <div className='title-header'>
                    <TranslateLanguage direct={'menuTab.user.email.receive'}/>
                </div>
                <div className='button-header'>
                    <div className='button-return' onClick={() =>  dispatch(screenActions.removePopup({names: ['receiveMail'] }))}>
                        <div className='icon-button'/>
                    </div>
                </div>
            </div>
            <div className='mail-body'>
                {receivedList && receivedList.length === 0 ? <div className='mail-empty-container'>
                    <img alt={'empty'} src={loadingImage('images/bloodlandNew/error-icon.png')}/>
                    <TranslateLanguage direct={'menuTab.user.email.receive.noInformation'}/>
                </div> : <Fragment>
                    <div className='mail-list-function-button-container'>
                        {FriendListButton.map((item, index) => {
                            return (
                                <div className='mail-list-button' key={index} onClick={()=> handleReadOrDeleteMail(item.type)}>
                                    <img alt={item.type} src={item.imageUrl}/>
                                    <div className='button-name'>{item.name}</div>
                                </div>
                            )
                        })}
                    </div>
                    <div className='checkAll-container'>
                        <div className='checkAll-button'>
                            <StyledCheckbox2 value='checkAll' onChange={onCheckAll}
                                             checked={mailListState && mailListState.filter(fl=> fl.checked === true).length === mailListState.length }
                            />
                        </div>
                        <div className='checkAll-title'>
                            <TranslateLanguage direct={'menuTab.user.email.receive.selectAll'}/>
                        </div>
                        <div className='mail-selected'>
                            <div style={{color: '#12354F'}}>(</div>
                            {mailListState && mailListState.filter(ml=> ml.checked === true).length }
                            <div style={{color: '#12354F'}}>)</div>
                        </div>

                    </div>
                    <div className='line-container'/>
                    <div className='mail-list-container' id='mail-list-container'>
                        {receivedList && receivedList.length === 0 ? <div className='friend-empty-container'>
                            <img alt={'empty'} src={loadingImage('images/bloodlandNew/error-icon.png')}/>
                            <TranslateLanguage direct={'menuTab.user.email.receive.noInformation'}/>
                        </div>: mailListState && mailListState.map((item, index) => {
                            const unreadMail = item.mail.status === 1 ? 'mail-list-item read-mail' : 'mail-list-item';
                            return (
                                <div className={unreadMail} key={index} >
                                    <div className='item-check-button'>
                                        <StyledCheckbox2 onChange={() => onMailSelected(item.mail._id)} checked={ item.checked}/>
                                    </div>
                                    <span style={{display: 'flex'}} onClick={() => onReadMailDetail(item)}>
                                        <img alt='mail' src={loadingImage('images/bloodlandNew/mail.png')} />
                                        <div className='user-name'>
                                            {item.mail.fromName}
                                        </div>
                                        { item.mail.status === 0 && <div style={{color : 'red', padding: '0 10px'}}> NEW </div>}
                                        <div className='item-date'>
                                            { moment(item.mail.createdDate).format('DD-MM-YYYY') }
                                        </div>
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </Fragment>}

            </div>

            {screens['DeleteMailPopup'] && <DeleteMailPopup param={screens.DeleteMailPopup} />}
            {screens['DeleteMailSuccess'] && <DeleteMailSuccess/>}
        </Fragment>
    )
};
export default ReceiveMailComponent
