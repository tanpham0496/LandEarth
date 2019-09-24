import React, {Fragment, useState, useEffect} from "react"
import {connect} from "react-redux";
import {screenActions} from "../../../../../../../store/actions/commonActions/screenActions";
import TranslateLanguage from "../../../../general/TranslateComponent";
import {RadioButton} from 'primereact/radiobutton';
import {notificationAction} from "../../../../../../../store/actions/commonActions/notifyActions";
import {Editor} from "primereact/editor";
import ListFormNotice from "./ListFormNotice";
import ListFormDevelop from "./ListFormDevelop";
import {developmentalAction} from "../../../../../../../store/actions/commonActions/developActions";
import {onHandleTranslate} from "../../../../../../../helpers/Common";
import {translate} from "react-i18next";

function TabNotificationDevelopment(props){
    const {notifies, user : {role}, type, develops} = props;
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Normal');
    const [editorState, setEditorState] = useState('');
    const [categoryDev, setCategoryDev] = useState('Develop');
    const  [checkCreate, setCheckCreate] = useState(false);
  
    useEffect(()=> {
        //todo somthing
    }, [notifies,develops]);

    const handleCreateNew = () => {
        const data = {
            userId : props.user._id,
            title,
            content : editorState,
            nameAdmin : props.user.userName,
            category : (type === 'Notify' ? category : categoryDev)
        };
        if(type === 'Notify') {
            setTimeout(()=> {props.handleCreateNotice(data)},0.0001);
            setCategory('Normal');
        }
        else {
            setTimeout(()=> {props.handleCreateDevelop(data)},0.0001);
            setCategoryDev('Develop');
        }
        setCheckCreate(false)
        setTitle('');
        setEditorState('');
    };

    const ItemListNotice = [
        {
            name:  <TranslateLanguage direct={'adsNotice.classification.normal'}/>,
            type: 'Normal'
        },{
            name: <TranslateLanguage direct={'adsNotice.classification.update'}/>,
            type: 'Update'
        },{
            name: <TranslateLanguage direct={'adsNotice.classification.event'}/>,
            type: 'Event'
        }
    ];

    const ItemListDevelop = [
        {
            name: <TranslateLanguage direct={'adsNotice.development.develop'}/>,
            type: 'Develop'
        },{
            name: <TranslateLanguage direct={'adsNotice.development.bug'}/>,
            type: 'Fix Bug'
        }
    ];
    const {t , lng , settingReducer:{language}} = props;

    const placeholderTitle = onHandleTranslate(t, "adsNotice.noticePopup.placeHolderTitle", language, lng);
    const placeholderContent = onHandleTranslate(t, "adsNotice.noticePopup.placeHolderContent", language, lng);

    return(
        <Fragment>
            {role === 'editor' &&
                <div className='form'>
                    <div className='title-input-notice'>
                        <input maxLength={50} className='title-content' type={'text'} value={title} onChange={(e) => setTitle(e.target.value)} placeholder={placeholderTitle} />
                        {checkCreate && title.length < 3 && <div className={'checkCreateTitle'}>  <TranslateLanguage direct={'adsNotice.noticePopup.checkTitle'} /></div> }
                        <div className={'RadioButton-notice'}>
                            {type === 'Notify' ? ItemListNotice.map((value,ind) => {
                                return(
                                    <span key={ind} >
                                      <RadioButton   inputId="rb2" name={value.type} value={value.type} onChange={(e) =>setCategory( e.value)} checked={category === value.type}/> {value.name}
                                  </span>
                                )
                            }) :
                            ItemListDevelop.map((value,index) => {
                                return(
                                    <span  key={index}>
                                  <RadioButton inputId="rb2" name={value.type} value={value.type} onChange={(e) =>setCategoryDev( e.value)} checked={categoryDev === value.type}/> {value.name}
                              </span>
                                )
                            })
                            }
                        </div>
                        <div className='description-notice'>
                            <Editor  style={{height:'320px'}} value={editorState}
                                     onTextChange={(e)=>setEditorState({editorState: e.htmlValue})}
                                     placeholder={placeholderContent}
                            />
                            {checkCreate && (editorState.length === 0 || typeof editorState.length !== 'undefined') && <div className={'checkCreateContent'}>  <TranslateLanguage direct={'adsNotice.noticePopup.checkContent'} /></div> }
                        </div>

                        <button className="post" onClick={()=>{ setCheckCreate(true); title.length !== 0 && editorState.length !== 0  && handleCreateNew()} }>   <TranslateLanguage direct={'adsNotice.save'}/> </button>
                    </div>
                </div>
            }
            { type === 'Notify' ? <ListFormNotice notifies={props.notifies}/> : <ListFormDevelop /> }
        </Fragment>
    )
}
export default connect(
    state => {
        const { authentication: {user}, notify : {notifies},develop : {develops},settingReducer} = state;
        return {
            user, notifies,develops ,settingReducer
        };
    }
    ,dispatch => ({
        removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
        handleCreateNotice: (data) => dispatch(notificationAction.createByAdmin(data)),
        getNotification: (id) => dispatch(notificationAction.getById(id)),
        handleCreateDevelop: (data) => dispatch(developmentalAction.createByAdmin(data)),
        getDevelopment: (id) => dispatch(developmentalAction.getById(id)),
    }))(translate('common')(TabNotificationDevelopment))
