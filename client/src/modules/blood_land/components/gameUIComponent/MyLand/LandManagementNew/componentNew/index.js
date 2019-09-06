import React , {memo , useState , useEffect , Fragment }  from 'react';
import {connect} from 'react-redux'
import {landActions} from "../../../../../../../store/actions/landActions/landActions";
import {loadingImage} from "../../../../general/System";
import {screenActions, TranslateLanguage} from "../../../../../../../helpers/importModule";
import Tooltip from "../../../../general/Tooltip";
import CategoryList from "./category/CategoryList"
import NewCategory from "../../../../common/Components/NewCategory/CreateNewCategory";
import {onCheckDeleteCategory} from './myLandFunction'
import NoCategorySelectedAlert from "../../../../common/Popups/DeleteCategoryPopups/NoCategorySelectedAlert"
import FolderNotEmptyAlert from "../../../../common/Popups/DeleteCategoryPopups/FolderNotEmptyAlert";
import LoadingPopup from "../../../../common/Popups/commomPopups/LoadingPopup"
import DeleteCategoryConfirmAlert from "../../../../common/Popups/DeleteCategoryPopups/DeleteCategoryConfirmAlert";


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

const CategoryComponent = memo(props => {

    const { user: {_id} , selectedCategoryMyLand , categoryList , screens , PREVIOUS_SCREEN , handleChangeScreen , addPopup , deleteCategory, removePopup} = props;

    useEffect(() => {
        props.getAllLandCategoryNew({userId: _id});
        // this.props.getAllObjectsByUserId({userId: _id});
    }, []);

    const onHandleClick = (type) => {
        switch (type) {
            case 'back':
                return PREVIOUS_SCREEN && handleChangeScreen(PREVIOUS_SCREEN.default);
            case 'add':
                return addPopup({name: 'NewCategoryPopup' , data: {categoryList}});
            case 'remove':
                return onCheckDeleteCategory(selectedCategoryMyLand, addPopup);
            case 'sellLand':
                //return onHandleUsingItem(type);
                addPopup({ name: type, data: { isSellLandInTab: true } })
            default:
                break
        }
    };

    const onDeleteCate = () => {
        const isCategoryEmptyLand = selectedCategoryMyLand.filter(c => c.landCount === 0);
        isCategoryEmptyLand.map(item => {
            deleteCategory(_id, item._id);
            return item
        });
        addPopup({name: 'LoadingPopup'});
        setTimeout(() => {removePopup({name: 'LoadingPopup'})})
    };

    return(
        <Fragment>
            <div className='category-list-container'>
                <CategoryList/>
            </div>
            <div className='category-list-button-container'>
                {CategoryListButton.map((value, index) => {
                    const {name, image, translate, type, toolTip} = value;
                    return (
                        <div className={name} onClick={() => onHandleClick(type)} key={index}>
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
            {screens['NoCategorySelectedAlert'] && <NoCategorySelectedAlert/>}
            {screens['FolderNotEmptyAlert'] && <FolderNotEmptyAlert/>}
            {screens['DeleteCategoryConfirmAlert'] && <DeleteCategoryConfirmAlert onHandleDeleteCate={onDeleteCate}/>}
            {screens['LoadingPopup'] && <LoadingPopup/>}
            {screens['NewCategoryPopup'] && <NewCategory/>}
        </Fragment>
    )
});

export default connect(
    state => {
        const {lands: {categoryList  }, objectsReducer: {selectedCategoryMyLand} , authentication:{user} , screens} = state;
        return{
            categoryList , user , selectedCategoryMyLand , screens
        }
    },
    dispatch => ({
        deleteCategory: (userId, cateId) => dispatch(landActions.deleteLandCategory({userId: userId, cateId: cateId})),
        getAllLandCategoryNew: (param) => dispatch(landActions.getAllLandCategoryNew(param)),
        addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
        removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
    })
)(CategoryComponent)