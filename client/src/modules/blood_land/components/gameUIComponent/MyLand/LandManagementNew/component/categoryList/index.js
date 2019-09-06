import React, {Fragment, PureComponent} from 'react'
import {connect} from 'react-redux'
import {landActions} from "../../../../../../../../store/actions/landActions/landActions";
import CategoryListRender from "./categoryListRender"
import {loadingImage} from "../../../../../general/System";
import {objectsActions, TranslateLanguage} from "../../../../../../../../helpers/importModule";
import Tooltip from "../../../../../general/Tooltip";
import {onHandleCheckDeleteCategory} from '../landManagementFunction'
import NewCategory from "./component/createNewCategory";
import {screenActions} from "../../../../../../../../store/actions/commonActions/screenActions";
import NoCategorySelectedAlert from "../../../../../common/Popups/DeleteCategoryPopups/NoCategorySelectedAlert"
import FolderNotEmptyAlert from "../../../../../common/Popups/DeleteCategoryPopups/FolderNotEmptyAlert";
import LoadingPopup from "../../../../../common/Popups/commomPopups/LoadingPopup"
import DeleteCategoryConfirmAlert from "../../../../../common/Popups/DeleteCategoryPopups/DeleteCategoryConfirmAlert";

const CategoryListButton = [
    {
        type: 'back',
        name: 'button-back',
        image: '/images/game-ui/sm-back.svg',
        translate: 'menuTab.myLand.landSold.back',
        toolTip: 'menuTab.myLand.landOwned.toolTip.backButton'
    },
    {
        type: 'add',
        name: 'button-add-category',
        image: '/images/game-ui/sm-add-folder.svg',
        translate: 'menuTab.myLand.landOwned.addFolder',
        toolTip: 'menuTab.myLand.landOwned.toolTip.addFolderButton'
    },
    {
        type: 'sellLand',
        name: 'button-sellLand',
        image: '/images/game-ui/sm-sell-land.svg',
        translate: 'menuTab.myLand.landOwned.sellLand',
        toolTip: 'menuTab.myLand.landOwned.toolTip.sellLandButton'
    },
    {
        type: 'remove',
        name: 'button-delete-category',
        image: '/images/game-ui/sm-recycle.svg',
        translate: 'menuTab.myLand.landOwned.recycle',
        toolTip: 'menuTab.myLand.landOwned.toolTip.recycleButton'
    }
];


class CategoryList extends PureComponent {
    state = {};

    componentDidMount() {
        const {user: {_id}} = this.props;
        this.props.getAllLandCategoryNew({userId: _id});
        this.props.getAllObjectsByUserId({userId: _id});
    }

    onHandleDeleteCate = () => {
        const {deleteCategory, user: {_id}, addPopup, removePopup} = this.props;
        const {categoryState} = this.state;
        const isCategoryEmptyLand = categoryState.filter(c => c.checked && c.landCount === 0);
        isCategoryEmptyLand.map(item => {
            deleteCategory(_id, item._id);
            return item
        });
        addPopup({name: 'LoadingPopup'});
        setTimeout(() => {
            removePopup({name: 'LoadingPopup'});
        }, 200)

    };

    onHandleGetCategoryListFromChild = (categoryState) => {
        const categorySelected = categoryState.filter(c => c.checked);
        this.props.onHandleGetSelectedCategory(categorySelected);
        this.setState({
            categoryState
        })
    };
    onCategoryButtonClick = (type) => {
        const {categoryState} = this.state;
        const {PREVIOUS_SCREEN, handleChangeScreen, addPopup, onHandleUsingItem , categoryList} = this.props;
        switch (type) {
            case 'back':
                return PREVIOUS_SCREEN && handleChangeScreen(PREVIOUS_SCREEN.default);
            case 'add':
                return addPopup({name: 'NewCategoryPopup' , data: {categoryList}});
            case 'remove':
                return onHandleCheckDeleteCategory(categoryState, addPopup);
            case 'sellLand':
                return onHandleUsingItem(type);
            default:
                break
        }
    };

    alertPopupRender = () => {
        const {screens} = this.props;
        return (
            <Fragment>
                {screens['NoCategorySelectedAlert'] && <NoCategorySelectedAlert/>}
                {screens['FolderNotEmptyAlert'] && <FolderNotEmptyAlert/>}
                {screens['DeleteCategoryConfirmAlert'] && <DeleteCategoryConfirmAlert onHandleDeleteCate={this.onHandleDeleteCate}/>}
                {screens['LoadingPopup'] && <LoadingPopup/>}
                {screens['NewCategoryPopup'] && <NewCategory/>}
            </Fragment>
        )
    };

    render() {
        const { onHandleGetLandSelected} = this.props;
        return (
            <Fragment>
                <div className='category-list-container'>
                    <CategoryListRender onHandleGetCategoryListFromChild={this.onHandleGetCategoryListFromChild}
                                        onHandleGetLandSelected={onHandleGetLandSelected}/>
                </div>
                <div className='category-list-button-container'>
                    {CategoryListButton.map((value, index) => {
                        const {name, image, translate, type, toolTip} = value;
                        return (
                            <div className={name} onClick={() => this.onCategoryButtonClick(type)} key={index}>
                                <div className='image-item'>
                                    <img src={loadingImage(image)} alt=''/>
                                </div>
                                <div className='item-title'>
                                    <TranslateLanguage direct={translate}/>
                                </div>
                                <Tooltip descLang={toolTip}/>
                            </div>
                        )
                    })}
                </div>
                {this.alertPopupRender()}

            </Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    const {authentication: {user}, lands: {categoryList}, screens} = state;
    return {
        user, categoryList, screens
    }
};
const mapDispatchToProps = (dispatch) => ({
    deleteCategory: (userId, cateId) => dispatch(landActions.deleteLandCategory({userId: userId, cateId: cateId})),
    getAllLandCategoryNew: (param) => dispatch(landActions.getAllLandCategoryNew(param)),
    getAllObjectsByUserId: (param) => dispatch(objectsActions.getAllObjectsByUserId(param)),
    addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
    removePopup: (screen) => dispatch(screenActions.removePopup(screen))
});
export default connect(mapStateToProps, mapDispatchToProps)(CategoryList)