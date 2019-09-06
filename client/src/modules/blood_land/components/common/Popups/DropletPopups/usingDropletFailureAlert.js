import React from 'react';
import {connect} from 'react-redux';
import {
    screenActions,
    TranslateLanguage,
    MessageBox, objectsActions
} from "../../../../../../helpers/importModule";


function UsingDropletFailureAlert(props) {
    const {removePopup , user: {_id}, screens: {UsingDropletFailureAlert: {selectedLands}}} = props;
    const reloadTreeInCategoryDetail = () => {
        const param = {
            cateId: selectedLands[0].categoryId,
            userId: _id
        };
        props.getObjectByQuadKey(param)
    };
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => {
        removePopup({name: 'UsingDropletFailureAlert'});
        reloadTreeInCategoryDetail() };
    const header = <TranslateLanguage direct={'alert.removal.getUsingItemUnsuccessAlert.header'}/>;
    const body = <TranslateLanguage direct={'menuTab.shop.alert.getPurchaseUnSuccessAlertPopup.body'}/>;
    return <MessageBox modal={true} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
}

export default connect(
    state => {
        const {authentication: {user}, screens} = state;
        return {user, screens};
    },
    dispatch => ({
        // addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
        removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
        getObjectByQuadKey: (param) => dispatch(objectsActions.getObjectByQuadKey(param)),
    })
)(UsingDropletFailureAlert);