import React, {Fragment, PureComponent} from 'react'
import {connect} from 'react-redux'
import isEqual from 'lodash.isequal'
import * as s from "../../../../../common/Components/CommonScreen"
import CloneDeep from "lodash.clonedeep";
import {inventoryActions, landActions} from '../../../../../../../../helpers/importModule';
import cloneDeep from 'lodash.clonedeep'
import {StyledCheckbox} from "../../../../../../../../components/customStyled/Checkbox_style";
import {StyledInputText} from "../../../../../../../../components/customStyled/inputText_style";
import classNames from "classnames";
import {onHandleTranslate} from "../../../../../../../../helpers/Common";
import {translate} from "react-i18next";
import {getMapImgByItemId} from "../../../../../../../../helpers/thumbnails";
import {mapActions} from "../../../../../../../../store/actions/commonActions/mapActions";
import {QuadKeyToLatLong} from '../../../../../../../../helpers/importModule';
import {objectsActions} from "../../../../../../../../store/actions/gameActions/objectsActions";

class CategoryDetail extends PureComponent {
    state = {
        valueEdit: '',
        firstLoad: true,
        selectedAll: []
    };

    componentDidMount() {
        const {user: {_id}} = this.props;
        this.props.onHandleGetAllTreeByUserId({userId: _id})

        window.ondragover = (e) => {
            e.preventDefault();
        }

    }

    // componentDidUpdate(prevProps, prevState, snapshot) {
    //     const {categoryLandList} = this.props;
    //
    //     if (categoryLandList && !isEqual(categoryLandList, prevProps.categoryLandList)) {
    //         const {lands} = categoryLandList;
    //         const categoryStateUpdate = lands.map(c => {
    //             c.checked = false;
    //             return c
    //         });
    //         this.setState({
    //             categoryState: categoryStateUpdate
    //         })
    //     }
    //
    // }

    onRenameLand = (quadKey) => {
        this.setState({
            landEditQuadKey: quadKey
        })
    };

    onChangeLandEditInput = (e) => {
        this.setState({
            valueEdit: e.target.value
        })
    };

    onChangeLandName = (landId) => {
        const {valueEdit} = this.state;
        const {user: {_id}, currentCategoryId} = this.props;
        const valueEditFormat = (valueEdit.trimEnd()).trimStart();
        if (valueEditFormat !== '') {
            const paramChangeNameLand = {
                name: valueEditFormat,
                userId: _id,
                cateId: currentCategoryId,
                landId
            };
            this.props.editLand(paramChangeNameLand);
        }
        setTimeout(() => {
            this.onRenameLand(null);
            this.setState({
                valueEdit: ''
            })
        }, 200)
    };

    onLandSelected = (e) => {
        const {selectedLandMyLand} = this.props;
        const param = {
            landSelected: e.target.value,
            status: e.target.checked
        };
        this.props.getLandSelectedMyLand(param);
    };


    convertPositionToCategoryId = (position) => {
        const {x, y} = position;
        let categoryListContainer = document.getElementsByClassName("category-list-container")[0];
        const rectCategoryListContainer = categoryListContainer.getBoundingClientRect();
        if (x > rectCategoryListContainer.x && y > rectCategoryListContainer.y) {
            let categoryList = [];
            let category = document.getElementsByClassName("category-list-wrapper");
            for (let i = 0; i < category.length; i++) {
                const element = category[i];
                let rect = element.getBoundingClientRect();
                let rectJson = {
                    top: rect.top,
                    right: rect.right,
                    bottom: rect.bottom,
                    left: rect.left,
                };
                categoryList.push({id: element.id, rect: rectJson});
            }
            if (categoryList.length > 0 && position) {
                let categoryId = {};
                for (let j = 0; j < categoryList.length; j++) {
                    if (categoryList[j].rect.left <= position.x && position.x <= categoryList[j].rect.right
                        && categoryList[j].rect.top <= position.y && position.y <= categoryList[j].rect.bottom
                    ) {
                        categoryId = categoryList[j].id
                    }
                }
                return categoryId
            }
        }
    };
    onHandleDragEnd = (e, item) => {
        // const {user: {_id}, categoryList} = this.props;
        // const {categoryState} = this.state;
        // const position = {
        //     x: e.clientX,
        //     y: e.clientY
        // };
        // const categoryId = this.convertPositionToCategoryId(position);
        // const categorySelected = categoryList && categoryList.categories.find(c => c._id === categoryId);
        // const selectedLandsClone = cloneDeep(categoryState);
        // const landSelectedMove = selectedLandsClone.filter(l => l.checked);
        // if (categoryId !== item.categoryId && categorySelected && landSelectedMove && categorySelected.landCount + landSelectedMove.length <= 500) {
        //     // landSelectedMove.length !== 0
        //     const landCanMoveQuadKeys = landSelectedMove.length !== 0 ? landSelectedMove.map(l => {
        //         return l.quadKey
        //     }) : [item.quadKey];
        //     const param = {
        //         userId: _id,
        //         quadKeys: landCanMoveQuadKeys,
        //         oldCateId: item.categoryId,
        //         newCateId: categoryId
        //     };
        //     this.props.transferLandCategory(param);
        // }

    };


    moveToLand = (item) => {
        const {gameMode, map} = this.props;
        if (map && map.zoom === 22) {
            const center = QuadKeyToLatLong(item.quadKey);
            let zoom = item.quadKey.length - 2;
            gameMode && this.props.saveLandSelectedPosition(item)
            this.props.syncCenterMap(center, zoom, item.quadKey);
        } else {

            const center = QuadKeyToLatLong(item.quadKey);
            this.props.syncCenterMap(center);
        }
    };
    onHandleDragStart = (e) => {
        // e.preventDefault();
        let img = document.createElement("img");
        img.src = "/images/game-ui/sm-move.svg ";
        e.dataTransfer.setDragImage(img, 0, 0);
    };

    onLandTreeRender = (objectList, myObjects, quadKey) => {
        const allBigTreeQuadKey = myObjects ? (myObjects.reduce((totalQK, object) => object.bigTreeQuadKeys ? totalQK.concat(object.bigTreeQuadKeys) : totalQK, [])) : [];
        const normalTree = objectList.find(o => o.quadKey === quadKey);
        const bigTree = allBigTreeQuadKey.find(o => o === quadKey);
        return (
            <div className='tree-container'>
                {normalTree && normalTree.tree && normalTree.tree.itemId !== 'T10' &&
                <img src={getMapImgByItemId(normalTree.tree.itemId)} alt={'a'}/>}
                {bigTree && <img src={getMapImgByItemId('T10-icon')} alt={'a'}/>}
            </div>
        )
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { categoryLandList, selectedCategoryMyLand} = this.props;
        if ( (this.state.firstLoad || !isEqual(selectedCategoryMyLand, prevProps.selectedCategoryMyLand ) ) && categoryLandList) {
            const checkCategorySelected = selectedCategoryMyLand.some( c =>  c._id === categoryLandList.cateId);

            categoryLandList.lands.map(l =>
                this.props.getLandSelectedMyLand({
                    landSelected: l,
                    status: checkCategorySelected
                })
            );
            this.setState({
                firstLoad: false
            })

        }
    }


    render() {
        const {landEditQuadKey, valueEdit} = this.state;
        const {language, t, lng, myObjects, objectList, categoryLandList, selectedLandMyLand} = this.props;

        return (
            <Fragment>
                <div className='category-detail-container'>
                    {/*//Land List*/}
                    <div className='land-list-container'>
                        <div className='category-detail-scroller'>
                            <div className='land-container'>
                                {!categoryLandList ? s.loading('myLand') : categoryLandList.lands.map((value, index) => {
                                    const {name, quadKey, forSaleStatus, _id} = value;

                                    let quadKeyClass = classNames({
                                        'name-land': true,
                                        'name-land disable': landEditQuadKey !== quadKey && forSaleStatus
                                    });
                                    return (
                                        <div className='land-detail-container' key={index} draggable="true"
                                             onDragStart={(e) => this.onHandleDragStart(e)}
                                             onDragEnd={(e) => this.onHandleDragEnd(e, value)}>
                                            <div className='land-detail-wrapper'>
                                                <div className='edit-button-detail'>
                                                    {landEditQuadKey === quadKey ?
                                                        <div className='confirm-btn'
                                                             onClick={() => this.onChangeLandName(_id)}/> :
                                                        <div className='rename-btn'
                                                             onClick={() => this.onRenameLand(quadKey)}/>}
                                                </div>
                                                <div className='check-box-category'>
                                                    {landEditQuadKey === quadKey ?
                                                        <div className='cancel-btn'
                                                             onClick={() => this.onRenameLand(null)}/> :

                                                        <StyledCheckbox id={_id} value={value}
                                                                        onChange={(e) => this.onLandSelected(e)}
                                                                        checked={selectedLandMyLand.some(l => l.quadKey === quadKey)}/>}
                                                </div>
                                                <div className={quadKeyClass} onClick={() => this.moveToLand(value)}>
                                                    {landEditQuadKey === quadKey ? <Fragment>
                                                        <StyledInputText value={valueEdit !== '' ? valueEdit : name}
                                                                         placeholder={onHandleTranslate(t, 'menuTab.myLand.landOwned.editLandName', language, lng)}
                                                                         onChange={(e) => this.onChangeLandEditInput(e)}/>
                                                    </Fragment> : <Fragment>
                                                        {name === '' ? quadKey : name}
                                                    </Fragment>}
                                                </div>
                                                <div className='tree-item-land-list'>
                                                    {!myObjects || !objectList ?
                                                        <div>...</div> : this.onLandTreeRender(objectList, myObjects, quadKey)}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>


        );
    }
}

const mapStateToProps = (state) => {
    const {lands: {categoryLandList, modifiedLand}, objectsReducer: {myObjects, objectList, selectedLandMyLand, selectedCategoryMyLand}, authentication: {user}, settingReducer: {language, gameMode}, lands: {categoryList}, map} = state;
    return {
        categoryLandList,
        myObjects,
        objectList,
        user,
        modifiedLand,
        language,
        categoryList,
        gameMode,
        map,
        selectedLandMyLand,
        selectedCategoryMyLand
    }
};

const mapDispatchToProps = (dispatch) => ({
    editLand: (param) => {
        dispatch(landActions.editLand(param))
    },
    syncCenterMap: (center, zoom, centerQuadkey) => dispatch(mapActions.syncCenterMap(center, zoom, centerQuadkey)),
    transferLandCategory: (param) => dispatch(landActions.transferLandCategoryNew(param)),
    saveLandSelectedPosition: (landSelected) => dispatch(landActions.saveSelectedLandPosition(landSelected)),
    onHandleGetAllTreeByUserId: (param) => dispatch(inventoryActions.getAllTreeByUserId(param)),
    getLandSelectedMyLand: (param) => dispatch(objectsActions.getLandSelectedMyLand(param))
});
export default connect(mapStateToProps, mapDispatchToProps)(translate('common')(CategoryDetail))