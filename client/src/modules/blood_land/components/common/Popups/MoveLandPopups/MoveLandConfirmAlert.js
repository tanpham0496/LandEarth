import React from 'react';
import {connect} from 'react-redux';
import {
    screenActions,
    TranslateLanguage,
    MessageBox,
} from "../../../../../../helpers/importModule";


function MoveLandConfirmAlert(props) {
    const {removePopup , onHandleMoveLand} = props;
    const mode = "question"; //question //info //customize
    const yesBtn = () => onHandleMoveLand();
    const noBtn = () => removePopup({name: 'MoveLandConfirmAlert'});
    const header = <TranslateLanguage direct={'alert.moveLand.getConfirmMoveAlertPopup.header'}/>;
    const body = <TranslateLanguage direct={'alert.moveLand.getConfirmMoveAlertPopup.body'}/>;
    return <MessageBox modal={true} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} />;
}

export default connect(
    state => {
        const {authentication: {user}, screens, map} = state;
        return {user, screens, map};
    },
    dispatch => ({
        addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
        removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
    })
)(MoveLandConfirmAlert);

