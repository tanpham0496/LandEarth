import React from 'react';
import { connect } from 'react-redux';
import {
    screenActions, inventoryActions, mapGameAction,
    TranslateLanguage,
    MessageBox
} from "../../../../../../helpers/importModule";


function UseLimitedItemAlert(props) {
    const {itemData , objectId , isOpenCultivationPopup} = props;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => {
        isOpenCultivationPopup && (itemData.itemId === "I03" || itemData.itemId === "I01" ) && props.addPopup({name: 'PlantCultivationComponent' , data: {_id: objectId}});
        props.removePopup({ name: "UseLimitedItemAlert" })
    };
    const header = <TranslateLanguage direct={'alert.getUseLimitedItemAlert.header'}/>
    const body = <TranslateLanguage direct={'alert.getUseLimitedItemAlert.body'}/>
    return <MessageBox modal={true} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body}/>;
}

export default connect (
    state => {
        const { authentication: { user }, screens  ,  objects:{objectId} , mapGameReducer:{itemData}} = state;
        return { user, screens  , objectId , itemData};
    },
    dispatch => ({
        //addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
        removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
        getCharacterInventoryByUserId: (param) => dispatch(inventoryActions.getCharacterInventoryByUserId(param)),
        onHandleGetQuadKeyBitamin: (quadKey) => dispatch(mapGameAction.onHandleGetQuadKeyBitamin(quadKey)),
        addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
    })
)(UseLimitedItemAlert);