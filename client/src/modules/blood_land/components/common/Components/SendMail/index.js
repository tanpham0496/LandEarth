import React, {Fragment, Component} from 'react';
import connect from "react-redux/es/connect/connect";
import {userActions} from "../../../../../../store/actions/commonActions/userActions";
import {Modal} from 'reactstrap';
import {loadingImage} from "../../../general/System";
import TranslateLanguage from "../../../general/TranslateComponent";
import {translate} from "react-i18next";
import {onHandleTranslate} from "../../../../../../helpers/Common";
import {screenActions} from "../../../../../../store/actions/commonActions/screenActions";
import SendMailSuccessAlert from './component/SendMailSuccessAlert'
import SendMailFailedAlert from './component/SendMailFailedAlert'
import MailValidateAlert from './component/MailValidateAlert'
import LoadingPopup from '../../Popups/commomPopups/LoadingPopup'
import _ from 'lodash'
import {StyledInputTextArea} from '../../../../../../components/customStyled/TextArea_style';

const senMailButtonList = [
    {
        type: 'sendMailButton',
        image: loadingImage('/images/game-ui/sm-send.svg'),
        name: <TranslateLanguage direct={'menuTab.user.email.sendMailButton'}/>
    },
    {
        type: 'cancelButton',
        image: loadingImage(`/images/game-ui/sm-close.svg`),
        name: <TranslateLanguage direct={'menuTab.user.email.cancelButton'}/>
    }
];

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            currentPopupScreen: this.popupScreen.noPopup,
            emailContent: '',
            title: '',
            toId: '', toName: ''
        };
    }

    popupScreen = {
        noPopup: 'noPopup',
        successReply: 'successReply',
        errorReply: 'errorReply',
        error: 'error',
        cancelConfirm: 'cancelConfirm',
        loading: 'loading'
    };


    componentDidUpdate(prevProps, prevState) {
        const {success, addPopup} = this.props;
        if (success && !_.isEqual(success, prevProps.success)) {
            setTimeout(() => {
                addPopup({name: success ? 'SendMailSuccessAlert' :'SendMailFailedAlert' , close: 'LoadingPopup' , data: {handleCloseAllPopup: this.handleCloseAllPopup}})
            }, 500)
        }
    }

    handleChangeScreen = (screen) => {
        this.setState({
            currentScreen: screen,
        });
    };

    handleShowPopup = (popupScreen, id) => {
        this.setState({
            mailDetailId: id,
            currentPopupScreen: popupScreen,
            modal: true,
        });
    };

    handleHidePopup = () => {
        this.setState({
            currentPopupScreen: this.popupScreen.noPopup,
            modal: false,
        });
    };





    render() {
        const defaultScreen = this.getDefaultScreen();
        const alertModalPopup = this.getAlertModalPopup();
        return (
            <Fragment>
                {defaultScreen}
                {alertModalPopup}
            </Fragment>
        );
    }

    handleCloseMailPopup = () => {
        this.setState({
            emailContent: null,
            title: null
        });
        this.props.handleHideSendMailPopup()
    };
    sendMail = () => {
        const {user: {_id, userName}, friendList, toId, toName} = this.props;
        const {emailContent, title} = this.state;
        const mails = [];
        if (friendList) {
            for (let f of friendList) {
                if (f.checked) {
                    let param = {
                        title,
                        content: emailContent,
                        fromId: _id,
                        fromName: userName,
                        toId: f.friend.userId,
                        toName: f.friend.name
                    };
                    mails.push(param)
                }
            }
            this.props.sendMail(mails);
        } else {
            const param = {
                title,
                content: emailContent,
                fromId: _id,
                fromName: userName,
                toId: toId,
                toName: toName
            };
            this.props.sendMail([param]);
        }
        this.props.addPopup({name: 'LoadingPopup'})
    };
    onHandleClickButton = (type) => {
        const {title, emailContent} = this.state;
        const {addPopup} = this.props;
        if (type === 'sendMailButton') {
            const titleValidation = title === '' || !title;
            const contentValidation = emailContent === null || !emailContent;
            const validationMail = [titleValidation, contentValidation];
            validationMail.some(t => t) ?
                addPopup({name: 'MailValidateAlert', data: {titleValidation, contentValidation}}) :
                this.sendMail();
        }
    };


    getDefaultScreen = () => {
        const {emailContent, title} = this.state;
        const {friendList, toName} = this.props;
        const friendListFilter = friendList && friendList.filter(f => f.checked);
        const {t, settingReducer: {language}, lng} = this.props;
        const placeholderTitle = onHandleTranslate(t, "alert.sendMailPopup.placeHolderTitle", language, lng);
        const placeholderContent = onHandleTranslate(t, "alert.sendMailPopup.placeHolderContent", language, lng);
        return (
            <Modal isOpen={this.props.sendMailModal} backdrop="static" className={`custom-modal modal--send-mail`}>
                <div className='custom-modal-header'>
                    <img src={loadingImage('/images/bloodland-ui/title-icon-edit-mail.png')} alt=''/>
                    <TranslateLanguage direct={'alert.sendMailPopup.header'}/>
                    <span className="lnr lnr-cross lnr-custom-close" onClick={() => this.handleCloseMailPopup()}/>
                </div>
                <div className='custom-modal-body'>
                    <div className='title-mail'>
                        <div className='to-user'>
                            {friendListFilter ? friendListFilter.map((item, index) => {
                                const {friend: {name}} = item;
                                return (
                                    <div className='to-user-name' key={index}>{name}</div>
                                )
                            }) : <div className='to-user-name'>{toName}</div>}
                        </div>

                        <div className='break-y'/>
                        <input maxLength={15} placeholder={placeholderTitle} className='title-content' value={title ? title : ''}
                               onChange={(e) => this.setState({title: e.target.value})}/>
                    </div>
                    <div className='body-mail'>
                        <StyledInputTextArea rows={20} cols={75} autoResize={true}
                                             placeholder={placeholderContent}
                                             maxLength={200}
                                             value={emailContent}
                                             onChange={(e) => this.setState({emailContent: e.target.value})} />
                    </div>
                </div>
                <div className='custom-modal-footer-action-group'>
                    {senMailButtonList.map((item, value) => {
                        const {name, type, image} = item;
                        return (
                            <button key={value} onClick={() => this.onHandleClickButton(type)}>
                                <img src={image} alt={type}/>
                                <div>{name}</div>
                            </button>
                        )
                    })}
                </div>
            </Modal>
        )
    };

    getAlertModalPopup = () => {
        const {screens} = this.props;
        return (
            <Fragment>
                {screens['SendMailSuccessAlert'] && <SendMailSuccessAlert />}
                {screens['SendMailFailedAlert'] && <SendMailFailedAlert/>}
                {screens['MailValidateAlert'] && <MailValidateAlert/>}
                {screens['LoadingPopup'] && <LoadingPopup/>}
            </Fragment>
        );
    };


    handleCloseAllPopup = () => {
        this.setState({emailContent: null, title: null});
        this.props.resetSentStatus();
        this.props.handleHideSendMailPopup();
        this.handleHidePopup();
    }

}

function mapStateToProps(state) {
    const {authentication, users: {success}, settingReducer, screens} = state;
    const {user} = authentication;
    return {
        user,
        success,
        screens,
        settingReducer
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        sendMail: (param) => dispatch(userActions.sendMail(param)),
        resetSentStatus: () => dispatch(userActions.resetSentStatus()),
        addPopup: (screen) => dispatch(screenActions.addPopup(screen))
    };
};

const connectedPage = connect(mapStateToProps, mapDispatchToProps)(Index);
export default (translate('common')(connectedPage));
