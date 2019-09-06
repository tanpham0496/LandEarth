import React, {Fragment, useState, useEffect} from "react"
import {connect} from "react-redux";
import {screenActions} from "../../../../../../../store/actions/commonActions/screenActions";
import TranslateLanguage from "../../../../general/TranslateComponent";
import {RadioButton} from 'primereact/radiobutton';
import {notificationAction} from "../../../../../../../store/actions/commonActions/notifyActions";
import {Editor} from "primereact/editor";
import ListFormNotice from "./ListFormNotice";

function TabNotification(props){
    const {notifies,user : {role}} = props;

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Normal');
    const [editorState, setEditorState] = useState('');

    useEffect(()=> {
        props.getNotification();
    }, []);
    useEffect(()=> {

    }, [notifies]);
    
    const handleCreateNotice = () => {
        const data = {
            title,
            content : editorState,
            userName : props.user.email,
            category
        };
        props.handleCreateNotice(data);
        setTimeout(()=> {
            props.getNotification();
        },0.0001);
        setTitle('');
        setCategory('Normal');
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

    return(
        <Fragment>
            {role === 'manager' &&
            <div className='form'>
                <div className='title-input-notice'>
                    <input maxLength={50} className='title-content' type={'text'} value={title} onChange={(e) => setTitle(e.target.value)} placeholder={'제목을 입력하세요.(35자 이내)'} />
                    <div className={'RadioButton-notice'}>
                        {ItemListNotice.map((value,ind) => {
                            return(
                                <span key={ind} >
                                  <RadioButton   inputId="rb2" name={value.type} value={value.type} onChange={(e) =>setCategory( e.value)} checked={category === value.type}/> {value.name}
                              </span>
                            )
                        })}

                    </div>
                    <div className='description-notice'>
                        <Editor  style={{height:'320px'}} value={editorState}
                                 onTextChange={(e)=>setEditorState({editorState: e.htmlValue})}
                                 placeholder={'내용을 입력하세요.(1000자 이내)'}
                        />
                    </div>
                    <button className="post" onClick={()=> title.length > 0 &&  handleCreateNotice()}>   <TranslateLanguage direct={'adsNotice.save'}/> </button>

                </div>

            </div> }
            <div>
                <ListFormNotice notifies={props.notifies}/>
            </div>
        </Fragment>
    )
}
export default connect(
    state => {
        const { authentication: {user}, notify : {notifies}} = state;
        return {
            user, notifies
        };
    }
    ,dispatch => ({
        removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
        handleCreateNotice: (data) => dispatch(notificationAction.createByAdmin(data)),
        // getNotificationById: (userId) => dispatch(notificationAction.getById(userId)),
        getNotification: () => dispatch(notificationAction.get())
    }))(TabNotification)
