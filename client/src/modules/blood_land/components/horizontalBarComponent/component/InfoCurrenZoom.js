import React, { Fragment } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { common } from '../../../../../helpers/importModule';
import TranslateLanguage from '../../general/TranslateComponent';
import { DEFAULT_LEVEL_OFFSET, DEFAULT_LAND_LEVEL_OFFSET, MAX_LEVEL } from '../../../../../helpers/constants';
import { settingLandInfo } from '../../../../../helpers/config';

function InfoCurrentZoom(props){
    const { zoom } = useSelector(state => state.map);
    const loading = () => {
        return (
            <div className="lds-ellipsis">
                <div/>
                <div/>
                <div/>
                <div/>
            </div>
        )
    };

    return (
        <div className='info-curent-zoom'>
            { zoom
                ?   <Fragment>
                        {/*<div>
                                                    <TranslateLanguage direct={'infoCurrentZoom.zoom'}/> 
                                                    <span>:</span>
                                                    <span>{ zoom + DEFAULT_LAND_LEVEL_OFFSET }</span>
                                                </div>*/}
                        <div>
                            <TranslateLanguage direct={'infoCurrentZoom.amountOfLandPerCell'}/> 
                            <span>:</span>
                            <span>{ 4**(MAX_LEVEL - (zoom + DEFAULT_LEVEL_OFFSET)) }</span>
                        </div>
                    </Fragment>
                :   <span>{loading()}</span>
            }
        </div>
    )
}
export default InfoCurrentZoom;