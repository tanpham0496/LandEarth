import React from 'react';
import {connect} from 'react-redux';
import {
    screenActions,
    TranslateLanguage,
    MessageBox
} from "../../../../../../helpers/importModule";


function UsingDropletConfirmAlert(props) {
    const {removePopup , screens: {UsingDropletConfirmAlert: {useItem}}} = props;
    const mode = "question"; //question //info //customize
    const yesBtn = () => {
        useItem();
        removePopup({name: 'UsingDropletConfirmAlert'})
    };
    const noBtn = () => removePopup({name: 'UsingDropletConfirmAlert'});
    const header = <TranslateLanguage direct={'alert.droplet.getUsingItemConfirmAlertPopup.header'}/>
    const body = <TranslateLanguage direct={'alert.droplet.getUsingItemConfirmAlertPopup.body'}/>
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
)(UsingDropletConfirmAlert);
