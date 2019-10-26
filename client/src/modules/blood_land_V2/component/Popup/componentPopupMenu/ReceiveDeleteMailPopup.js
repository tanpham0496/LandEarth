import React from 'react';
import {connect} from 'react-redux';
import {
    screenActions,
    TranslateLanguage
} from "../../../../../helpers/importModule";
import CommentMessageBox from '../CommentMessageBox'


function ReceiveDeleteMailPopup(props) {
    const mode = "info"; //question //info //customize
    const sign = "delete"; //blood //success //error //delete //loading
    const confirmBtn = () => {
        props.removePopup({name: "ReceiveDeleteMailPopup"});
    };
    const header = <TranslateLanguage direct={'menuTab.user.email.tooltip.name'}/>;
    const body = <TranslateLanguage direct={'menuTab.user.email.tooltip.name'}/>;
    return <CommentMessageBox modal={true} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body}/>;
}

export default connect(
    state => {
        const {authentication: {user}, screens, map} = state;
        return {user, screens, map};
    },
    dispatch => ({
        //addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
        removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
    })
)(ReceiveDeleteMailPopup);