import React  from 'react';
import {useDispatch } from 'react-redux';
import {screenActions} from "../../../../../../store/actions/commonActions/screenActions";
import MessageBoxNew from '../index';
import {userActions} from "../../../../../../store/actions/commonActions/userActions";
import {TranslateLanguage} from "../../../../../../helpers/importModule";

function DeleteSendMailPopup(props) {
    const {param : {emailIdArr, userId }} = props;
    const dispatch = useDispatch();

    const mode = "question"; //question //info //customize
    // const sign = "error"; //blood //success //error //delete //loading

    const yesBtn = () => {
        dispatch( screenActions.removePopup( {name: 'DeleteSendMailPopup'} ) );
        dispatch(userActions.deleteSentMail({emailIdArr : emailIdArr, userId : userId}));
        dispatch( screenActions.addPopup( {name: 'DeleteMailSuccess'} ) );
    };
    const noBtn = () =>  dispatch(screenActions.removePopup({name : 'DeleteSendMailPopup'}));
    const header = <TranslateLanguage direct={'menuTab.user.email.receive.recycle'}/>;
    const body = <TranslateLanguage direct={'menuTab.user.email.receive.recycle'}/>;
    return <MessageBoxNew modal={true} mode={mode} noBtn={noBtn} yesBtn={yesBtn} header={header} body={body}/>;
}

export default DeleteSendMailPopup