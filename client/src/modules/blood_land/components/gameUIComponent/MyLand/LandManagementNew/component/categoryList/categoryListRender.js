import React, {PureComponent, Fragment} from 'react'
import {connect} from 'react-redux'
import isEqual from 'lodash.isequal'
import {translate} from "react-i18next";
import * as s from "../../../../../common/Components/CommonScreen";
import {StyledCheckbox} from "../../../../../../../../components/customStyled/Checkbox_style";
import {StyledInputText} from "../../../../../../../../components/customStyled/inputText_style";
import {onHandleTranslate} from "../../../../../../../../helpers/Common";
import {landActions, objectsActions, Rules, TranslateLanguage} from "../../../../../../../../helpers/importModule";
import cloneDeep from "lodash.clonedeep";
import CategoryDetail from "../categoryDetail/categoryDetail"
import {FaFolderOpen} from 'react-icons/fa';
import {FaFolder} from 'react-icons/fa';

const validationMess = {
    maxLength: 'maxLength',
    exist: 'exist',
    empty: 'empty',
    none: 'none',
    notHaveLand: 'notHaveLand'
};

class CategoryListRender extends PureComponent {
    state = {
        valueEdit: '',
        categoryIds: []
    };



    onHandleChangeEditCategory = (e) => {
        this.setState({
            categoryEdit: e.target.id
        })
    };

    onChangeCategoryEditInput = (e) => {
        this.setState({
            valueEdit: e.target.value,
            validationAlert: validationMess.none
        })
    };

    onHandleConfirmEditNameButton = (value, categoryName) => {
        const {valueEdit} = this.state;
        const {user} = this.props;
        let rules = new Rules.ValidationRules();
        const valueEditFormat = (valueEdit.trimEnd()).trimStart();
        const rule1 = rules.checkLength(valueEditFormat, 36, validationMess.maxLength);
        const rule2 = rules.checkEmpty(valueEditFormat, validationMess.empty);
        const rule3 = rules.checkExistName(valueEditFormat, categoryName, validationMess.exist);
        if (rule1) {
            this.setState({
                validationAlert: rule1
            })
        } else if (rule2) {
            this.setState({
                validationAlert: rule2
            })
        } else if (rule3) {
            this.setState({
                validationAlert: rule3
            })
        } else {
            const paramRenameCategory = {
                name: valueEditFormat,
                userId: user._id,
                cateId: value._id
            };
            this.props.editCategory(paramRenameCategory);
            setTimeout(() => {
                this.setState({
                    categoryEdit: null,
                    valueEdit: ''
                })
            })
        }

    };


    validationCategoryEditAlertRender = () => {
        const {validationAlert} = this.state;
        switch (validationAlert) {
            case validationMess.empty:
                return <TranslateLanguage
                    direct={'validation.addCategoryValidation.checkEmpty'}/>;
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

    onHandleClickCategory = (landCount, category) => {
        const {categoryClickId} = this.state;
        if (landCount !== 0) {
            const param = {
                cateId: category._id !== categoryClickId ? category._id : null,
                userId: this.props.user._id
            };
            if (param.cateId) {
                this.props.getLandByCategory(param);
                this.props.getObjectByQuadKey(param);
            }

            this.setState({
                categoryClickId: category._id !== categoryClickId ? category._id : null
            });
        }
    };


    onHandleCategorySelected = (e) => {
        const param = {
            categorySelected: e.target.value,
            status: e.target.checked
        };

        this.props.getCategorySelectedMyLand(param);
    };


    render() {
        const {valueEdit, categoryClickId} = this.state;
        const {t, settingReducer: {language}, lng, onHandleGetLandSelected, categoryList, selectedCategoryMyLand} = this.props;
        const {categoryEdit} = this.state;
        const categoryName = categoryList && categoryList.categories.map(c => {
            return c.name
        });
        return (
            <div className='category-list'>
                {!categoryList && s.loadingComponent()}
                {categoryList && categoryList.categories.map((value, index) => {
                    const {name, landCount, _id} = value;

                    const categoryListItemStyle = {
                        background: categoryClickId && categoryClickId === _id && '#AC0000',
                        color: categoryClickId && categoryClickId === _id && 'white'
                    }
                    return (
                        <div id={_id} className='category-list-wrapper' key={index}>
                            <div className='category-list-item' style={categoryListItemStyle}>
                                <div className='edit-button-category'>
                                    {categoryEdit === _id ? <div className='confirm-btn'
                                                                 onClick={() => this.onHandleConfirmEditNameButton(value, categoryName)}/> :
                                        <div className='rename-btn' id={_id}
                                             onClick={(e) => this.onHandleChangeEditCategory(e)}/>}
                                </div>

                                <div className='check-box-category'>
                                    {categoryEdit === _id ?
                                        <div className='cancel-btn'
                                             onClick={() => this.setState({categoryEdit: null})}/> :
                                        <StyledCheckbox  value={value} checked={selectedCategoryMyLand.some(c => c._id === _id)}
                                                        onChange={(e) => this.onHandleCategorySelected(e)}/>}
                                </div>
                                <div className='folder-symbol'>
                                    <FaFolder className='folder-close' size={14}/>
                                </div>
                                <div className='name-category'
                                     onClick={() => categoryEdit !== _id && this.onHandleClickCategory(landCount, value)}>
                                    {categoryEdit === _id ?
                                        <Fragment>
                                            <StyledInputText value={valueEdit}
                                                             placeholder={onHandleTranslate(t, 'menuTab.myLand.landOwned.editLandName', language, lng)}
                                                             onChange={(e) => this.onChangeCategoryEditInput(e)}/>
                                        </Fragment>
                                        : <span style={{whiteSpace: 'pre'}}>{name}</span>}
                                </div>
                                <div className='land-number-category'
                                     onClick={() => categoryEdit !== _id && this.onHandleClickCategory(landCount, value)}>
                                    {landCount}/500
                                </div>

                            </div>
                            {categoryEdit === _id && <div className='validation-alert'>
                                {this.validationCategoryEditAlertRender()}
                            </div>}
                            {landCount !== 0 && categoryClickId === _id &&
                            <div className='category-detail-wrapper'>
                                <CategoryDetail onHandleCategorySelected={this.onHandleCategorySelected}
                                                onHandleGetLandSelected={onHandleGetLandSelected}/>
                            </div>}

                        </div>
                    )
                })}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    const {authentication: {user}, lands: {categoryList, categoryLandList}, settingReducer , objectsReducer: {selectedCategoryMyLand, selectedLandMyLand}} = state;
    return {
        user, categoryList, settingReducer, categoryLandList, selectedCategoryMyLand , selectedLandMyLand
    }
};
const mapDispatchToProps = (dispatch) => ({
    getLandByCategory: (param) => dispatch(landActions.getLandByCategoryNew(param)),
    getObjectByQuadKey: (param) => dispatch(objectsActions.getObjectByQuadKey(param)),
    editCategory: (param) => dispatch(landActions.editCategory(param)),
    getCategorySelectedMyLand: (param) => dispatch(objectsActions.getCategorySelectedMyLand(param))
});
export default connect(mapStateToProps, mapDispatchToProps)(translate('common')(CategoryListRender))