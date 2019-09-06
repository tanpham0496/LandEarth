//alert function
import React from "react";
import TranslateLanguage from './../../general/TranslateComponent';
import MessageBox from './../../general/MessageBox';


//trong cay o day khong duoc
export const getPlantingUnsuccessAlert = ( handleHideAlertPopup , onHandleGetQuadKeyBitamin) => {
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => {
        // handleHideAlertPopup('wrongLandAlert');
        onHandleGetQuadKeyBitamin()
    };
    const header = <TranslateLanguage direct={'alert.getPlantingUnsuccessAlert.header'}/>
    const body = <TranslateLanguage direct={'alert.getPlantingUnsuccessAlert.body'}/>
    return <MessageBox  mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body}/>;
};









//Loading
export const loadingPopup = () => {
    const sign = "loading"; //blood //success //error //delete //loading
    const header = <TranslateLanguage direct={'alert.loadingPopup.header'}/>;
    const body = <TranslateLanguage direct={'alert.loadingPopup.body'}/>;
    return <MessageBox  sign={sign} header={header} body={body}/>;
};


//check for sale status alert for item
export const checkForSaleStatusAlertForItemPopup = (handleHideAlertPopup) => {
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHideAlertPopup();
    const header = <TranslateLanguage direct={'alert.checkForSaleStatusAlertForItemPopup.header'}/>;
    const body = <TranslateLanguage direct={'alert.checkForSaleStatusAlertForItemPopup.body'}/>;
    return <MessageBox mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body}/>;
};

//Alert check tree already dead
export const getLeftWaterDeadAlertPopup = ( handleHidePopup) => {
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHidePopup();
    const header = <TranslateLanguage direct={'alert.getLeftWaterDeadAlertPopup.header'}/>
    const body = <TranslateLanguage direct={'alert.getLeftWaterDeadAlertPopup.body'}/>
    return <MessageBox  mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body}/>;

};

//reacharge popup alert
export const getRechargeAlertPopup = ( handleHidePopup) => {
    const mode = "info"; //question //info //customize
    const sign = "error"; //blood //success //error //delete //loading
    const confirmBtn = () => handleHidePopup();
    const header = <TranslateLanguage direct={'alert.getRechargeAlertPopup.header'}/>
    const body = <TranslateLanguage direct={'alert.getRechargeAlertPopup.body'}/>
    return <MessageBox mode={mode} sign={sign} confirmBtn={confirmBtn} header={header} body={body}/>;
};

