import React from "react";
import { useDispatch, useSelector} from "react-redux";
import {MessageBoxNew, screenActions, TranslateLanguage} from "../../../../../../helpers/importModule";

function ModifyLandResultAlert(props) {
    const {screens: {ModifyLandResultAlert: {paramModifyLandResultAlert : {landUpdate , totalLand}}}} = useSelector(state=>state);
    const dispatch = useDispatch();
    const mode = "info"; //question //info //customize
    const sign = landUpdate <= 0 ? "error" : "success"; //blood //success //error //delete //loading
    const confirmBtn = () => { dispatch(screenActions.removePopup({names: ["ModifyLandResultAlert","SaleLandModifiedPopup"]}))};
    const header = <TranslateLanguage direct={'alert.getChangeModifiedSellLandNumberAlert.header'}/>;
    const $_selected = `<span class='text-selected'>${landUpdate}</span>`;
    const $_total = `<span class='text-total'>${totalLand}</span>`;
    const body = <TranslateLanguage direct={'alert.getChangeModifiedSellLandNumberAlert.body'} $_selected={$_selected} $_total={$_total} />;
    return <MessageBoxNew modal={true} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
}

export default ModifyLandResultAlert;