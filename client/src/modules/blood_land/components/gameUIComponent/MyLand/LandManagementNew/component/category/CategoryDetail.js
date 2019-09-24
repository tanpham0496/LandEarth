import * as s from "../../../../../common/Components/CommonScreen";
import {StyledCheckbox} from "../../../../../../../../components/customStyled/Checkbox_style";
import React, {useState, useEffect} from "react";
import {connect} from 'react-redux';
import {StyledInputText} from "../../../../../../../../components/customStyled/inputText_style";
import {onHandleTranslate} from "../../../../../../../../helpers/Common";
import {translate} from "react-i18next";
import {landActions} from "../../../../../../../../store/actions/landActions/landActions";
import {mapActions} from "../../../../../../../../store/actions/commonActions/mapActions";
import {QuadKeyToLatLong} from "../../../../../general/System";
import {getMapImgByItemId} from "../../../../../../../../helpers/thumbnails";
import classNames from "classnames";
import {objectsActions} from "../../../../../../../../store/actions/gameActions/objectsActions";
import {screenActions} from "../../../../../../../../store/actions/commonActions/screenActions";
import useInfiniteScroll from "../../../../../general/UseInfinityScroll"
import {infiniteScroll} from "../../../../../../../../helpers/config";

const CategoriesDetail = (props) => {
    const {...p} = props;
    const {settingReducer: {language, gameMode}, t, lng, user: {_id}, map, categoryList, loading} = props;
    const [isEditLandId, setIsEditLandId] = useState();
    const [landValue, setLandValue] = useState();
    const [objectListState, setObjectListState] = useState();
    const fetchMoreListItems = () => {
        setTimeout(() => {
            setObjectListState(prevState => ([...prevState, ...p.objectList.slice(prevState.length , prevState.length  + 30) ]));
            setIsFetching(false);
        }, 500);
    };
    const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems , "category-detail");



    const onConfirmChangeName = (id, categoryId) => {
        if (landValue !== '') {
            const param = {
                name: landValue.trim(),
                userId: _id,
                cateId: categoryId,
                landId: id
            };
            props.editLandName(param)
        }
        setTimeout(() => {
            setIsEditLandId();
            setLandValue()
        })
    };

    const moveToLand = (item) => {
        if (map && map.zoom === 22) {
            const center = QuadKeyToLatLong(item.quadKey);
            let zoom = item.quadKey.length - 2;
            gameMode && props.saveLandSelectedPosition(item)
            props.syncCenterMap(center, zoom, item.quadKey);
        } else {
            const center = QuadKeyToLatLong(item.quadKey);
            props.syncCenterMap(center);
        }
    };
    const covertDragPositionToCategoryId = (dropClientOffset) => {
        let category = document.getElementsByClassName("category-list-wrapper");
        let categories = [];
        // // let characters = this.state.characters;
        for (let index = 0; index < category.length; index++) {
            const element = category[index];

            let rect = element.getBoundingClientRect();
            categories.push({
                id: element.id, rect: {
                    top: rect.top,
                    right: rect.right,
                    bottom: rect.bottom,
                    left: rect.left
                }
            });
        }
        if (categories.length > 0 && dropClientOffset) {
            let categorySelectedId;
            for (let j = 0; j < categories.length; j++) {
                const categorySelected = categories[j];
                if (categorySelected.rect.left <= dropClientOffset.x && dropClientOffset.x <= categorySelected.rect.right
                    && categorySelected.rect.top <= dropClientOffset.y && dropClientOffset.y <= categorySelected.rect.bottom
                ) {
                    categorySelectedId = categorySelected.id
                }
            }
            return categorySelectedId
        }
    };
    const onDragend = (e, value) => {
        const position = {
            x: e.clientX,
            y: e.clientY
        };

        const categoryIdSelected = covertDragPositionToCategoryId(position);
        const landSelected = p.selectedLandMyLand.filter(l => l.categoryId === p.currentCategoryId);


        const paramTransferLand = {
            userId: p.user._id,
            quadKeys: p.selectedLandMyLand.length === 0 ? [value.quadKey] : landSelected.map(l => l.quadKey),
            oldCateId: p.currentCategoryId,
            newCateId: categoryIdSelected
        };

        const categorySelected = categoryList && categoryList.categories && categoryList.categories.find(c => c._id === paramTransferLand.newCateId);
        if (categorySelected && categorySelected.landCount + paramTransferLand.quadKeys.length > 500 && p.currentCategoryId !== categoryIdSelected) {
            p.addPopup({name: 'ErrorOver500LandsInCategory'})
        } else if (p.currentCategoryId !== categoryIdSelected) {
            p.transferLandCategory(paramTransferLand);
            setTimeout(() => p.resetLandSelectedMyLand())
        }
        p.resetLandSelectedLocal()
    };

    useEffect(() => {
        if (p.objectList) {
            infiniteScroll ? setObjectListState(p.objectList.slice(0,30)) : setObjectListState(p.objectList)
        }
    }, [p.objectList]);

    useEffect(() => {
        window.ondragover = (e) => {
            e.preventDefault();
        }
    });

    const objectListRender = [];
    objectListState && objectListState.map((value , index) => {
        const {name, quadKey, _id, categoryId, tree, forSaleStatus} = value;
        const isLandEdit = isEditLandId === _id;
        let quadKeyClass = classNames({
            'name-land': true,
            'name-land disable': forSaleStatus
        });
        return objectListRender.push(
            <div id="category-land" className='land-detail-container' key={index}
                 draggable={true}
                 onDragEnd={(e) => onDragend(e, value)}>
                <div className='land-detail-wrapper'>
                    <div className='edit-button-detail'>
                        {isLandEdit ? <div className='confirm-btn'
                                           onClick={() => landValue && onConfirmChangeName(_id, categoryId)}/> :
                            <div className='rename-btn'
                                 onClick={() => setIsEditLandId(_id)}/>}
                    </div>
                    <div className='check-box-category'>
                        {isLandEdit ? <div className='cancel-btn' onClick={() => {
                                setIsEditLandId();
                                setLandValue()
                            }}/> :
                            <StyledCheckbox value={value}
                                            checked={p.selectedLandMyLand.some(l => l.quadKey === quadKey)}
                                            onChange={(e) => p.onLandSelected(e)}/>}
                    </div>
                    <div className={quadKeyClass} onClick={() => moveToLand(value)}>
                        {isLandEdit ? <StyledInputText
                            value={landValue}
                            onChange={(e) => {
                                setLandValue(e.target.value)
                            }}
                            placeholder={onHandleTranslate(t, 'menuTab.myLand.landOwned.editLandName', language, lng)}
                        /> : name === '' ? quadKey : name}
                    </div>
                    <div className='tree-item-land-list'>
                        <div className='tree-container'>
                            {tree && tree.itemId !== 'T10' ?
                                <img src={getMapImgByItemId(tree.itemId)} alt={''}/> :
                                tree && tree.bigTreeQuadKeys &&
                                <img src={getMapImgByItemId('T10-icon')} alt={''}/>}
                        </div>
                    </div>
                </div>
            </div>
        )
    });

    return (
        <div className='category-detail-wrapper'>
            <div className='category-detail-container'>
                <div className='land-list-container'>
                    <div className='category-detail-scroller' id="category-detail">
                        <div className='land-container'>
                            {!objectListState || loading ? s.loadingLandList() : objectListRender}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default connect(
    state => {
        const {lands: {categoryList}, objectsReducer: {loading, myObjects, objectList, selectedLandMyLand, currentCategoryId}, settingReducer, authentication: {user}, map} = state;
        return {
            objectList,
            selectedLandMyLand,
            settingReducer,
            user,
            map,
            myObjects,
            currentCategoryId,
            categoryList,
            loading
        }
    },
    dispatch => ({
        editLandName: (param) => {
            dispatch(landActions.editLand(param))
        },
        saveLandSelectedPosition: (landSelected) => dispatch(landActions.saveSelectedLandPosition(landSelected)),
        syncCenterMap: (center, zoom, centerQuadkey) => dispatch(mapActions.syncCenterMap(center, zoom, centerQuadkey)),
        resetLandSelectedMyLand: () => dispatch(objectsActions.resetLandSelectedMyLand()),
        transferLandCategory: (param) => dispatch(landActions.transferLandCategoryNew(param)),
        addPopup: (screen) => dispatch(screenActions.addPopup(screen))
    })
)(translate('common')(CategoriesDetail))