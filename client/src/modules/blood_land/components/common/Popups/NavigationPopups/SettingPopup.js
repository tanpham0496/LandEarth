import React from 'react'
import {connect} from 'react-redux'
import {Modal} from 'reactstrap';
import TranslateLanguage from "../../../general/TranslateComponent";
import Setting from "../../../veticalBarComponent/settingComponent/SettingScreen";
import {screenActions} from "../../../../../../store/actions/commonActions/screenActions";

const SettingPopup = (props) => {
    const {removePopup} = props;
    return(
        <Modal isOpen={true} backdrop="static" className={`custom-modal modal--setting`}>
            <div className='custom-modal-header'>
                <TranslateLanguage direct={'menuTab.setting'}/>
                <span className="lnr lnr-cross lnr-custom-close" onClick={() => removePopup({name: 'SettingTab'})}/>
            </div>
            <div className='custom-modal-body'>
                <Setting/>
            </div>
            {/* Ver. 0.1.1903261400 */}
            {process.env.VERSION_DATE_NOW}
            <div style={{fontSize: '10px', color: 'rgba(36,36,36,0.5)'}}>{process.env.VERSION_TIME}</div>
            <div className='custom-modal-footer'>
                <button onClick={() => removePopup({name: 'SettingTab'})}>
                    <TranslateLanguage direct={'menuTab.setting.close'}/>
                </button>
            </div>
        </Modal>
    )
};

const mapDispatchToProps = (dispatch) => ({
    removePopup: screen => dispatch(screenActions.removePopup(screen))
});

export default connect(null , mapDispatchToProps)(SettingPopup)