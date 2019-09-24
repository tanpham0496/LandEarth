import TranslateLanguage from "./components/general/TranslateComponent";
import React from "react";
import MessageBox from './components/general/MessageBox';
import { bloodAppId } from '../../helpers/config';

export const alertPopup = {
    chromeDetectedAlert: "chromeDetectedAlert",
    noPopup: "noPopup",
    wIdAlert: "wIdAlert",
    tokenErrorAlert: 'tokenErrorAlert'
};

export const getTokenErrorAlert = () => {
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => process.env.NODE_ENV === 'development' ? window.location.href = 'http://localhost:3000/login' : window.location.href = 'https://wallet.blood.land/sns/logout/ext?appId=' + bloodAppId;
    const header = <TranslateLanguage direct={'alert.getTokenErrorAlert.header'}/>;
    const body = <TranslateLanguage direct={'alert.getTokenErrorAlert.body'}/>;
    return <MessageBox mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
};


export const getChromeDetectAlert = (chromeDetectedAlertStatus) => {
    const modal = chromeDetectedAlertStatus;
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => this.handleHideAlertPopup();
    const header = <TranslateLanguage direct={'alert.getWIdExistAlert.header'}/>;
    const body = <TranslateLanguage direct={'alert.getChromeDetectAlert.body'}/>;
    return <MessageBox modal={modal} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
};

export const getWIdExistAlert = (wIdExistAlert) => {
    const modal = wIdExistAlert;
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => window.location.href = 'https://wallet.blood.land';
    const header = <TranslateLanguage direct={'alert.getWIdExistAlert.header'}/>;
    const body = <TranslateLanguage direct={'alert.getWIdExistAlert.body'}/>;
    return <MessageBox modal={modal} sign={sign} confirmBtn={confirmBtn} header={header} body={body} />;
};