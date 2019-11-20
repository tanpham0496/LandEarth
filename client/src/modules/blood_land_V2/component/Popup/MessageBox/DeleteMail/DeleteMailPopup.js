import React  from 'react';
import {useDispatch } from 'react-redux';
import {screenActions} from "../../../../../../store/actions/commonActions/screenActions";
import MessageBoxNew from '../index';
import {userActions} from "../../../../../../store/actions/commonActions/userActions";
import {TranslateLanguage} from "../../../../../../helpers/importModule";

function DeleteMailPopup(props) {
    const {param : {emailIdArr, userId }} = props;
    const dispatch = useDispatch();

    const mode = "question"; //question //info //customize
    // const sign = "error"; //blood //success //error //delete //loading

    const yesBtn = () => {
        dispatch( screenActions.removePopup( {name: 'DeleteMailPopup'} ) );
        dispatch(userActions.deleteReceivedMail({emailIdArr : emailIdArr, userId : userId}));
        dispatch( screenActions.addPopup( {name: 'DeleteMailSuccess'} ) );
    };
    const noBtn = () =>  dispatch(screenActions.removePopup({name : 'DeleteMailPopup'}));
    const header = <TranslateLanguage direct={'alert.receivedMail.getDeleteConfirmAlertPopup.header'}/>;
    const body = <TranslateLanguage direct={'alert.receivedMail.getDeleteConfirmAlertPopup.body'}/>;
    return <MessageBoxNew modal={true} mode={mode} noBtn={noBtn} yesBtn={yesBtn} header={header} body={body}/>;
}

export default DeleteMailPopup