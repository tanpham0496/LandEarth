import React  from 'react';
import { connect, useDispatch } from 'react-redux';
import {screenActions,  TranslateLanguage, MessageBox} from "../../../../../../../helpers/importModule";

function ErrorOver500LandsInCategory(props) {
    const dispatch = useDispatch();

    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => dispatch(screenActions.removePopup({ name: "ErrorOver500LandsInCategory" }));
    const header = <TranslateLanguage direct={'menuTab.transaction.buyLand.alert.ErrorOver500LandsInCategory.header'}/>;
    const body = <TranslateLanguage direct={'menuTab.transaction.buyLand.alert.ErrorOver500LandsInCategory.body'}/>;
    return <MessageBox modal={true} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body}/>;
}

export default connect (
    state => {
        const { authentication: { user }, screens, map } = state;
        return { user, screens, map };
    },
    null
)(ErrorOver500LandsInCategory);