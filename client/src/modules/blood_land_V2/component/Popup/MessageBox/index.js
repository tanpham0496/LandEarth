import React, {Fragment} from 'react';
import { Modal } from 'reactstrap';
import TranslateLanguage from "../../../../blood_land/components/general/TranslateComponent";
import {loadingImage} from "../../../../blood_land/components/general/System";

const successSign = loadingImage('/images/bloodLandNew/success-icon.png');
const errorSign = loadingImage('/images/bloodLandNew/error-icon.png');
const loadingSign = <div className="lds-roller"><div/><div/><div/><div/><div/><div/><div/><div/></div>;

const MessageBoxNew = (props) => {
    const {mode, confirmBtn, yesBtn, noBtn, header,body,sign } = props;

    const {closeBtn,firstBtn,secondBtn,thirdBtn} = props;
    return(
        <Fragment>                                                                     
            <Modal isOpen={true} backdrop="static" className={`modal-container`}>
                <div className='modal-header'>
                    {header}
                    { mode==='question' && noBtn  &&  <div className='button-header'>  <div className='button-return' onClick={noBtn}> <div className='icon-button'/> </div> </div> }
                    { mode==='info'  && confirmBtn  &&  <div className='button-header'>  <div className='button-return' onClick={confirmBtn}> <div className='icon-button'/> </div> </div> }
                    { mode==='customize'  && noBtn  &&  <div className='button-header'>  <div className='button-return' onClick={closeBtn}> <div className='icon-button'/> </div> </div>}
                    { mode==='error'  && confirmBtn  &&  <div className='button-header'>  <div className='button-return' onClick={confirmBtn}> <div className='icon-button'/> </div> </div>}
                </div>
                <div className={'modal-body'}>
                    {sign==='success' && <img src={successSign} alt='success'/>}
                    {sign==='error' && <img src={errorSign} alt='error'/>}
                    {sign==='loading' && loadingSign}
                    {body}
                </div>
                <div className={'modal-footer-list-btn'}>
                    {
                        mode==='question' &&
                        <div className='custom-modal-footer'>
                            <button onClick={yesBtn}><TranslateLanguage direct={'messageBox.yesBtn'}/></button>
                            <button onClick={noBtn} ><TranslateLanguage direct={'messageBox.noBtn'} /></button>
                        </div>
                    }
                    {
                        mode==='info' &&
                        <div>
                            <button onClick={confirmBtn}><TranslateLanguage direct={'messageBox.confirmBtn'}/></button>
                        </div>
                    }
                    {
                        mode==='customize' &&
                        <div className='custom-modal-footer' >
                            <button onClick={firstBtn.onClick}>{firstBtn.name}</button>
                            <button onClick={secondBtn.onClick}>{secondBtn.name}</button>
                            <button onClick={thirdBtn.onClick}>{thirdBtn.name}</button>
                        </div>
                    }
                </div>
            </Modal>
        </Fragment>
    )
};

export default MessageBoxNew;