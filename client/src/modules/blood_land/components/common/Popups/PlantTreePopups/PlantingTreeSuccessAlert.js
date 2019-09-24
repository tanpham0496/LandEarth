import React from 'react';
import { connect } from 'react-redux';
import {
    screenActions,
    TranslateLanguage,
    MessageBox, objectsActions
} from "../../../../../../helpers/importModule";


//pop up trong cay thanh cong
function PlantTreeSuccessAlert(props) {
    const {removePopup , screens: {PlantTreeSuccessAlert: {reloadTreeInCategoryDetail , selectedLandAfterPlant}}} = props;
    const mode = "info"; //question //info //customize
    const sign = "success"; //blood //success //error //delete //loading
    const confirmBtn = () => {
        reloadTreeInCategoryDetail();
        // props.resetLandSelectedMyLand();
        removePopup({name: 'PlantTreeSuccessAlert'});
        selectedLandAfterPlant.length === 0 && removePopup({name: 'PlantTree'})
        props.resetLandSelectedToPlantTree()

    };
    const header = <TranslateLanguage direct={'alert.cultivation.getUsingItemSuccessAlert.header'}/>;
    const body = <TranslateLanguage direct={'alert.cultivation.getUsingItemSuccessAlert.body'}/>;
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
        resetLandSelectedToPlantTree: () => dispatch(objectsActions.resetLandSelectedToPlantTree())
        // resetLandSelectedMyLand: () =>  dispatch(objectsActions.resetLandSelectedMyLand()),
    })
)(PlantTreeSuccessAlert);