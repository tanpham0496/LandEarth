import React from 'react';
import { connect } from 'react-redux';
import {screenActions, TranslateLanguage, MessageBox, inventoryActions} from "../../../../../../helpers/importModule";




function PlantTreeConfirmAlert(props) {
    const {onHandleMoveTreeToMap , screens: {PlantTreeConfirmAlert: {userId , items , reloadTreeAmount}} , addPopup , removePopup} = props;
    const mode = "question"; //question //info //customize
    const yesBtn = () => {
        onHandleMoveTreeToMap({userId , items});
        addPopup({name: 'LoadingPopup' , close: 'PlantTreeConfirmAlert'});
        reloadTreeAmount()
    };
    const noBtn = () => removePopup({name: 'PlantTreeConfirmAlert'});
    const header = <TranslateLanguage direct={'alert.cultivation.getUsingItemConfirmAlertPopup.header'}/>;
    const body = <TranslateLanguage direct={'alert.cultivation.getUsingItemConfirmAlertPopup.body'}/>;
    return <MessageBox modal={true} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body}/>;
}

export default connect (
    state => {
        const { authentication: { user }, screens, map } = state;
        return { user, screens, map };
    },
    dispatch => ({
        addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
        removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
        onHandleMoveTreeToMap: (param) => dispatch(inventoryActions.onHandleMoveTreeToMap(param)),
    })
)(PlantTreeConfirmAlert);