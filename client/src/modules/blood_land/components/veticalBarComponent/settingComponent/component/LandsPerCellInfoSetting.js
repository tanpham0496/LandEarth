import React, { Fragment } from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {settingActions} from "../../../../../../store/actions/commonActions/settingActions";
import {turnOnImage} from "../asset";
import TranslateLanguage from "../../../general/TranslateComponent";
import _ from 'lodash';

function LandsPerCellInfoSetting(props) {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.authentication);
    const { landsPerCellInfo } = useSelector(state => state.settings);
    return (
        <Fragment>
            { _.isBoolean(landsPerCellInfo) &&
            <div className='setting-row margin-top-20'>
                <div>
                    <TranslateLanguage direct={'menuTab.setting.landsPerCellInfo'}/>
                </div>
                <div className='switch-control' onClick={() => dispatch(settingActions.setLandsPerCellInfo({ userId: user._id, landsPerCellInfo: !landsPerCellInfo })) }>
                    {landsPerCellInfo ? <div className='switch-content-on'>ON</div> : <div className='switch-content-off'>OFF</div>}
                    <img className={`switch-btn ${landsPerCellInfo ? 'on' : ''}`} src={turnOnImage} alt=''/>
                </div>
            </div>}
        </Fragment>
    );
}

export default LandsPerCellInfoSetting;