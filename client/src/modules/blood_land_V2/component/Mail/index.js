import React , {Fragment}from 'react';
import {useSelector} from 'react-redux'
import ReceiveMailComponent from "./receiveMail";
import ReadMailComponent from "./readMail";
import SendMailComponent from "./sendMail";


const MailComponent = () => {
    const {screens} = useSelector(state => state);
    return(
        <Fragment>
            {screens['receiveMail'] && <ReceiveMailComponent/>}
            {screens['readMail'] && <ReadMailComponent/>}
            {screens['sendMail'] && <SendMailComponent/>}

        </Fragment>
    )
};
export default MailComponent
