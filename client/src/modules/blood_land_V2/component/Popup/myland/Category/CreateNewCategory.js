import React, {memo, useState} from "react";
import {
    landActions,
    onHandleTranslate,
    Rules,
    screenActions,
    TranslateLanguage
} from "../../../../../../helpers/importModule";
import {Modal} from "reactstrap";
import {InputText} from 'primereact/inputtext';
import {connect} from "react-redux";
import {translate} from "react-i18next";
//
const validationMess = {
    maxLength: 'maxLength',
    exist: 'exist',
    empty: 'empty',
    none: 'none'
}
const CreateNewCategory = memo((props) => {
    const {removePopup , addPopup, t , language , lng , screens: {CreateNewCategory: {categoryList: {categories}}} ,addCategory, user: {_id} , getAllLandCategoryNew} = props;
    const [newCate , setNewCate] = useState('');
    const [validationAlert , setValidationAlert] = useState();
    const updateInput = (e) => {
        setValidationAlert(validationMess.none);
        setNewCate(e.target.value)
    };

    const onHandleAddCategory = () => {
        const categoryName = categories.map(c =>  {return c.name});
        let rules = new Rules.ValidationRules();
        const valueEditFormat = (newCate.trimEnd()).trimStart();
        const rule1 = rules.checkLength(valueEditFormat, 36, validationMess.maxLength);
        const rule2 = rules.checkEmpty(valueEditFormat, validationMess.empty);
        const rule3 = rules.checkExistName(valueEditFormat, categoryName, validationMess.exist);
        if (rule1) {
            setValidationAlert(rule1)
        } else if (rule2) {
            setValidationAlert(rule2)
        } else if (rule3) {
            setValidationAlert(rule3)
        } else {
            addCategory(newCate, _id);
            setTimeout(() => {
                removePopup({name: 'CreateNewCategory'});
            } , 100);
            addPopup({name : 'CreateNewCategorySuccess'});
            setTimeout(() => {
                getAllLandCategoryNew({userId: _id});
            } , 100);
        }

    };
    const validationCategoryEditAlertRender = () => {
        switch (validationAlert) {
            case validationMess.empty:
                return  <TranslateLanguage
                    direct={'validation.addCategoryValidation.checkEmpty'}/>;
            case validationMess.maxLength:
                return <TranslateLanguage
                    direct={'validation.addCategoryValidation.checkLength'}/>;
            case validationMess.exist:
                return <TranslateLanguage
                    direct={'validation.addCategoryValidation.checkExistString'}/>;
            default:
                return null
        }
    };
    return(
        <Modal isOpen={true} className={`custom-modal modal--alert add-folder`}>
            <div className='custom-modal-header'>
                <TranslateLanguage direct={'menuTab.myLand.landOwned.addFolder'}/>
                <div className='button-header'
                     onClick={() => removePopup({name: 'CreateNewCategory'})}>
                    <div className='button-return'>
                        <div className='icon-button'/>
                    </div>
                </div>
            </div>
            <div className='line-container'/>
            <div className='custom-modal-body' style={{paddingTop: '57px'}}>
                <div className='container'>
                    <div className="row">
                        <div className="form-group">
                            <div className={'input-add-folder'}>
                                <InputText value={newCate} onChange={(e) => updateInput(e)}
                                           style={{width: '200px'}}
                                           placeholder={onHandleTranslate(t, 'menuTab.myLand.landOwned.addFolder.folderName', language, lng)}
                                />
                            </div>
                            <div style={{color: 'red'}}>{validationCategoryEditAlertRender()}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='modal-footer-add-folder'>
                <button onClick={() => onHandleAddCategory()}>
                    <TranslateLanguage direct={'menuTab.myLand.landOwned.addFolder.create'}/>
                </button>
                <button onClick={() => removePopup({name: 'CreateNewCategory'})}>
                    <TranslateLanguage direct={'menuTab.myLand.landOwned.addFolder.cancel'}/>
                </button>
            </div>
        </Modal>
    )
});
const mapStateToProps = (state) =>{
    const {settingReducer: {language} , authentication: {user} , screens} = state;
    return {
        language , user , screens
    }
};
const mapDispatchToProps = (dispatch) => ({
    addCategory: (name, userId) => {
        dispatch(landActions.addCategory({name: name, userId: userId}));
    },
    getAllLandCategoryNew: (param) => dispatch(landActions.getAllLandCategoryNew(param)),
    removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
    addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
});
export default connect(mapStateToProps , mapDispatchToProps)((translate('common')(CreateNewCategory)));
