import React  from 'react';
import TranslateLanguage from "../../../general/TranslateComponent";
import MessageBox from './../../../general/MessageBox';

export const alertPopupScreen = {
    noPopup: 'noPopup',
    deletedLandAlert: 'deletedLandAlert',
    purchaseLandConfirmAlert: 'purchaseLandConfirmAlert',
    waitingAlert: 'waitingAlert', //cho
    successAlert: 'successAlert',
    errorAlert: 'errorAlert',
    noLandAlert: 'noLandAlert',
    addCartAlert: 'addCartAlert',
    addCartSuccessAlert: 'addCartSuccessAlert',
    reLoginAlert: 'reLoginAlert',
    noSelectedAlert: 'noSelectedAlert',
    waitingNoBlockAlert: 'waitingNoBlockAlert', //c
    notEnoughBloodAlert: 'notEnoughBloodAlert',
    folderNameEmptyAlertPopup: 'folderNameEmptyAlertPopup'
};

export const getValidateAlertPopup = (modalAlertPopup,hidePopupAnClearError,error) => {
    const modal = modalAlertPopup;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => hidePopupAnClearError();
    const header = <TranslateLanguage direct={'menuTab.transaction.buyLand.alert.getValidateAlertPopup.header'}/>;
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={error}/>;
};

export const getPurchaseLandConfirmAlertPopup = (modalAlertPopup,confirmLandPurchase,handleHideAlertPopup) => {
    const modal = modalAlertPopup;
    const mode = "question"; //question //info //customize
    const yesBtn = () => confirmLandPurchase();
    const noBtn = () => handleHideAlertPopup();
    const header = <TranslateLanguage
        direct={'menuTab.transaction.buyLand.alert.getPurchaseLandConfirmAlertPopup.header'}/>;
    const body = <TranslateLanguage
        direct={'menuTab.transaction.buyLand.alert.getPurchaseLandConfirmAlertPopup.body'}/>;
    return <MessageBox modal={modal} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body}/>;
};

export const getNoSelectedAlert = (modalAlertPopup,handleHideAlertPopup) => {
    const modal = modalAlertPopup;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHideAlertPopup();
    const header = <TranslateLanguage direct={'menuTab.transaction.buyLand.alert.getNoSelectedAlert.header'}/>;
    const body = <TranslateLanguage direct={'menuTab.transaction.buyLand.alert.getNoSelectedAlert.body'}/>;
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body}/>;
};

export const getNotEnoughBloodAlertPopup = (modalAlertPopup,handleHideAlertPopup) => {
    const modal = modalAlertPopup;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHideAlertPopup();
    const header = <TranslateLanguage
        direct={'menuTab.transaction.buyLand.alert.getNotEnoughBloodAlertPopup.header'}/>;
    const body = <TranslateLanguage direct={'menuTab.transaction.buyLand.alert.getNotEnoughBloodAlertPopup.body'}/>;
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body}/>;
};

export const getWaitingAlertPopup = (modalAlertPopup) => {
    const modal = modalAlertPopup;
    const sign = "loading"; //blood //success //error //delete //loading
    const header = <TranslateLanguage direct={'menuTab.transaction.buyLand.alert.getWaitingAlertPopup.header'}/>;
    const body = <TranslateLanguage direct={'menuTab.transaction.buyLand.alert.getWaitingAlertPopup.body'}/>;
    return <MessageBox modal={modal} sign={sign} header={header} body={body}/>
};

export const getDeletedLandAlertPopup = (modalAlertPopup,confirmDeleteSelectedLand,handleHideAlertPopup) => {
    const modal = modalAlertPopup;
    const mode = "question"; //question //info //customize
    const yesBtn = () => confirmDeleteSelectedLand();
    const noBtn = () => handleHideAlertPopup();
    const sign = "delete"; //blood //success //error //delete //loading
    const header = <TranslateLanguage
        direct={'menuTab.transaction.buyLand.alert.getDeletedLandAlertPopup.header'}/>;
    const body = <TranslateLanguage direct={'menuTab.transaction.buyLand.alert.getDeletedLandAlertPopup.body'}/>;
    return <MessageBox modal={modal} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body}
                       sign={sign}/>;
};

export const getWaitingNoBlockAlertPopup = (modalAlertPopup,hideAndRefreshPage) => {
    const modal = modalAlertPopup;
    const mode = "info"; //question //info //customize
    const sign = "loading"; //blood //success //error //delete //loading
    const confirmBtn = () => hideAndRefreshPage();
    const header = <TranslateLanguage
        direct={'menuTab.transaction.buyLand.alert.getWaitingNoBlockAlertPopup.header'}/>;
    const body = <TranslateLanguage direct={'menuTab.transaction.buyLand.alert.getWaitingNoBlockAlertPopup.body'}/>;
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body}/>;
};

export const getFolderNameEmptyAlertPopup = (modalAlertPopup,handleHideAlertPopup) => {
    const modal = modalAlertPopup;
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHideAlertPopup();
    const header = <TranslateLanguage
        direct={'menuTab.transaction.buyLand.alert.getFolderNameEmptyAlertPopup.header'}/>;
    const body = <TranslateLanguage
        direct={'menuTab.transaction.buyLand.alert.getFolderNameEmptyAlertPopup.body'}/>;
    return <MessageBox modal={modal} mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body}/>;
};

export const getReLoginAlertPopup = (modalAlertPopup,bloodAppId, handleHideAllPopup) => {
    const modal = modalAlertPopup;
    const mode = "question"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const yesBtn = () => window.location.href = 'https://wallet.blood.land/sns/logout/ext?appId=' + bloodAppId;
    const noBtn = () => handleHideAllPopup();
    const header = <TranslateLanguage direct={'menuTab.transaction.buyLand.alert.getReLoginAlertPopup.header'}/>
    const body = <TranslateLanguage direct={'menuTab.transaction.buyLand.alert.getReLoginAlertPopup.body'}/>
    return <MessageBox modal={modal} mode={mode} sign={sign} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} />;
};