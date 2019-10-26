import React, {Fragment, useEffect, useState} from 'react';
import {loadingImage} from "../../../blood_land/components/general/System";
import {screenActions} from "../../../../store/actions/commonActions/screenActions";
import {useDispatch, useSelector} from "react-redux";

const ReadMailButtonList = [
    {
        type: 'back-button',
        imageUrl: loadingImage('/images/bloodLandNew/mail/back-button.png'),
        name: '뒤로'
    },
    {
        type: 'reply-button',
        imageUrl: loadingImage('/images/bloodLandNew/mail/reply-mail.png'),
        name: '답장'
    }, {
        type: 'delete-button',
        imageUrl: loadingImage('/images/bloodLandNew/mail/deleteMail.png'),
        name: '삭제'
    }

];
const ReadMailComponent = () => {
    const dispatch = useDispatch();

    const onClickReadMailButton = (e, item) => {
        console.log('item', item)
        switch (item.type) {
            case 'back-button':
                return dispatch(screenActions.addPopup({name: 'receiveMail', close: 'readMail'}))
            default:
                break
        }
    };
    return (
        <Fragment>
            <div className='mail-header'>
                <div className='icon-header'>
                    <img alt='mailList' src={loadingImage('/images/bloodLandNew/mail/receive-mail-hover.png')}/>
                </div>
                <div className='title-header'>
                    받은 편지함
                </div>
                <div className='button-header'>
                    <div className='button-return'
                         onClick={() => dispatch(screenActions.addPopup({name: 'receiveMail', close: 'readMail'}))}>
                        <div className='icon-button'/>
                    </div>
                </div>
            </div>
            <div className='read-mail-body'>
                <div className='read-mail-button-container'>
                    {ReadMailButtonList.map((item, index) => {
                        return (
                            <div className='read-mail-button' key={index} onClick={(e) => onClickReadMailButton(e , item)}>
                                <img alt='mailList' src={item.imageUrl}/>
                                {item.name}
                            </div>
                        )
                    })}
                </div>
            </div>
        </Fragment>
    )
};
export default ReadMailComponent
