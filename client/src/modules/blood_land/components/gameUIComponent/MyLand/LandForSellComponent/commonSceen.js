import React ,{Fragment} from 'react'
import {TranslateLanguage, loadingImage }from '../../../../../../helpers/importModule';
export const loading = () => {
    return (
        <div className='land-sale-warning-screen'>
            <div className='screen-loading'>
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

export const getNoInfoView = (onSaleLandButtonClick) => {
    return (
        <Fragment>
            <div className='land-sale-warning-screen'>
                <div className='warning'><div className="lnr lnr-warning lnr-custom-close"/>
                    <TranslateLanguage direct={'menuTab.myLand.landSold.noInformation'}/>
                </div>
            </div>
            <div className='action-group'>
                <button onClick={() => onSaleLandButtonClick('back')}>
                    <img src={loadingImage('/images/game-ui/sm-back.svg')} alt=''/>
                    <div>
                        <TranslateLanguage direct={'menuTab.myLand.landSold.back'}/>
                    </div>
                </button>
            </div>
        </Fragment>
    );
};