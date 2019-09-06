import React from 'react';
import {connect} from 'react-redux';
import {
    screenActions,
    TranslateLanguage,
    MessageBox
} from "../../../../../../helpers/importModule";


function UsingShovelConfirmAlert(props) {
    const {removePopup , screens: {UsingShovelConfirmAlert: {confirmUsingShovel}}} = props;
    const mode = "question"; //question //info //customize
    const yesBtn = () => {
        confirmUsingShovel();
        removePopup({name: 'UsingShovelConfirmAlert'})
    };
    const noBtn = () => removePopup({name: 'UsingNutrientConfirmAlert'});
    const header = <TranslateLanguage direct={'alert.nutrients.getUsingItemConfirmAlertPopup.header'}/>
    const body = <TranslateLanguage direct={'alert.nutrients.getUsingItemConfirmAlertPopup.body'}/>
    return <MessageBox modal={true} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} />;
}

export default connect(
    state => {
        const {authentication: {user}, screens} = state;
        return {user, screens};
    },
    dispatch => ({
        // addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
        removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
    })
)(UsingShovelConfirmAlert);
