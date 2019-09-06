import React from 'react';
import { connect } from 'react-redux';
import {screenActions, TranslateLanguage, MessageBox} from "../../../../../../helpers/importModule";


function UsingBloodToUseShovelAlert(props) {
    const {removePopup, screens: {UsingBloodToUseShovelAlert: {needGoldBlood , confirmUsingShovel}} , wallet: {info: {goldBlood}} , addPopup} = props;

    const checkGoldBloodAndUseItem = () => {
        removePopup({name: 'UsingBloodToUseShovelAlert'});
        (needGoldBlood <= 0 || goldBlood <= 0 || goldBlood < needGoldBlood) ?
            addPopup({name: 'NotEnoughMoneyAlert'}) : confirmUsingShovel();
    };

    const mode = "question"; //question //info //customize
    const sign = "blood"; //blood //success //error //delete //loading
    const yesBtn = () => checkGoldBloodAndUseItem();
    const noBtn = () => removePopup({name: 'UsingBloodToUseShovelAlert'});
    const header = <TranslateLanguage direct={'alert.removal.getNoEnoughAmountUsingItemAlertPopup.header'}/>;
    const $_blood = `<span class='text-highlight'>${needGoldBlood}</span>`;
    const body = <TranslateLanguage direct={'alert.removal.getNoEnoughAmountUsingItemAlertPopup.body'} $_blood={$_blood} />;
    return <MessageBox modal={true} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} sign={sign} />;
}

export default connect (
    state => {
        const { authentication: { user }, screens, map , wallet } = state;
        return { user, screens, map , wallet};
    },
    dispatch => ({
        addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
        removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
    })
)(UsingBloodToUseShovelAlert);