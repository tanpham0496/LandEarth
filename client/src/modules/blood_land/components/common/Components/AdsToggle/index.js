import React, {Fragment, useState} from "react"
import {connect} from "react-redux";
import {Modal} from 'reactstrap';
import {screenActions} from "../../../../../../store/actions/commonActions/screenActions";
import {loadingImage} from "../../../general/System";
import TranslateLanguage from "../../../general/TranslateComponent";
import TabDevelop from "./component/TabDevelop"
import TabNotification from "./component/TabNotification"
import {developmentalAction} from "../../../../../../store/actions/commonActions/developActions";
import {notificationAction} from "../../../../../../store/actions/commonActions/notifyActions";

function NotificationBlood (props){
    const [tab, setTab] = useState(1);
    const onHandleChangeTab = (Tab) => {
        setTimeout(()=> {
            props.removePopup({name: 'filterGlobar'});
            props.getDevelopment();
            props.getNotification();
        }, 0.001);
        setTab(Tab);
    };
    return (
        <Fragment>
            <Modal isOpen={true} backdrop="static" className={`custom-modal modal--notice`}>
                <div className='custom-modal-header'>
                    <img src={loadingImage('/images/game-ui/tab1/nav1.svg')} />
                    <span>
                        <TranslateLanguage direct={'menuTab.user.notify'}/>
                    </span>
                    <span className="lnr lnr-cross lnr-custom-close" onClick={() =>{props.removePopup({name : "NotificationBlood"}); props.removePopup({name : "filterGlobar"})} }/>
                </div>
                <div className='custom-modal-body'>
                    <div className="tab-inventory-container">
                        <div className={`tab-inventory ${tab === 1 && 'active'}`}
                             onClick={() => onHandleChangeTab(1)}>
                            Notification
                        </div>
                        <div className={`tab-inventory ${tab === 2 && 'active'}`}
                             onClick={() => onHandleChangeTab(2)}
                        >
                            Development
                        </div>
                    </div>
                    {tab === 1 &&
                        <div className='notice-tabs'>
                            <TabNotification />
                        </div>
                    }
                    {tab === 2 &&
                        <div className='notice-tabs'>
                             <TabDevelop />
                        </div>
                    }
                </div>
                {/*<div className='custom-modal-footer-action-group'>*/}
                {/*    <button onClick={() =>{props.removePopup({name : "NotificationBlood"}); props.removePopup({name : "filterGlobar"})} }>*/}
                {/*        <TranslateLanguage direct={'adsNotice.closeBtn'}/>*/}
                {/*    </button>*/}
                {/*</div>*/}
            </Modal>
        </Fragment>
    )
}

export default connect(
    null
    ,dispatch => ({
        removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
        getDevelopment: () => dispatch(developmentalAction.get()),
        getNotification: () => dispatch(notificationAction.get()),
    }))(NotificationBlood)
