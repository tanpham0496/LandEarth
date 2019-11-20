import React, {Fragment, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import useInfiniteScroll from "../../../../blood_land/components/general/UseInfinityScroll";
import {loadingImage, QuadKeyToLatLong} from "../../../../blood_land/components/general/System";
import {screenActions} from "../../../../../store/actions/commonActions/screenActions";
import {StyledCheckbox2} from "../../../../../components/customStyled/Checkbox2_style";
import _ from 'lodash'
import {
    landActions,
    mapActions,
    objectsActions,
    onHandleTranslate,
    Rules,
    TranslateLanguage
} from "../../../../../helpers/importModule";
import {StyledInputText} from "../../../../../components/customStyled/inputText_style";
import { btnActionMyLand } from '../../Menu/data';
import {CreateNewCategory, CreateNewCategorySuccess ,DeleteCategoryConfirmPopup ,
    NoCategorySelectedPopup ,FolderNotEmptyPopup ,NoSelectedPopup,
    EmptyCategoryPopup, NoLandCanSalePopup,AllSelectedIsSellingPopup} from '../../Popup/myland'
import SellLand from './SellLand'
import LoadingPopup from "../../Popup/LoadingPopup";
import NewCategory from "../../../../blood_land/components/common/Components/NewCategory/CreateNewCategory";

let LandSelectedLocal = [];
const validationMess = {
    maxLength: 'maxLength',
    exist: 'exist',
    notHaveLand: 'notHaveLand'
};
const ReserveComponent = (props) => {
    const dispatch = useDispatch();
    const [ListState, setListState] = useState();
    const [isEditNameFolder, setIsEditNameFolder] = useState(false);
    const [categoryValue, setCategoryValue] = useState();
    const [isValidation, setIsValidation] = useState();
    const [currentCategoryId, setCurrentCategoryId] = useState();
    const [firstLoad, setFirstLoad] = useState(true);
    const [screenPreviousOpen, setScreenPreviousOpen] = useState();
    
    const {lands: {categoryList}, authentication: {user},objectsReducer,
        objectsReducer: {objectList, selectedLandMyLand, selectedCategoryMyLand},
        // settingReducer: {language}, t, lng, settingReducer ,
        screens, lands ,
        lands: {landInfo ,forSaleLands}, map
    } = useSelector(state =>state);

    useEffect(()=> {
        dispatch(landActions.getAllLandCategoryNew({userId: user._id}));
        const wToken = user.wToken;
        dispatch(landActions.getListForSaleLands({ wToken }));
    },[]);
    // get the QuadKey was selling when open folder 
    useEffect(()=> {
         if(lands && forSaleLands && forSaleLands.length !== 0 && objectsReducer.currentCategoryId) {
             dispatch(objectsActions.getObjectByQuadKey({cateId: objectsReducer.currentCategoryId, userId: user._id}))
         }
    }, [forSaleLands]);
    const fetchMoreListItems = () => {
        setTimeout(() => {
            setListState(prevState => ([...prevState, ...categoryList.categories.slice(prevState.length, prevState.length + 30)]));
            setIsFetching(false);
        }, 500);
    };

    const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems, "body-reserve");

    useEffect(() => {
        if (categoryList && Array.isArray(categoryList.categories)) {
            setListState(categoryList.categories.slice(0, 30))
        }
    }, [categoryList]);

    const handleClickBtn = (type) => {
        switch (type) {
            case 'CreateNewCategory':
                dispatch( screenActions.addPopup({name : [type], close : screenPreviousOpen, data: {categoryList}}));
                break;
            case 'SellLand':
                const gotoSellLand = () => dispatch( screenActions.addPopup({name : type }));
                const quantityLandInCategory = (selectedCategoryMyLand || []).reduce((total, cate) => total + cate.landCount, 0);
                const quantityLandCanSale = (selectedLandMyLand || []).reduce((total, land) => total + (+!land.forSaleStatus), 0);
                 const isCheckAllSelectedIsSelling  = selectedLandMyLand && selectedLandMyLand.map((item) => {
                      if(forSaleLands && forSaleLands.some(ft => ft.quadKey === item.quadKey))  return item;
                      return null;
                 }).filter(item => item !== null);

                if(_.isEmpty(selectedLandMyLand) && !_.isEmpty(selectedCategoryMyLand) && quantityLandInCategory === 0)
                {
                    dispatch( screenActions.addPopup({ name: 'EmptyCategoryPopup' }));
                }
                else if(!_.isEmpty(selectedLandMyLand) && quantityLandCanSale === 0)
                {
                    dispatch( screenActions.addPopup({ name: 'NoLandCanSalePopup' }));
                }
                else if(_.isEmpty(selectedLandMyLand) && _.isEmpty(selectedCategoryMyLand))
                {
                    dispatch( screenActions.addPopup({ name: 'NoSelectedPopup' }));
                }
                else if(isCheckAllSelectedIsSelling.length === selectedLandMyLand.length && !_.isEmpty(selectedLandMyLand))
                {
                    dispatch( screenActions.addPopup({ name: 'AllSelectedIsSellingPopup' }));
                }
                else 
                {
                    dispatch( screenActions.addPopup({ name: type, data: { isSellLandInTab: true, gotoSellLand } }));
                }
                break;
            case 'DeleteFolderMyLand' :
                if(selectedCategoryMyLand.length === 0){
                    dispatch( screenActions.addPopup({ name:  'NoCategorySelectedPopup' }));
                }else{
                    const isCategoryEmptyLand = selectedCategoryMyLand.filter(c => c.landCount === 0);
                    if (isCategoryEmptyLand.length === 0) {
                        dispatch( screenActions.addPopup({ name:  'FolderNotEmptyPopup' }));
                    } else {
                        dispatch( screenActions.addPopup({ name:  'DeleteCategoryConfirmPopup' }));
                    }
                }
                break;
            default:
                return ''
        }
        setScreenPreviousOpen(type);
    };
    const _onHandleOpenFolder = _.debounce((id) => {
        if (currentCategoryId === id) {
            setCurrentCategoryId();
            setLoading(false);
            dispatch(objectsActions.getCurrentCategory(id))

        } else {
            setCurrentCategoryId(id);
            setLoading(true);
            dispatch(objectsActions.getCurrentCategory(id));
            if (currentCategoryId !== id) {
                const param = {
                    cateId: id,
                    userId: user._id
                };
                dispatch(objectsActions.getObjectByQuadKey(param))
            }
        }
    }, 200);

    const onSaveLandSelectedLocal = (value, status) => {
        if (!LandSelectedLocal.some(l => l._id === value._id) && status) {
            LandSelectedLocal.push(value)
        }
        if (LandSelectedLocal.some(l => l._id === value._id) && !status) {
            LandSelectedLocal.splice(LandSelectedLocal.findIndex(l => l._id === value._id), 1)
        }
    };
    useEffect(() => {
        if (objectList && firstLoad && selectedCategoryMyLand.some(c => c._id === currentCategoryId)) {
            setFirstLoad(false)
            const objectListFormat = objectList &&objectList.map(({quadKey , categoryId}) => ({ quadKey , categoryId }));

            objectListFormat && dispatch(objectsActions.getLandSelectedMyLand({
                objectList:objectListFormat,
                status: selectedCategoryMyLand.some(c => c._id === currentCategoryId)
            }));

            objectList && objectList.map(l => onSaveLandSelectedLocal(l, selectedCategoryMyLand.some(c => c._id === currentCategoryId)))
        }
        if (objectList && objectList.length === 0) {
            setCurrentCategoryId();
            dispatch(objectsActions.getCurrentCategory())
        }
    }, [objectList]);

    const onLandSelected = (e) => {
        const param = {
            objectList: [{quadKey: e.value.quadKey , categoryId: e.value.categoryId}],
            status: e.target.checked
        };
        dispatch(objectsActions.getLandSelectedMyLand(param))
        onSaveLandSelectedLocal(e.target.value, e.target.checked)

        //Checked dat rong category tat ca deu = true/false => checked category chua nhung land do = true/false
        const statusLand = LandSelectedLocal.filter(l => l.categoryId === currentCategoryId).length === objectList.length;
        dispatch(objectsActions.getCategorySelectedMyLand({
            categorySelected: categoryList && categoryList.categories.find(c => c._id === currentCategoryId),
            status: statusLand
        }));
    };

    const onCategorySelected = (e) => {
        const param = {
            categorySelected: e.target.value,
            status: e.target.checked
        };
        // console.log('param',param)
        dispatch(objectsActions.getCategorySelectedMyLand(param));
        //khi checked category = true/false  =>  dat trong category do se checked = true/false
        if (objectList && objectList[0] && e.target.value._id === objectList[0].categoryId) {
            objectList.map(l => onSaveLandSelectedLocal(l, e.target.checked) );
            const objectListFormat = objectList.map(({quadKey , categoryId}) => ({ quadKey , categoryId }));
            dispatch(objectsActions.getLandSelectedMyLand({objectList: objectListFormat , status: e.target.checked}))
        }
    };
    const onConfirmEditName = (id) => {
        const categoryNameList = categoryList && categoryList.categories.map(c => c.name);
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
            dispatch(landActions.editCategory(param));
            setTimeout(() => {
                setCategoryValue();
                setIsEditNameFolder()
            });
            setIsValidation();
        }
    };
    const validationRender = () => {
        switch (isValidation) {
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

    //reserve detail
    const [isEditLandId, setIsEditLandId] = useState();
    const [landValue, setLandValue] = useState();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
       setTimeout(()=> {
           setLoading(false);
       },400)
    }, [loading]);
    const onConfirmChangeName = (id, categoryId) => {
        if (landValue !== '') {
            const param = {
                name: landValue.trim(),
                userId: user._id,
                cateId: categoryId,
                landId: id
            };
            dispatch(landActions.editLand(param))
        }
        setTimeout(() => { setIsEditLandId(); setLandValue() })
    };
    const covertDragPositionToCategoryId = (dropClientOffset) => {
        let category = document.getElementsByClassName("container-list-total");
        let categories = [];
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
    const onDragend = (e, item) => {
        const position = {
            x: e.clientX,
            y: e.clientY
        };
        const categoryIdSelected = covertDragPositionToCategoryId(position);
        const landSelected = selectedLandMyLand.filter(l => l.categoryId === currentCategoryId);
        const paramTransferLand = {
            userId: user._id,
            quadKeys: selectedLandMyLand.length === 0 ? [item.quadKey] : landSelected.map(l => l.quadKey),
            oldCateId: currentCategoryId,
            newCateId: categoryIdSelected
        };
        const categorySelected = categoryList && categoryList.categories && categoryList.categories.find(c => c._id === paramTransferLand.newCateId);
        if (categorySelected && categorySelected.landCount + paramTransferLand.quadKeys.length > 500 && currentCategoryId !== categoryIdSelected) {
            // p.addPopup({name: 'ErrorOver500LandsInCategory'})
            alert('ErrorOver500LandsInCategory')
        } else if (currentCategoryId !== categoryIdSelected) {
            dispatch(landActions.transferLandCategoryNew(paramTransferLand));
            setTimeout(() => dispatch(objectsActions.resetLandSelectedMyLand()))
        }
        LandSelectedLocal = [];
    };
    const onDeleteCate = () => {
        const isCategoryEmptyLand = selectedCategoryMyLand && selectedCategoryMyLand.filter(c => c.landCount === 0);
        isCategoryEmptyLand.map(item => {
            dispatch(landActions.deleteLandCategory({userId: user._id, cateId: item._id}));
            return item
        });
        dispatch( screenActions.addPopup({ name:  'LoadingPopup' }));
        setTimeout(() => {
            dispatch( screenActions.removePopup({ name:  'LoadingPopup' }))
        },500);
        LandSelectedLocal = [];
    };
    const moveToLand = (quadKey) => {
        const center = QuadKeyToLatLong(quadKey);
        map && map.zoom === 22 ?  dispatch(mapActions.syncCenterMap(center, quadKey.length - 2, quadKey)) :  dispatch(mapActions.syncCenterMap(center))
    }
    return (
        <Fragment>
            <div className={'container-reserve'}>
                <div className={'header-reserve'}>
                    <div className={'header-child-reserve'}>
                        <img alt={'image searching'} src={loadingImage('/images/bloodLandNew/myLand/icon-title-my-land.png')}/>
                        <div><TranslateLanguage direct={'menuTab.myLand.landOwned'}/></div>
                        <div className='button-header'
                             onClick={() => dispatch(screenActions.removePopup({names: ['Reserve']}))}>
                            <div className='button-return'>
                                <div className='icon-button'/>
                            </div>
                        </div>
                    </div>
                    {(categoryList || typeof categoryList !== 'undefined') &&
                        <div className={'btn-action-header'}>
                            {btnActionMyLand.map((item,index) => {
                                const {imageUrl,name,lineSpace, type} = item;
                                return(
                                    <Fragment key={index}>
                                        <button className={`${screens && screens[`${type}`] ? 'active btn-items' : 'btn-items'}`} onClick={()=>handleClickBtn(type)}>
                                            <img alt={'image searching'} src={loadingImage(imageUrl)}/>
                                            {name}
                                        </button>
                                        <div className={lineSpace} style={{display: lineSpace ? 'inline' : 'none' }}/>
                                    </Fragment>
                                )
                            })}
                        </div>
                    }

                </div>
                {(categoryList || typeof categoryList !== 'undefined') && <Fragment>
                    <div className='checkAll-container'>
                        <div className='checkAll-title'>
                            <TranslateLanguage direct={'menuTab.myLand.landOwned.myTotalLand'}/>
                        </div>
                        <div className='friend-selected'>
                            <div style={{color: '#12354F'}}>(</div>
                            {(lands && lands.myLandAmount) || 0}
                            <div style={{color: '#12354F'}}>)</div>
                        </div>

                    </div>
                    <div className='line-container'/>
                </Fragment> }
                <div className={'body-reserve'} id={'body-reserve'}>
                        {(!categoryList || typeof categoryList === 'undefined') && <div  className={'reserve-container-loading'}>
                            <div className="lds-roller"> <div> </div><div> </div><div> </div><div> </div><div> </div><div> </div><div> </div>
                            </div> </div>}
                        {ListState && ListState.length === 0 ? <div className={'reverse-empty-container'}>
                            <img alt={'empty'} src={loadingImage('images/bloodlandNew/error-icon.png')}/>
                                <TranslateLanguage direct={'menuTab.myLand.landOwned.noInformation'}/>
                        </div>:
                        <div  className={'reserve-container'}>
                            { ListState && ListState.map((value,ind) => {
                                const {landCount, name, typeOfCate, userId, _id} = value;
                                const editNameFolder = isEditNameFolder === _id ;
                                const isCategoryOpen = currentCategoryId === _id;
                                return(
                                    <div key={ind} className={'container-list-total'} id={_id}>
                                        <div className='reserve-list-item'  >
                                            <div className='item-check-button'>
                                                <StyledCheckbox2 value={value} checked={selectedCategoryMyLand.some(c => c._id === _id)}
                                                                onChange={(e) => onCategorySelected(e)}/>
                                            </div>
                                            <div className='item-name' onClick={()=>!editNameFolder && landCount !==0 && _onHandleOpenFolder(_id)}>
                                                <img alt={'image open and close edit'} src={loadingImage(`${currentCategoryId === _id ? '/images/bloodLandNew/myLand/icon-open-file.png' : '/images/bloodLandNew/myLand/icon-file-closed.png'}`)}/>
                                                <div className={'name-folder'}>
                                                    {editNameFolder ?
                                                        <StyledInputText value={(categoryValue || categoryValue === '') ? categoryValue : name}
                                                        onChange={(e) => { setCategoryValue(e.target.value) }} />
                                                        :
                                                            <Fragment>
                                                                <span className={'name-child-folder'}>{name}</span>
                                                                <span>(<span style={{color: '#6EF488'}}>{landCount}/500</span>)</span>
                                                            </Fragment>
                                                        }
                                                </div>
                                            </div>
                                            <div className={`${editNameFolder ? 'item-edit-name edit' : 'item-edit-name'}`} >
                                                {editNameFolder ?
                                                    <Fragment>
                                                        <div className={'accept-rename'} onClick={() => categoryValue && onConfirmEditName(_id)}>
                                                            <img alt={'icon-accept'} src={loadingImage('images/bloodlandNew/icon-accept.png')}/>
                                                        </div>
                                                        <div className={'block-rename'} onClick={() => {setCategoryValue(name);setIsEditNameFolder()}}>
                                                            <img alt={'icon-block'} src={loadingImage('images/bloodlandNew/icon-block.png')}/>
                                                        </div>
                                                    </Fragment>
                                                    :
                                                    <div onClick={()=>setIsEditNameFolder(_id)}>
                                                        <img alt={'image searching'} src={loadingImage('/images/bloodLandNew/myLand/icon-rename.png')}/>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                        {editNameFolder && <div className='validation-alert' style={{color : 'red'}}>{validationRender()}</div>}
                                        <div className='line-container'/>
                                        {isCategoryOpen && <div className={'reverse-child-list'} id={'reserve-detail'} >
                                                {loading ? <div style={{display: 'flex', alignItems: 'center', justifyItems : 'center', justifyContent : 'center'}}><div className="lds-roller"> <div> </div><div> </div><div> </div><div> </div><div> </div><div> </div><div> </div> </div></div>
                                                    : <Fragment>
                                                        {objectList && objectList.map((item,index) => {
                                                            const {categoryId, forSaleStatus, quadKey ,sellPrice ,_id, name} = item;
                                                            const isLandEdit = isEditLandId === _id;
                                                            return(
                                                                <div className={`${forSaleStatus ? 'reverse-child-item isSelling' : 'reverse-child-item'}`} key={index} draggable={true} onDragEnd={(e) => onDragend(e, item)} >
                                                                    <div className='item-check-button'>
                                                                        <StyledCheckbox2 value={item}
                                                                                         checked={selectedLandMyLand.some(l => l.quadKey === quadKey)}
                                                                                         onChange={(e) => onLandSelected(e)}/>
                                                                    </div>
                                                                    <div className='item-name'>
                                                                        {isLandEdit ? <StyledInputText value={(landValue || landValue === '') ? landValue : name /*(name === '' ? quadKey : name)*/}
                                                                                                       onChange={(e) => {setLandValue(e.target.value)}} />
                                                                        : <span  onClick={()=>moveToLand(quadKey)}>{(name === '' ? quadKey : name )}</span>}
                                                                    </div>
                                                                    <div className='item-edit-name'>
                                                                        {isLandEdit ?
                                                                            <Fragment>
                                                                                <div className={'accept-rename'} onClick={() => landValue &&  onConfirmChangeName(_id, categoryId)}>
                                                                                    <img alt={'icon-accept'} src={loadingImage('images/bloodlandNew/icon-accept.png')}/>
                                                                                </div>
                                                                                <div className={'block-rename'} onClick={() => {setIsEditLandId();setLandValue()}}>
                                                                                    <img alt={'icon-block'} src={loadingImage('images/bloodlandNew/icon-block.png')}/>
                                                                                </div>
                                                                            </Fragment>
                                                                            :
                                                                            <div onClick={() => setIsEditLandId(_id)}>
                                                                                <img alt={'image searching'} src={loadingImage('/images/bloodLandNew/myLand/icon-rename.png')}/>
                                                                            </div>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </Fragment>
                                                }
                                        </div>}
                                    </div>
                                )
                            })}
                        </div>}

                </div>
            </div>
            {screens['CreateNewCategory'] && <CreateNewCategory />}
            {screens['CreateNewCategorySuccess'] && <CreateNewCategorySuccess />}
            {screens["SellLand"] && <SellLand {...screens["SellLand"]} />}
            {screens['NoCategorySelectedPopup'] && <NoCategorySelectedPopup/>}
            {screens['FolderNotEmptyPopup'] && <FolderNotEmptyPopup/>}
            {screens['DeleteCategoryConfirmPopup'] && <DeleteCategoryConfirmPopup onHandleDeleteCate={onDeleteCate}/>}
            {screens['LoadingPopup'] && <LoadingPopup/>}
            {screens['NewCategoryPopup'] && <NewCategory/>}
            {screens['NoSelectedPopup'] && <NoSelectedPopup/>}
            {screens['EmptyCategoryPopup'] && <EmptyCategoryPopup/>}
            {screens['NoLandCanSalePopup'] && <NoLandCanSalePopup/>}
            {screens['AllSelectedIsSellingPopup'] && <AllSelectedIsSellingPopup/>}
        </Fragment>
    )
}
export default ReserveComponent;