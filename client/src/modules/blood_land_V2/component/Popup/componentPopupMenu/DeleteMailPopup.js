import React from 'react';
import {connect} from 'react-redux';
import {
    screenActions,
    TranslateLanguage
} from "../../../../../helpers/importModule";
import CommentMessageBox from '../CommentMessageBox'


function DeleteMailPopup(props) {
    const {removePopup } = props;
    const mode = "question"; //question //info //customize
    const sign = "delete"; //blood //success //error //delete //loading
    const yesBtn = () => {
        props.removePopup({name: 'DeleteMailList'});
        props.addPopup({name : 'ReceiveDeleteMailPopup'})

    }
    const noBtn = () => props.removePopup({name: 'DeleteMailList'});
    const header = <TranslateLanguage direct={'menuTab.user.email.receive.recycle'}/>;
    const body = <TranslateLanguage direct={'menuTab.user.email.receive.recycle'}/>
    return <CommentMessageBox modal={true} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} sign={sign}/>;
}

export default connect(
    state => {
        const {authentication: {user}, screens, map} = state;
        return {user, screens, map};
    },
    dispatch => ({
        addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
        removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
    })
)(DeleteMailPopup);