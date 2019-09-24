import React, {Fragment} from "react";
import {
    TranslateLanguage,
    loadingImage
} from '../../../../../../helpers/importModule';
import Tooltip from "../../../general/Tooltip";

export const getNoInfoView = (PREVIOUS_SCREEN, handleChangeScreen) => {
    return (
        <Fragment>
            <div className='screen-content-error'>
                <div className='warning'>
                    <div className="lnr lnr-warning lnr-custom-close"/>
                    <TranslateLanguage direct={'menuTab.myLand.landOwned.noInformation'}/>
                </div>
            </div>
            <div className='action-group'>
                <button onClick={() => PREVIOUS_SCREEN && handleChangeScreen(PREVIOUS_SCREEN.default)}>
                    <img src={loadingImage('/images/game-ui/sm-back.svg')} alt=''/>
                    <div>
                        <TranslateLanguage direct={'menuTab.myLand.landOwned.back'}/>
                    </div>
                    <Tooltip descLang={'menuTab.myLand.landOwned.toolTip.backButton'}/>
                </button>
            </div>
        </Fragment>
    );
};

export const loading = (type) => {
    return (
        <div className='load-land'>
            <div className='load__icon-wrap'>
                <div className="lds-roller">
                    <div/>
                    <div/>
                    <div/>
                    <div/>
                    <div/>
                    <div/>
                    <div/>
                    <div/>
                </div>
            </div>
        </div>
    )
};

export const loadingComponent = () => {
    return (
        <div className='load-land' style={{height: '33rem', top: '25%'}}>
            <div className='load__icon-wrap'>
                <div className="lds-roller">
                    <div/>
                    <div/>
                    <div/>
                    <div/>
                    <div/>
                    <div/>
                    <div/>
                    <div/>
                </div>
                <div style={{marginTop: '1rem'}}>
                    <TranslateLanguage direct={'alert.loadingPopup.body'}/>
                </div>

            </div>
        </div>
    )
};

export const loadingImg = (ref) => {
    return (
        <div ref={ref} className="lds-ellipsis img-loading">
            <div/>
            <div/>
            <div/>
            <div/>
        </div>
    )
};

export const loadingLandList = () => {
    return (
        <div style={{display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'}}>
            <div className="lds-ellipsis" style={{height: '26px'}}>
                <div style={{top: '7px'}}/>
                <div style={{top: '7px'}}/>
                <div style={{top: '7px'}}/>
                <div style={{top: '7px'}}/>
            </div>
            {/*<div>*/}
            {/*    <TranslateLanguage direct={'alert.loadingPopup.body'}/>*/}
            {/*</div>*/}
        </div>

    )
};
