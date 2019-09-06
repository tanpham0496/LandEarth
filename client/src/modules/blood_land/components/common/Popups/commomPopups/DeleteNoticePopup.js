import React from 'react';
import {connect} from 'react-redux';
import {
    screenActions,
    TranslateLanguage,
    MessageBox,
} from "../../../../../../helpers/importModule";


function DeleteNoticePopup(props) {
    const {removePopup , onHandleDeleteNotice} = props;
    const mode = "question"; //question //info //customize
    const sign = "delete"; //blood //success //error //delete //loading
    const yesBtn = () => {
        onHandleDeleteNotice();
        removePopup({name: 'DeleteNoticePopup'})
    }
    const noBtn = () => removePopup({name: 'DeleteNoticePopup'});
    const header = <TranslateLanguage direct={'adsNotice.recycle'}/>;
    const body = <TranslateLanguage direct={'adsNotice.recycle.confirmDelete'}/>
    return <MessageBox modal={true} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} sign={sign}/>;
}

export default connect(
    state => {
        const {authentication: {user}, screens, map} = state;
        return {user, screens, map};
    },
    dispatch => ({
        // addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
        removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
    })
)(DeleteNoticePopup);

