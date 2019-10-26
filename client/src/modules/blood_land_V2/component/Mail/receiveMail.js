import React, {Fragment, useEffect, useState} from 'react';
import {loadingImage} from "../../../blood_land/components/general/System";
import {StyledCheckbox2} from "../../../../components/customStyled/Checkbox2_style";
import useInfiniteScroll from "../../../blood_land/components/general/UseInfinityScroll";
import _ from 'lodash';
import classNames from 'classnames';
import {screenActions} from "../../../../store/actions/commonActions/screenActions";
import {useDispatch, useSelector} from "react-redux";
import DeleteMailPopup from '../Popup/componentPopupMenu/DeleteMailPopup'
import ReceiveDeleteMailPopup from '../Popup/componentPopupMenu/ReceiveDeleteMailPopup'


let list = [];
for (let i = 0; i < 10000; i++) {
    let temp = {"id": i, "name": `Hello ${i}`};
    list.push(temp)
}
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
    const {screens} = useSelector(state=> state);
    const dispatch = useDispatch();
    const [isCheckAll, setIsCheckAll] = useState(false);
    const [mailListState, setFriendListState] = useState();
    const [mailSelected , setFriendSelected] = useState([]);
    const fetchMoreListItems = () => {
        setTimeout(() => {
            setFriendListState(prevState => ([...prevState, ...list.slice(prevState.length, prevState.length + 30)]));
            setIsFetching(false);
        }, 500);
    };
    const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems, "mail-list-container");

    useEffect(() => {
        if (list) {
            setFriendListState(list.slice(0, 30))
        }
    }, [list]);

    const onFriendSelected = (e, item) => {
        let mailSelectedNew = [...mailSelected];
        const checkSelected = mailSelectedNew.some(i =>  i === item.id);
        checkSelected ? _.remove(mailSelectedNew , (n) => n === item.id) :  mailSelectedNew.push(item.id);
        setIsCheckAll(mailSelectedNew.length === list.length)
        setFriendSelected(mailSelectedNew)
    };
    const onCheckAll = (e) => {
        setIsCheckAll(e.checked)
        let mailSelectedNew = [];
        list.map(i =>  mailSelectedNew.push(i.id));
        setFriendSelected(e.checked ? mailSelectedNew : [])
    };

    const onReadMailDetail = (e , item) => {
        e.persist();
        dispatch(screenActions.addPopup({name: 'readMail' , data: {item , type: 'receiveMail'} , close: 'receiveMail'}))

    };
    const handleReadOrDeleteMail = (type) => {
        console.log('mailSelected',mailSelected)
        mailSelected && mailSelected.length > 0 && dispatch(screenActions.addPopup({name: `${type}`, data : mailSelected}));
        mailSelected.length === 0 && alert('Bạn chưa chọn mail')
    }
    return (
        <Fragment>
            <div className='mail-header'>
                <div className='icon-header'>
                    <img  alt='mailList' src={loadingImage('/images/bloodLandNew/mail/receive-mail-hover.png')}/>
                </div>
                <div className='title-header'>
                    받은 편지함
                </div>
                <div className='button-header'>
                    <div className='button-return' onClick={() =>  dispatch(screenActions.removePopup({names: ['receiveMail'] }))}>
                        <div className='icon-button'/>
                    </div>
                </div>
            </div>
            <div className='mail-body'>
                {list.length === 0 ? <div className='mail-empty-container'>
                    <img alt={'empty'} src={loadingImage('images/bloodlandNew/error-icon.png')}/>
                    차단된 친구 없음
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
                            <StyledCheckbox2 value='checkAll' onChange={(e) => onCheckAll(e)} checked={isCheckAll}/>
                        </div>
                        <div className='checkAll-title'>
                            전체 선택
                        </div>
                        <div className='mail-selected'>
                            <div style={{color: '#12354F'}}>(</div>
                            {mailSelected.length}
                            <div style={{color: '#12354F'}}>)</div>
                        </div>

                    </div>
                    <div className='line-container'/>
                    <div className='mail-list-container' id='mail-list-container'>
                        {!mailListState ? <div className='friend-empty-container'>
                            <img alt={'empty'} src={loadingImage('images/bloodlandNew/error-icon.png')}/>
                            차단된 친구 없음
                        </div>: mailListState.map((item, index) => {
                            return (
                                <div className='mail-list-item' key={index}>
                                    <div className='item-check-button'>
                                        <StyledCheckbox2 onChange={(e) => onFriendSelected(e , item)} checked={mailSelected.some(i => i === item.id)}/>
                                    </div>
                                    <img alt='mail' src={loadingImage('images/bloodlandNew/mail.png')} onClick={(e) => onReadMailDetail(e , item)}/>
                                    <div className='item-name' onClick={(e) => onReadMailDetail(e , item)}>
                                        {item.name}
                                    </div>
                                    <div className='user-name' onClick={(e) => onReadMailDetail(e , item)}>
                                        {item.name}
                                    </div>
                                    <div className='item-date'>
                                            28/10/96
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </Fragment>}

            </div>

        {/*  action show popup read and remove mail  */}
            {screens['DeleteMailList'] && <DeleteMailPopup />}
            {screens['ReceiveDeleteMailPopup'] && <ReceiveDeleteMailPopup/>}
        </Fragment>
    )
};
export default ReceiveMailComponent
