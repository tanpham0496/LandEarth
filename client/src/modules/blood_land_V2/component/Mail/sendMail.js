import React, {Fragment, useEffect, useState} from 'react';
import {loadingImage} from "../../../blood_land/components/general/System";
import {StyledCheckbox2} from "../../../../components/customStyled/Checkbox2_style";
import useInfiniteScroll from "../../../blood_land/components/general/UseInfinityScroll";
import {screenActions} from "../../../../store/actions/commonActions/screenActions";
import {useDispatch, useSelector} from "react-redux";
import {TranslateLanguage, userActions} from "../../../../helpers/importModule";
import moment from 'moment';
import DeleteSendMailPopup from "../Popup/MessageBox/DeleteMail/DeleteSendMailPopup";
import DeleteMailSuccess from "../Popup/MessageBox/DeleteMail/DeleteMailSuccess";


const SendMailComponent = () => {
    const dispatch = useDispatch();
    const {authentication : {user},users: {sentList,deleteMailStatus} ,screens} = useSelector(state => state);
    const [isCheckAll, setIsCheckAll] = useState(false);
    const [mailListState, setMailListState] = useState();
    const [mailSelected , setFriendSelected] = useState([]);
    useEffect(()=>{
        dispatch(userActions.getAllMails({userId : user._id}))
    },[]);
    const fetchMoreListItems = () => {
        setTimeout(() => {
            setMailListState(prevState => ([...prevState, ...sentList.slice(prevState.length, prevState.length + 30)]));
            setIsFetching(false);
        }, 500);
    };
    const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems, "mail-list-container");

    useEffect(() => {
        if (sentList) {
            setMailListState(sentList.slice(0, 30))
        }
    }, [sentList]);

    const onFriendSelected = (e, {checked, mail}) => {
        let mailSelectedNew = [...mailListState];
        mailSelectedNew.map(ml => {
            if(ml.mail._id === mail._id) ml.checked = !ml.checked;
            return mail;
        });
        setMailListState(mailSelectedNew);
    };
    const onCheckAll = (e) => {
        const onCheckAll =  [...sentList].filter(fl => fl.checked === true).length  ===  [...sentList].length;
        if(onCheckAll) {
            let  ListCheckAll = [...sentList].map(fl => fl.checked = false);
            setMailListState([...sentList],ListCheckAll);
        }
        else{
            let  ListCheckAll = [...sentList].map(fl => fl.checked = true);
            setMailListState([...sentList],ListCheckAll);
        }
    };
    const handleDeleteSendMail = () => {
        const onCheck = [...mailListState].filter(ft=> ft.checked===true);
        let emailIdArr = [];
        if(onCheck && Array.isArray(onCheck)) emailIdArr = onCheck.map(item => {return item.mail._id });
        emailIdArr && emailIdArr.length !==0 && dispatch(screenActions.addPopup({name : 'DeleteSendMailPopup',data : {emailIdArr : emailIdArr, userId : user._id}}))
    };

    return (
        <Fragment>
            <div className='mail-header'>
                <div className='icon-header'>
                    <img  alt='mailList' src={loadingImage('/images/bloodLandNew/mail/send-mail-hover.png')}/>
                </div>
                <div className='title-header'>
                    <TranslateLanguage direct={'menuTab.user.email.sent'}/>
                </div>
                <div className='button-header'>
                    <div className='button-return' onClick={() =>  dispatch(screenActions.removePopup({names: ['sendMail'] }))}>
                        <div className='icon-button'/>
                    </div>
                </div>
            </div>
            <div className='mail-body'>
                {sentList && sentList.length === 0 ? <div className='mail-empty-container'>
                    <img alt={'empty'} src={loadingImage('images/bloodlandNew/error-icon.png')}/>
                    <TranslateLanguage direct={'menuTab.user.email.sent.noInformation'}/>
                </div> : <Fragment>
                    <div className='mail-list-function-button-container'>
                        <div className='delete-mail-button' onClick={handleDeleteSendMail}>
                            <img alt={'delete'} src={loadingImage('/images/bloodLandNew/mail/deleteMail.png')}/>
                            <div className='button-name'><TranslateLanguage direct={'menuTab.user.email.sent.recycle'}/></div>
                        </div>
                    </div>
                    <div className='checkAll-container'>
                        <div className='checkAll-button'>
                            <StyledCheckbox2 value='checkAll' onChange={(e) => onCheckAll(e)}
                                             checked={mailListState && mailListState.filter(fl=> fl.checked === true).length === mailListState.length }
                            />
                        </div>
                        <div className='checkAll-title'>
                            <TranslateLanguage direct={'menuTab.user.email.sent.selectAll'}/>
                        </div>
                        <div className='mail-selected'>
                            <div style={{color: '#12354F'}}>(</div>
                            {mailListState && mailListState.filter(fl=> fl.checked === true).length }
                            <div style={{color: '#12354F'}}>)</div>
                        </div>

                    </div>
                    <div className='line-container'/>
                    <div className='mail-list-container' id='mail-list-container'>
                        {!mailListState ? <div className='friend-empty-container'>
                            <img alt={'empty'} src={loadingImage('images/bloodlandNew/error-icon.png')}/>
                            <TranslateLanguage direct={'menuTab.user.email.sent.noInformation'}/>
                        </div>: mailListState && mailListState.map(({checked, mail}, index) => {
                            return (
                                <div className='mail-list-item' key={index}>
                                    <div className='item-check-button'>
                                        <StyledCheckbox2 onChange={(e) => onFriendSelected(e , {checked, mail})} checked={checked}/>
                                    </div>
                                    <img alt='mail' src={loadingImage('images/bloodlandNew/mail.png')}/>
                                    <div className='user-name' >
                                        {mail.toName}
                                    </div>
                                    <div className='item-date'>
                                        {moment(mail.createdDate).format('DD/MM/YY')}
                                    </div>
                                </div>                               
                            )
                        })}
                    </div>
                </Fragment>}

            </div>
            {screens['DeleteSendMailPopup'] && <DeleteSendMailPopup param={screens.DeleteSendMailPopup}/>}
            {screens['DeleteMailSuccess'] && <DeleteMailSuccess/>}
        </Fragment>
    )
};
export default SendMailComponent
