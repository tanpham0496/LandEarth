import React from 'react';
import { connect} from 'react-redux';
import {landActions, screenActions, inventoryActions, userActions, objectsActions, TranslateLanguage, MessageBox} from "../../../../../../helpers/importModule";


function UseItemSuccessAlert(props) {

    const { user , objectId , itemData } = props;
    const mode = "info"; //question //info //customize
    const sign = "success"; //blood //success //error //delete //loading

    //handleHideAlertPopup();
    props.getItemInventoryByUserId({userId: user._id});
    props.getWalletInfo({ wToken: user.wToken });
    props.getCharacterInventoryByUserId({userId: user._id});

    //close popup
    const confirmBtn = () => {
        (itemData.itemId === "I03" || itemData.itemId === "I01" ) && props.addPopup({name: 'PlantCultivationComponent' , data: {_id: objectId}});
        props.removePopup({ name: 'UseItemSuccessAlert' });
    };

    const header = <TranslateLanguage direct={'alert.getItemSuccessAlert.header'}/>;
    const body = <TranslateLanguage direct={'alert.getItemSuccessAlert.body'}/>;
    return <MessageBox modal={true} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body}/>;
}

export default connect (
    state => {
        const { authentication: { user }, screens , objects:{objectId} , mapGameReducer:{itemData}} = state;
        return { user, screens, objectId, itemData };
    },
    dispatch => ({
        onHandleGetObjectDetail: (param) => dispatch(objectsActions.getDetailObject(param)),
        addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
        removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
        getWalletInfo: (param) => dispatch(userActions.getWalletInfo(param)), //use Item
        getAreaObject: (param) => dispatch(objectsActions.getAreaObject(param)), //reload map after use item
        getAreaLand: (param) => dispatch(landActions.getAreaLand(param)), //get land in screen
        //load lai  inventory
        getCharacterInventoryByUserId: (param) => dispatch(inventoryActions.getCharacterInventoryByUserId(param)),
        getItemInventoryByUserId: (param) => dispatch(inventoryActions.getItemInventoryByUserId(param)),
    })
)(UseItemSuccessAlert);