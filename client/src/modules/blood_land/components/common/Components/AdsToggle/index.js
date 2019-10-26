import React, {Fragment, useState} from "react"
import {connect} from "react-redux";
import {Modal} from 'reactstrap';
import {screenActions} from "../../../../../../store/actions/commonActions/screenActions";
import {loadingImage} from "../../../general/System";
import TranslateLanguage from "../../../general/TranslateComponent";

import TabNotificationDevelopment from './component/TabNotificationDevelopment'
import {developmentalAction} from "../../../../../../store/actions/commonActions/developActions";
import {notificationAction} from "../../../../../../store/actions/commonActions/notifyActions";

function NotificationBlood (props){
    const [tab, setTab] = useState(1);
    const [changeType, setChangeType] = useState('Notify');
    const onHandleChangeTab = (Tab, type) => {
        setTimeout(()=> {
            props.removePopup({name: 'filterGlobar'});
            type === 'Develop' && props.getDevelopment(props.user._id);
            type === 'Notify' && props.getNotification(props.user._id);
        }, 0.001);
        setChangeType(type);
        setTab(Tab);

    };
    const tabList = [
        {
            name : 'NOTIFICATION',
            tabCode: 1,
            type: 'Notify'
        },
        {
            name : 'DEVELOPMENT',
            tabCode: 2,
            type: 'Develop'
        }
    ];
    const haveNotify = props.notifies && props.notifies.length > 0 && props.notifies.filter(nt => nt.read === false);
    const haveDevelop = props.develops && props.develops.length > 0 && props.develops.filter(dv => dv.read === false);
    return (
        <Fragment>
            <Modal isOpen={true} backdrop="static" className={`custom-modal modal--notice`}>
                <div className='modal-header--notice'>
                    <img src={loadingImage('/images/bloodLandNew/func/Notify.png')} />
                    <span>
                        <TranslateLanguage direct={'menuTab.user.notify'}/>
                    </span>
                    <div className={'close-popup'} onClick={() =>{props.removePopup({name : "NotificationBlood"}); props.removePopup({name : "filterGlobar"})} }>
                        <img className="image-zoom-in" src={loadingImage('/images/bloodLandNew/func/zoom-in.png')} />
                    </div>
                </div>
                <div className='custom-modal-body modal-body--notice'>
                    <div className="tab-notice-container">
                        {tabList.map((value,index) => {
                            const {name, tabCode,type} = value;
                            return(
                                <div className={`tab-notice ${tab === tabCode && 'active'}`}  key={index}
                                     onClick={() => onHandleChangeTab(tabCode,type)}>
                                    {haveNotify && haveNotify.length > 0 && type === "Notify" && <div className={'has-new'}> New </div>}
                                    {haveDevelop && haveDevelop.length > 0 && type === "Develop" && <div className={'has-new'}> New </div>}
                                    {name}
                                </div>
                            )

                        })}
                    </div>
                    {tabList.map((value,index) => {
                        const {type} = value;
                        return(
                            type === changeType && <div className='notice-tabs' key={index}>
                                <TabNotificationDevelopment type={type}/>
                            </div>
                        )
                    })}
                </div>
            </Modal>
        </Fragment>
    )
}

export default connect(
    state => {
        const { authentication: {user},notify : {notifies},develop : {develops}} = state;
        return {
            user,
            notifies,
            develops
        };
    }
    ,dispatch => ({
        removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
        getDevelopment: (id) => dispatch(developmentalAction.getById(id)),
        getNotification: (id) => dispatch(notificationAction.getById(id)),
    }))(NotificationBlood)
