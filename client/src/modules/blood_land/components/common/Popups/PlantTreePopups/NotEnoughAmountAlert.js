import React from 'react';
import { connect } from 'react-redux';
import {screenActions, TranslateLanguage, MessageBox} from "../../../../../../helpers/importModule";



function NotEnoughAmountAlert(props) {
    const {addPopup, removePopup} = props;
    const mode = "question"; //question //info //customize
    const yesBtn = () => {
        addPopup({name: 'shop'});
        removePopup({name: 'NotEnoughAmountAlert'})
    };
    const noBtn = () => removePopup({name: 'NotEnoughAmountAlert'});
    const header = <TranslateLanguage direct={'alert.cultivation.getNoEnoughAmountUsingItemAlertPopup.header'}/>;
    const body = <TranslateLanguage direct={'alert.cultivation.getNoEnoughAmountUsingItemAlertPopup.body'}/>;
    return <MessageBox modal={true} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body}/>;
}

export default connect (
    state => {
        const { authentication: { user }, screens, map } = state;
        return { user, screens, map };
    },
    dispatch => ({
        addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
        removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
    })
)(NotEnoughAmountAlert);