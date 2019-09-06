import React, {Fragment, useState, useEffect} from "react"
import {connect} from "react-redux";
import {screenActions} from "../../../../../../../store/actions/commonActions/screenActions";
import TranslateLanguage from "../../../../general/TranslateComponent";
import {RadioButton} from 'primereact/radiobutton';
import {developmentalAction} from "../../../../../../../store/actions/commonActions/developActions";
import {Editor} from "primereact/editor";
import ListFormDevelop from "./ListFormDevelop";

function TabDevelop (props){

    const {user : {role}, develops} = props;
    const [titleDev, setTitleDev] = useState('');
    const [categoryDev, setCategoryDev] = useState('Future');
    const [editorStateDev, setEditorStateDev] = useState('');

    const handleCreateDevelop = () => {
        const data = {
            title: titleDev,
            content : editorStateDev ,
            userName : props.user.email,
            category: categoryDev
        };
        props.handleCreateDevelop(data);
        setTimeout(()=> {
            props.getDevelopment();
        },0.0001);
        setTitleDev('');
        setCategoryDev('Future');
        setEditorStateDev('');
    };

    useEffect(()=> {
        // props.getDevelopment();
    }, []);
    useEffect(()=> {

    }, [develops]);

    const ItemListDevelop = [
        {
            name: <TranslateLanguage direct={'adsNotice.development.develop'}/>,
            type: 'Develop'
        },{
            name: <TranslateLanguage direct={'adsNotice.development.bug'}/>,
            type: 'Fix Bug'
        }
    ];

    return(
       <Fragment>
           {role === 'manager' &&
           <div className='form'>
               <div className='title-input-notice'>
                   <input maxLength={50} className='title-content' type={'text'} value={titleDev} onChange={(e) => setTitleDev(e.target.value)} placeholder={'제목을 입력하세요.(35자 이내)'} />
                   <div className={'RadioButton-notice'}>
                       {ItemListDevelop.map((value,index) => {
                           return(
                               <span  key={index}>
                                  <RadioButton inputId="rb2" name={value.type} value={value.type} onChange={(e) =>setCategoryDev( e.value)} checked={categoryDev === value.type}/> {value.name}
                              </span>
                           )
                       })}

                   </div>
                   <div className='description-notice'>
                       <Editor  style={{height:'320px'}} value={editorStateDev}
                                onTextChange={(e)=>setEditorStateDev({editorState: e.htmlValue})}
                                placeholder={'내용을 입력하세요.(1000자 이내)'}
                       />
                   </div>
                   <button className="post" onClick={()=> titleDev.length > 0 &&  handleCreateDevelop()}>   <TranslateLanguage direct={'adsNotice.save'}/> </button>

               </div>

           </div> }
           <div>
               <ListFormDevelop develops={props.develops}/>
           </div>
       </Fragment>
    )
}
export default connect(
    state => {
        const { authentication: {user}, develop : {develops}} = state;
        return {
            user, develops
        };
    }
    ,dispatch => ({
        removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
        handleCreateDevelop: (data) => dispatch(developmentalAction.createByAdmin(data)),
        // getNotificationById: (userId) => dispatch(notificationAction.getById(userId)),
        getDevelopment: () => dispatch(developmentalAction.get()),
    }))(TabDevelop)
