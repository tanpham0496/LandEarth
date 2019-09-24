import React from 'react';
import { connect } from 'react-redux';
import {
     screenActions,
    TranslateLanguage,
    MessageBox
} from "../../../../../../helpers/importModule";


//pop up trong cay thanh cong
function PlantTreeFailureAlert(props) {
    const {removePopup , screens: {PlantTreeFailureAlert: {reloadTreeInCategoryDetail , selectedLandAfterPlant}}} = props;

    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => {
        reloadTreeInCategoryDetail();
        removePopup({name: 'PlantTreeFailureAlert'});
        removePopup({name: 'cultivation'});
        selectedLandAfterPlant.length === 0 && removePopup({name: 'PlantTree'})
    };
    const header = <TranslateLanguage direct={'alert.cultivation.getUsingItemUnsuccessAlert.header'}/>;
    const body = <TranslateLanguage direct={'alert.cultivation.getUsingItemUnsuccessAlert.body'}/>;
    return <MessageBox modal={true} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body}/>;
}

export default connect (
    state => {
        const { authentication: { user }, screens } = state;
        return { user, screens };
    },
    dispatch => ({
        //addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
        removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
    })
)(PlantTreeFailureAlert);