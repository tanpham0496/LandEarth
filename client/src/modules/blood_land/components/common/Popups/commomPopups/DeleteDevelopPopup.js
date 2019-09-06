import React from 'react';
import {connect} from 'react-redux';
import {
    screenActions,
    TranslateLanguage,
    MessageBox,
} from "../../../../../../helpers/importModule";


function DeleteDevelopPopup(props) {
    const {removePopup , onHandleDeleteDevelop} = props;
    const mode = "question"; //question //info //customize
    const sign = "delete"; //blood //success //error //delete //loading
    const yesBtn = () => {
        onHandleDeleteDevelop();
        removePopup({name: 'DeleteDevelopPopup'})
    }
    const noBtn = () => removePopup({name: 'DeleteDevelopPopup'});
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
)(DeleteDevelopPopup);

