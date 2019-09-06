import React from 'react';
import { connect } from 'react-redux';
import {screenActions, TranslateLanguage, MessageBox} from "../../../../../../../helpers/importModule";


//validation alert
function ValidationAlert(props) {
    const {error} = props;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => props.removePopup({ name: "ValidationAlert" });
    const header = <TranslateLanguage direct={'menuTab.transaction.buyLand.alert.getValidateAlertPopup.header'}/>;
    const body = error === 'maxLength' ? <TranslateLanguage
        direct={'validation.addCategoryValidation.checkLength'}/> : <TranslateLanguage
        direct={'validation.addCategoryValidation.checkExistString'}/> ;
    return <MessageBox modal={true} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body}/>;
}

export default connect (
    state => {
        const { authentication: { user }, screens, map } = state;
        return { user, screens, map };
    },
    dispatch => ({
        //addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
        removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
    })
)(ValidationAlert);