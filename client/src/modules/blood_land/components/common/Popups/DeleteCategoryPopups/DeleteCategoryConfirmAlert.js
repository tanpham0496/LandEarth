import React from 'react';
import {connect} from 'react-redux';
import {
    screenActions,
    TranslateLanguage,
    MessageBox,
} from "../../../../../../helpers/importModule";


function DeleteCategoryConfirmAlert(props) {
    const {removePopup , onHandleDeleteCate} = props;
    const mode = "question"; //question //info //customize
    const sign = "delete"; //blood //success //error //delete //loading
    const yesBtn = () => {
        onHandleDeleteCate();
        removePopup({name: 'DeleteCategoryConfirmAlert'})
    }
    const noBtn = () => removePopup({name: 'DeleteCategoryConfirmAlert'});
    const header = <TranslateLanguage direct={'menuTab.myLand.landOwned.recycle.delete'}/>
    const body = <TranslateLanguage direct={'menuTab.myLand.landOwned.recycle.confirmDelete'}/>
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
)(DeleteCategoryConfirmAlert);

