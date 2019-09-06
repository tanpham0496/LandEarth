import React, {Component, Fragment} from 'react'
import {connect} from 'react-redux'
import {settingActions} from "../../../../../../store/actions/commonActions/settingActions";
import {turnOnImage} from "../asset";
import TranslateLanguage from "../../../general/TranslateComponent";
class LandSetting extends Component{
    onHandleClick = () => {
        const {settingReducer: {land:{showInfo}} , user: {_id}} = this.props;
        const landSettingParam = {
            userId: _id,
            land: {showInfo: !showInfo}
        };
        this.props.setLandShowInfo(landSettingParam)
    };
    render() {
        const {settingReducer: {land}} = this.props;
        return (
            <Fragment>
                {land &&
                <div className='setting-row margin-top-20'>
                    <div>
                        <TranslateLanguage direct={'menuTab.setting.mapInfo'}/>
                    </div>
                    <div className='switch-control' onClick={() => this.onHandleClick()}>
                        {land.showInfo ? <div className='switch-content-on'>ON</div> :
                            <div className='switch-content-off'>OFF</div>}
                        <img className={`switch-btn ${land.showInfo ? 'on' : ''}`}
                             src={turnOnImage} alt=''/>
                    </div>
                </div>}
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    const {settingReducer, authentication: {user}} = state;
    return {
        settingReducer,
        user
    };
};
const mapDispatchToProps = (dispatch) => ({
    setLandShowInfo: (setting) => dispatch(settingActions.setLandShowInfo(setting))
});
export default connect(mapStateToProps , mapDispatchToProps)(LandSetting)