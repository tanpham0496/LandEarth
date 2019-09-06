import React, {memo, useState, useEffect} from 'react'
import {connect} from 'react-redux'
import * as s from "../../../../../common/Components/CommonScreen";
import {objectsActions} from "../../../../../../../../store/actions/gameActions/objectsActions";
import {StyledCheckbox} from "../../../../../../../../components/customStyled/Checkbox_style";
import {FaFolderOpen, FaFolder} from 'react-icons/fa/index';
import {StyledInputText} from "../../../../../../../../components/customStyled/inputText_style";
import {onHandleTranslate} from "../../../../../../../../helpers/Common";
import {translate} from "react-i18next";
import CategoriesDetail from "./CategoryDetail";
import {Rules, TranslateLanguage} from "../../../../../../../../helpers/importModule";
import {landActions} from "../../../../../../../../store/actions/landActions/landActions";

let LandSelectedLocal = [];
const validationMess = {
    maxLength: 'maxLength',
    exist: 'exist',
    notHaveLand: 'notHaveLand'
};
const CategoryList = memo(props => {
    const {categoryList: {status, categories}, user, objectList, selectedCategoryMyLand, settingReducer: {language}, t, lng} = props;
    const [currentCategoryId, setCurrentCategoryId] = useState();
    const [isCategoryDetailOpen, setIsCategoryDetailOpen] = useState(false);
    const [isEditCategoryId, setIsEditCategoryId] = useState();
    const [firstLoad, setFirstLoad] = useState(true);
    const [categoryValue, setCategoryValue] = useState();
    const [isValidation, setIsValidation] = useState();

    //ham check trang thai cua category checked = true/false => checked land = true / false
    useEffect(() => {
        if (objectList && firstLoad) {
            setFirstLoad(false)
            objectList && objectList.map(l => props.getLandSelectedMyLand({
                landSelected: l,
                status: selectedCategoryMyLand.some(c => c._id === currentCategoryId)
            }));
            objectList && objectList.map(l => onSaveLandSelectedLocal(l, selectedCategoryMyLand.some(c => c._id === currentCategoryId)))
        }
    }, [objectList]);

    //ham lu dat tam thoi
    const onSaveLandSelectedLocal = (value, status) => {
        if (!LandSelectedLocal.some(l => l._id === value._id) && status) {
            LandSelectedLocal.push(value)
        }
        if (LandSelectedLocal.some(l => l._id === value._id) && !status) {
            LandSelectedLocal.splice(LandSelectedLocal.findIndex(l => l._id === value._id), 1)
        }
    };

    //ham chon land
    const onLandSelected = (e) => {
        const param = {
            landSelected: e.target.value,
            status: e.target.checked
        };
        props.getLandSelectedMyLand(param);
        onSaveLandSelectedLocal(e.target.value, e.target.checked)

        //Checked dat rong category tat ca deu = true/false => checked category chua nhung land do = true/false
        const statusLand = LandSelectedLocal.filter(l => l.categoryId === currentCategoryId).length === objectList.length;
        props.getCategorySelectedMyLand({
            categorySelected: categories.find(c => c._id === currentCategoryId),
            status: statusLand
        });
    };
    //Ham chon category
    const onCategorySelected = (e) => {
        const param = {
            categorySelected: e.target.value,
            status: e.target.checked
        };
        props.getCategorySelectedMyLand(param);

        //khi checked category = true/false  =>  dat trong category do se checked = true/false
        if (objectList && e.target.value._id === objectList[0].categoryId) {
            objectList.map(l => onSaveLandSelectedLocal(l, e.target.checked))
            objectList.map(l => props.getLandSelectedMyLand({landSelected: l, status: e.target.checked}));
        }
        currentCategoryId !== e.target.value._id  && e.target.value.landCount !== 0 && onOpenCategoryDetail( e.target.value._id )
    };

    //ham dong mo category detail
    const onOpenCategoryDetail = (id) => {
        if(currentCategoryId === id){
            setCurrentCategoryId();
            props.getCurrentCategory()

        }else{
            setCurrentCategoryId(id);
            props.getCurrentCategory(id)
            setFirstLoad(true);
            setIsCategoryDetailOpen(!isCategoryDetailOpen)
            if (currentCategoryId !== id) {
                const param = {
                    cateId: id,
                    userId: user._id
                };
                props.getObjectByQuadKey(param);
            }
        }

    };


    //Ham xac nhan doi ten
    const onConfirmEditName = (id) => {
        const categoryNameList = categories.map(c => c.name);
        let rules = new Rules.ValidationRules();
        const editValueFormat = (categoryValue.trimEnd()).trimStart();
        const rule1 = rules.checkLength(editValueFormat, 36, validationMess.maxLength);
        const rule2 = rules.checkExistName(editValueFormat, categoryNameList, validationMess.exist);
        if (rule1) {
            setIsValidation(rule1)
        } else if (rule2) {
            setIsValidation(rule2)
        } else {
            const param = {
                name: editValueFormat,
                userId: user._id,
                cateId: id
            };
            props.editCategory(param);
            setTimeout(() => {
                setCategoryValue();
                setIsEditCategoryId()
            })
        }
    };

    //Render component
    const validationRender = () => {
        switch (isValidation) {
            case validationMess.maxLength:
                return <TranslateLanguage
                    direct={'validation.addCategoryValidation.checkLength'}/>;
            case validationMess.exist:
                return <TranslateLanguage
                    direct={'validation.addCategoryValidation.checkExistString'}/>
            default:
                return null
        }
    };

    return (
        <div className='category-list'>
            {!status ? s.loadingComponent() : (
                categories.map((value, index) => {
                    const {name, landCount, _id} = value;
                    const isCategoryEdit = isEditCategoryId === _id;
                    // const isCategoryOpen = isCategoryDetailOpen && currentCategoryId === _id;
                    const isCategoryOpen =  currentCategoryId === _id;
                    const categoryListItemStyle = {
                        background: isCategoryOpen && '#AC0000',
                        color: isCategoryOpen && 'white'
                    };

                    return (
                        <div className='category-list-wrapper' key={index}>
                            <div className='category-list-item' style={categoryListItemStyle}>
                                <div className='edit-button-category'>
                                    {isCategoryEdit ? <div className='confirm-btn'
                                                           onClick={() => categoryValue && onConfirmEditName(_id)}/> :
                                        <div className='rename-btn' onClick={() => setIsEditCategoryId(_id)}/>}
                                </div>
                                <div className='check-box-category'>
                                    {isCategoryEdit ? <div className='cancel-btn'
                                                           onClick={() => {
                                                               setCategoryValue(name);
                                                               setIsEditCategoryId()
                                                           }}/> :
                                        <StyledCheckbox value={value}
                                                        checked={selectedCategoryMyLand.some(c => c._id === _id)}
                                                        onChange={(e) => onCategorySelected(e)}/>
                                    }
                                </div>
                                <div className='folder-symbol'
                                     onClick={() => landCount !== 0 && onOpenCategoryDetail(_id)}>
                                    {isCategoryOpen ? <FaFolderOpen className='folder-open' size={13}/> :
                                        <FaFolder className='folder-close' size={13}/>}
                                </div>
                                <div className='name-category'>
                                    {isCategoryEdit ? <StyledInputText
                                        value={(categoryValue || categoryValue === '') ? categoryValue : name}
                                        onChange={(e) => {
                                            setIsValidation();
                                            setCategoryValue(e.target.value)
                                        }}
                                        placeholder={onHandleTranslate(t, 'menuTab.myLand.landOwned.editLandName', language, lng)}
                                    /> : <span style={{whiteSpace: 'pre'}}
                                               onClick={() => landCount !== 0 && onOpenCategoryDetail(_id)}>{name}</span>}
                                </div>
                                <div className='land-number-category'>
                                    {landCount}/500
                                </div>
                            </div>
                            {isCategoryEdit && <div className='validation-alert'>{validationRender()}</div>}
                            {isCategoryOpen && <CategoriesDetail onLandSelected={onLandSelected}/>}
                        </div>
                    )
                })
            )}
        </div>
    )
});

export default connect(
    state => {
        const {lands: {categoryList}, authentication: {user}, objectsReducer: {objectList, selectedLandMyLand, selectedCategoryMyLand}, settingReducer} = state;
        return {
            user,
            categoryList,
            objectList,
            selectedLandMyLand,
            selectedCategoryMyLand,
            settingReducer
        }
    },
    dispatch => ({
        getObjectByQuadKey: (param) => dispatch(objectsActions.getObjectByQuadKey(param)),
        getLandSelectedMyLand: (param) => dispatch(objectsActions.getLandSelectedMyLand(param)),
        getCategorySelectedMyLand: (param) => dispatch(objectsActions.getCategorySelectedMyLand(param)),
        editCategory: (param) => dispatch(landActions.editCategory(param)),
        getCurrentCategory: (id) => dispatch(objectsActions.getCurrentCategory(id))
    })
)(translate('common')(CategoryList))