import React from 'react';
import { connect } from 'react-redux';
import {screenActions, TranslateLanguage, MessageBox, landActions} from "../../../../../../helpers/importModule";



function ModifyLandResultAlert(props) {
    const {screens: {ModifyLandResultAlert: {paramModifyLandResultAlert : {landUpdate , totalLand}}}} = props;
    const mode = "info"; //question //info //customize
    const sign = landUpdate <= 0 ? "error" : "success"; //blood //success //error //delete //loading
    const confirmBtn = () => {
        props.removePopup({name: "ModifyLandResultAlert"});
        props.removePopup({name: "SaleLandModifiedPopup"});

    };
    const header = <TranslateLanguage direct={'alert.getChangeModifiedSellLandNumberAlert.header'}/>;
    const $_selected = `<span class='text-selected'>${landUpdate}</span>`;
    const $_total = `<span class='text-total'>${totalLand}</span>`;
    const body = <TranslateLanguage direct={'alert.getChangeModifiedSellLandNumberAlert.body'} $_selected={$_selected} $_total={$_total} />;
    return <MessageBox modal={true} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
}

export default connect (
    state => {
        const { authentication: { user }, screens, map } = state;
        return { user, screens, map };
    },
    dispatch => ({
        getAllLandById: (userId) => dispatch(landActions.getAllLandById(userId)),
        //addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
        removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
    })
)(ModifyLandResultAlert);