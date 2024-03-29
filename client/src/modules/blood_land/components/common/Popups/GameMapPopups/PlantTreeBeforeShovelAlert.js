import React from 'react';
import { connect } from 'react-redux';
import {
     screenActions,
    TranslateLanguage,
    MessageBox
} from "../../../../../../helpers/importModule";

function PlantTreeBeforeShovelAlert(props) {
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => props.removePopup({ name: "PlantTreeBeforeShovelAlert" });
    const header = <TranslateLanguage direct={'menuTab.myLand.landOwned.shovel.notice'}/>
    const body = <TranslateLanguage direct={'menuTab.myLand.landOwned.shovel.plantTreeBefore'}/>
    return <MessageBox modal={true} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
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
)(PlantTreeBeforeShovelAlert);