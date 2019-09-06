import React from 'react';
import {connect} from 'react-redux';
import {
    screenActions,
    TranslateLanguage,
    MessageBox, objectsActions
} from "../../../../../../helpers/importModule";


function UsingNutrientFailureAlert(props) {
    const {removePopup , user: {_id}, screens: {UsingNutrientSuccessAlert: {selectedLands}}} = props;
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
        removePopup({name: 'UsingNutrientFailureAlert'});
        reloadTreeInCategoryDetail() };
    const header = <TranslateLanguage direct={'alert.nutrients.getUsingItemUnsuccessAlert.header'}/>
    const body = <TranslateLanguage direct={'alert.nutrients.getUsingItemUnsuccessAlert.body'}/>
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
)(UsingNutrientFailureAlert);