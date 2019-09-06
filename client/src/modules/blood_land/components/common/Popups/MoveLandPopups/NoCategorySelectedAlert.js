import React from 'react';
import {connect} from 'react-redux';
import {
    screenActions,
    TranslateLanguage,
    MessageBox,
} from "../../../../../../helpers/importModule";


function NotCategorySelectedAlert(props) {
    const {removePopup} = props;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => removePopup({name: 'NotCategorySelectedAlert'});
    const header = <TranslateLanguage direct={'alert.moveLand.getNoSelectedCategory.header'}/>;
    const body = <TranslateLanguage direct={'alert.moveLand.getNoSelectedCategory.body'}/>;
    return <MessageBox modal={true} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
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
)(NotCategorySelectedAlert);

