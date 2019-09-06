import React from 'react';
import {connect} from 'react-redux';
import {
    screenActions, inventoryActions, mapGameAction,
    TranslateLanguage,
    MessageBox
} from "../../../../../../helpers/importModule";


//pop up trong cay thanh cong
function PlantingTreeSuccessAlert(props) {
    const mode = "info"; //question //info //customize
    const sign = "success"; //blood //success //error //delete //loading
    const confirmBtn = () => {
        props.removePopup({name: "PlantingTreeSuccessAlert"});
        props.onHandleGetQuadKeyBitamin();
        if (props.user && props.user._id) props.getCharacterInventoryByUserId({userId: props.user._id});
    };
    const header = <TranslateLanguage direct={'alert.getPlantingSuccessAlert.header'}/>;
    const body = <TranslateLanguage direct={'alert.getPlantingSuccessAlert.body'}/>;
    return <MessageBox modal={true} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body}/>;
}

export default connect(
    state => {
        const {authentication: {user}, screens} = state;
        return {user, screens};
    },
    dispatch => ({
        //addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
        removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
        onHandleGetQuadKeyBitamin: (quadKey) => dispatch(mapGameAction.onHandleGetQuadKeyBitamin(quadKey)),
        getCharacterInventoryByUserId: (param) => dispatch(inventoryActions.getCharacterInventoryByUserId(param)),
    })
)(PlantingTreeSuccessAlert);