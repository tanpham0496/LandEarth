import React from 'react';
import {
    MessageBox,
    TranslateLanguage
} from '../../../../../../../../../helpers/importModule';
export const alertPopupCategoryDetail = {
    noPopup: 'noPopup',
    noSelection:'noSelection',
};

//===========================================alert for land =============================================================
//getNoSelection
export const getNoSelected = (modalAlertPopup,handleHideAllPopup) => {
    const modal = modalAlertPopup;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHideAllPopup();
    const header = <TranslateLanguage direct={'menuTab.myLand.landOwned.tree.notice'}/>;
    const body = <TranslateLanguage direct={'menuTab.myLand.landOwned.tree.selectLand'}/>;
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
};


//=======================================================================================================================