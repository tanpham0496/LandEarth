import React from "react";
import {useDispatch} from "react-redux";
import {screenActions} from "../../../../../../store/actions/commonActions/screenActions";
import {MessageBoxNew, TranslateLanguage} from "../../../../../../helpers/importModule";

function EmptyCategoryPopup(props) {
    const dispatch = useDispatch();
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => dispatch(screenActions.removePopup({ name: 'EmptyCategoryPopup' }));
    const header = <TranslateLanguage direct={'menuTab.myLand.landOwned.tree.notice'}/>;
    const body = <TranslateLanguage direct={'menuTab.myLand.landOwned.sellLand.noLandInCategory'}/>;
    return <MessageBoxNew mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
}

export default EmptyCategoryPopup;