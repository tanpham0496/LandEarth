import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import {screenActions, TranslateLanguage, MessageBox} from "../../../../../../../helpers/importModule";


function MailValidateAlert(props) {
    const {screens: {MailValidateAlert : {titleValidation, contentValidation }} , removePopup} = props;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => removePopup({name: 'MailValidateAlert'});
    const header = <TranslateLanguage direct={'alert.getValidationAlertPopup.header'}/>;
    const body =  <Fragment>
        {titleValidation && <TranslateLanguage direct={'alert.getValidationAlertPopup.titleValidationBody'}/>}
        {contentValidation && <TranslateLanguage direct={'alert.getValidationAlertPopup.contentValidationBody'}/>}
        {/*{titleLengthValidation && <TranslateLanguage direct={'alert.getValidationAlertPopup.titleLengthValidationBody'}/>}*/}
        {/*{contentLengthValidation && <TranslateLanguage direct={'alert.getValidationAlertPopup.titleLengthValidationBody'}/>}*/}
    </Fragment>;
    return <MessageBox modal={true} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
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
)(MailValidateAlert);