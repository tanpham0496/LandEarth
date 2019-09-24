import React from 'react';
import { /*useSelector,*/ useDispatch } from 'react-redux';
import {screenActions, TranslateLanguage, MessageBox} from "../../../../../../helpers/importModule";


function EmptyCategoryAlert(props) {
    const dispatch = useDispatch();
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => dispatch(screenActions.removePopup({ name: 'EmptyCategoryAlert' }));
    const header = <TranslateLanguage direct={'menuTab.myLand.landOwned.tree.notice'}/>;
    const body = <TranslateLanguage direct={'menuTab.myLand.landOwned.sellLand.noLandInCategory'}/>;
    return <MessageBox mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
}

export default EmptyCategoryAlert;
