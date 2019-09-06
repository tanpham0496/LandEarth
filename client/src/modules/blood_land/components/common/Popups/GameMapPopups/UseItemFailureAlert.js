import React from 'react';
import {connect} from 'react-redux';
import {
    screenActions,
    TranslateLanguage,
    MessageBox
} from "../../../../../../helpers/importModule";


function UseItemFailureAlert(props) {
    const {itemData, objectId} = props;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => {
        (itemData.itemId === "I03" || itemData.itemId === "I01") && props.addPopup({
            name: 'PlantCultivationComponent',
            data: {_id: objectId}
        });
        props.removePopup({name: "UseItemFailureAlert"});
    }
    const header = <TranslateLanguage direct={'alert.getDroppingItemUnsuccessAlert.header'}/>
    const body = <TranslateLanguage direct={'alert.getDroppingItemUnsuccessAlert.body'}/>
    return <MessageBox modal={true} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body}/>;
}

export default connect(
    state => {
        const {authentication: {user}, screens, map, objects: {objectId}, mapGameReducer: {itemData}} = state;
        return {user, screens, map, objectId, itemData};
    },
    dispatch => ({
        //addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
        removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
        addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
    })
)(UseItemFailureAlert);