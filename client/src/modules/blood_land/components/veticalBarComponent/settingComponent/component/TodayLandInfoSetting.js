import React, { Fragment } from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {settingActions} from "../../../../../../store/actions/commonActions/settingActions";
import {turnOnImage} from "../asset";
import TranslateLanguage from "../../../general/TranslateComponent";
import _ from 'lodash';

function TodayLandInfoSetting(props) {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.authentication);
    const { todayLandInfo } = useSelector(state => state.settings);
    return (
        <Fragment>
            { _.isBoolean(todayLandInfo) &&
            <div className='setting-row margin-top-20'>
                <div>
                    <TranslateLanguage direct={'menuTab.setting.todayLandInfo'}/>
                </div>
                <div className='switch-control' onClick={() => dispatch(settingActions.setTodayLandInfo({ userId: user._id, todayLandInfo: !todayLandInfo })) }>
                    {todayLandInfo ? <div className='switch-content-on'>ON</div> : <div className='switch-content-off'>OFF</div>}
                    <img className={`switch-btn ${todayLandInfo ? 'on' : ''}`} src={turnOnImage} alt=''/>
                </div>
            </div>}
        </Fragment>
    );
    
}
export default TodayLandInfoSetting;