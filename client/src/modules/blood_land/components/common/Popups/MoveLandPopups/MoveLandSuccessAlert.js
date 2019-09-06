import React from 'react';
import {connect} from 'react-redux';
import {
    screenActions,
    TranslateLanguage,
    MessageBox,
} from "../../../../../../helpers/importModule";


function MoveLandSuccessAlert(props) {
    const {removePopup , screens: {MoveLandSuccessAlert: {selectedLandsState}}} = props;
    const mode = "info"; //question //info //customize
    const sign = "success"; //blood //success //error //delete //loading
    const confirmBtn = () => {
        if(selectedLandsState && selectedLandsState.length !== 0 ){
            removePopup({name: 'moveLand'});
            removePopup({name: 'MoveLandSuccessAlert' })
        }else if(selectedLandsState && selectedLandsState.length === 0){
            removePopup({name: 'MoveLandSuccessAlert' })
        }
    };
    const header = <TranslateLanguage direct={'alert.moveLand.getMoveLandSuccess.header'}/>;
    const body = <TranslateLanguage direct={'alert.moveLand.getMoveLandSuccess.body'}/>;
    return <MessageBox modal={true} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
}

export default connect(
    state => {
        const {authentication: {user}, screens, map} = state;
        return {user, screens, map};
    },
    dispatch => ({
        // addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
        removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
    })
)(MoveLandSuccessAlert);

