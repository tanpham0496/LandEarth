import React from 'react';
import {connect} from 'react-redux';
import {
    screenActions,
    inventoryActions,
    mapGameAction,
    TranslateLanguage,
    MessageBox
} from "../../../../../../helpers/importModule";


//confirm de trong cay
function ConfirmPlantingTree(props) {
    const {plantData, arrayTileEffect} = props;
    const quadKeys = arrayTileEffect && arrayTileEffect.map(tile => tile.quadKey);
    const {characterData: {quadKey, item: {itemId}}, user: {_id}} = plantData;
    let paramPlantTree = {
        userId: _id,
        items: itemId === 'T10' ? [{quadKey: quadKeys[0], itemId, quadKeys}] : [{quadKey, itemId}]
    };
    const mode = "question"; //question //info //customize
    const yesBtn = () => {
        props.onMoveCharacterToMap(paramPlantTree);
        props.addPopup({name: "LoadingPopup", close: "ConfirmPlantingTree", data: {mode: 'moveTreeToMap'}});
        props.onHandleGetQuadKeyBitamin();
    };
    const noBtn = () => {
        props.removePopup({name: "ConfirmPlantingTree"});
        props.onHandleGetQuadKeyBitamin();
    };
    const header = <TranslateLanguage direct={'alert.getPlantTreeConfirm.header'}/>
    const body = <TranslateLanguage direct={'alert.getPlantTreeConfirm.body'}/>
    return <MessageBox modal={true} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body}/>;
}

export default connect(
    state => {
        const {authentication: {user}, screens} = state;
        return {user, screens};
    },
    dispatch => ({
        addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
        removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
        onHandleGetQuadKeyBitamin: (quadKey) => dispatch(mapGameAction.onHandleGetQuadKeyBitamin(quadKey)),
        onMoveCharacterToMap: (param) => dispatch(inventoryActions.onHandleMoveTreeToMap(param)),
    })
)(ConfirmPlantingTree);