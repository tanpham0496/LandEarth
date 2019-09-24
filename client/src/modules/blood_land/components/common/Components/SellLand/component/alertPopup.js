import React from 'react';
import {
    MessageBox,
    TranslateLanguage
} from '../../../../../../../helpers/importModule';

export const alertPopupSellLand = {
    getCannotSellLandAlertPopup: 'getCannotSellLandAlertPopup',
    noLandSelectedAlertPopup: 'noLandSelectedAlertPopup',
    limitSellPriceAlertPopup: 'limitSellPriceAlertPopup',
    sellLandConfirmPopup: 'sellLandConfirmPopup',
    sellLandSuccess: 'sellLandSuccess',
    sellLandFailed: 'sellLandFailed',
    landAlreadySell : 'landAlreadySell',
    loadingPopup: 'loadingPopup',
    sellLandCancel: 'sellLandCancel',
};



export const getCannotSellLandAlertPopup = (modalAlertPopup, handleHideAlertPopup) => {
    const modal = modalAlertPopup;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHideAlertPopup();
    const header = <TranslateLanguage direct={'alert.getLimitSellPriceAlertPopup.header'}/>;
    const body = "Chon dat khong co cay bitamin";
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body}/>;
};



export const getLandAlreadySellAlertPopup = (modalAlertPopup, handleHideAlertPopup) => {
    const modal = modalAlertPopup;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHideAlertPopup();
    const header = <TranslateLanguage direct={'alert.getNoSelectedLandToSellAlertPopup.header'}/>;
    const body = 'Land da ban';
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body}/>;
};

export const getLimitSellPriceAlertPopup = (modalAlertPopup, handleHideAlertPopup) => {
    const modal = modalAlertPopup;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHideAlertPopup();
    const header = <TranslateLanguage direct={'alert.getLimitSellPriceAlertPopup.header'}/>;
    const body = <TranslateLanguage direct={'alert.getLimitSellPriceAlertPopup.body'}/>;
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body}/>;
};

export const getSellLandConfirmAlertPopup = (modalAlertPopup, onHandleSellLand, handleHideAlertPopup) => {
    console.log('sell LANd===============================')
    const modal = modalAlertPopup;
    const mode = "question"; //question //info //customize
    const header = <TranslateLanguage direct={'alert.getSellLandConfirmAlertPopup.header'}/>;
    const body = <TranslateLanguage direct={'alert.getSellLandConfirmAlertPopup.body'}/>;
    const yesBtn = () => onHandleSellLand();
    const noBtn = () => handleHideAlertPopup();
    return <MessageBox modal={modal} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body}/>;
};

//sell land success
export const getSellLandSuccessAlertPopup = (modalAlertPopup, onHandleClosePopup , gotoSellLand , reloadlandInCategoryDetail ) => {
    const modal = modalAlertPopup;
    const mode = "question"; //question //info //customize
    const sign = "success"; //blood //success //error //delete //loading
    const yesBtn = () => gotoSellLand();
    const noBtn = () => {
        reloadlandInCategoryDetail();
        onHandleClosePopup()};
    const header = <TranslateLanguage direct={'alert.getSellLandSuccessAlertPopup.header'}/>;
    const body = <TranslateLanguage direct={'alert.getSellLandSuccessAlertPopup.body'}/>;
    return <MessageBox modal={modal} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} sign={sign} />;
};


