import React from 'react';
import {connect} from 'react-redux';
import {
    screenActions,
    TranslateLanguage,
    MessageBox, objectsActions
} from "../../../../../../helpers/importModule";


function UsingShovelFailureAlert(props) {
    const {removePopup } = props;
    // const reloadTreeInCategoryDetail = () => {
    //     const param = {
    //         cateId: currentCategoryId,
    //         userId: _id
    //     };
    //     props.getObjectByQuadKey(param)
    // };
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => {
        removePopup({name: 'UsingShovelFailureAlert'});
        // reloadTreeInCategoryDetail() ;
        // selectedLandAfterRemove.length === 0 && removePopup({name: 'RemoveTree'});
    };
    const header = <TranslateLanguage direct={'alert.removal.getUsingItemUnsuccessAlert.header'}/>;
    const body = <TranslateLanguage direct={'menuTab.shop.alert.getPurchaseUnSuccessAlertPopup.body'}/>;
    return <MessageBox modal={true} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
}

export default connect(
    state => {
        const {authentication: {user}, screens , objectsReducer: {currentCategoryId}} = state;
        return {user, screens, currentCategoryId};
    },
    dispatch => ({
        // addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
        removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
        getObjectByQuadKey: (param) => dispatch(objectsActions.getObjectByQuadKey(param)),
    })
)(UsingShovelFailureAlert);
