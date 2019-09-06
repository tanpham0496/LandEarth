import * as s from "../../../../../common/Components/CommonScreen";
import {StyledCheckbox} from "../../../../../../../../components/customStyled/Checkbox_style";
import React, {useState} from "react";
import {connect} from 'react-redux';
import {StyledInputText} from "../../../../../../../../components/customStyled/inputText_style";
import {onHandleTranslate} from "../../../../../../../../helpers/Common";
import {translate} from "react-i18next";
import {landActions} from "../../../../../../../../store/actions/landActions/landActions";
import {mapActions} from "../../../../../../../../store/actions/commonActions/mapActions";
import {QuadKeyToLatLong} from "../../../../../general/System";
import {getMapImgByItemId} from "../../../../../../../../helpers/thumbnails";

const CategoriesDetail = (props) => {
    const {...p} = props;
    const {settingReducer: {language , gameMode}, t, lng, user: {_id} , map , myObjects} = props;
    const [isEditLandId, setIsEditLandId] = useState();
    const [landValue, setLandValue] = useState();

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


    return (
        <div className='category-detail-wrapper'>
            <div className='category-detail-container'>
                <div className='land-list-container'>
                    <div className='category-detail-scroller'>
                        <div className='land-container'>
                            {!p.objectList ? s.loadingComponent() : p.objectList.map((value, index) => {
                                const {name, quadKey, _id, categoryId , tree } = value;
                                const isLandEdit = isEditLandId === _id;


                                return (
                                    <div className='land-detail-container' key={index}>
                                        <div className='land-detail-wrapper'>
                                            <div className='edit-button-detail'>
                                                {isLandEdit ? <div className='confirm-btn'
                                                                   onClick={() => landValue && onConfirmChangeName(_id, categoryId)}/> :
                                                    <div className='rename-btn' onClick={() => setIsEditLandId(_id)}/>}
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
                                            <div className='name-land'  onClick={() => moveToLand(value)}>
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
                                                    {tree && tree.itemId !== 'T10' &&
                                                    <img src={getMapImgByItemId(tree.itemId)} alt={''}/>}
                                                    {tree && tree.bigTreeQuadKeys && <img src={getMapImgByItemId('T10-icon')} alt={''}/>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default connect(
    state => {
        const {objectsReducer: {myObjects , objectList, selectedLandMyLand}, settingReducer, authentication: {user} , map} = state;
        return {
            objectList, selectedLandMyLand, settingReducer, user, map , myObjects
        }
    },
    dispatch => ({
        editLandName: (param) => {dispatch(landActions.editLand(param))},
        saveLandSelectedPosition: (landSelected) => dispatch(landActions.saveSelectedLandPosition(landSelected)),
        syncCenterMap: (center, zoom, centerQuadkey) => dispatch(mapActions.syncCenterMap(center, zoom, centerQuadkey)),
    })
)(translate('common')(CategoriesDetail))