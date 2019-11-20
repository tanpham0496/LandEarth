import React, {Fragment, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {loadingImage} from "../../../../blood_land/components/general/System";
import {StyledCheckbox2} from "../../../../../components/customStyled/Checkbox2_style";
import useInfiniteScroll from "../../../../blood_land/components/general/UseInfinityScroll";
import {landActions, TranslateLanguage, screenActions} from "../../../../../helpers/importModule";
import {btnActionLandForSale} from '../../Menu/data';
import {NoSelectedToModified, NoSelectedToRemove, SellLandRemovePopup} from '../../Popup/myland'
import SellLandModify from "./SellLandModify";


const LandForSaleComponent = () => {
    const dispatch = useDispatch();
    const [ListState, setListState] = useState();

    const {lands , lands : {forSaleLands} ,authentication : {user},screens} = useSelector(state=>state);
    useEffect(() => {
        const wToken = user.wToken;
        dispatch(landActions.getListForSaleLands({ wToken }));
    }, []);
    
    const fetchMoreListItems = () => {
        if(lands && lands.forSaleLands) {
            setTimeout( () => {
                setListState( prevState => ([...prevState, ...forSaleLands.slice( prevState.length, prevState.length + 30 )]) );
                setIsFetching( false );
            }, 500 );
        }
    };
    const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems, "body-landForSale");

    useEffect(() => {
        if (forSaleLands && Array.isArray(forSaleLands)) {
            setListState(forSaleLands.slice(0, 30));
        }
    }, [forSaleLands]);

    const handleActionLandForSale = (type) => {
        const landForSaleSelected = forSaleLands && forSaleLands.filter(l => l.checked);
        switch (type) {
            case 'EditLandSell' :
                if(landForSaleSelected.length === 0){
                    dispatch(screenActions.addPopup({name: 'NoSelectedToModified'}));
                }else{
                    dispatch(screenActions.addPopup({name: 'SaleLandModifiedPopup' , data: {landForSaleSelected}}));
                }
                break;
            case 'RemoveSellLand':
                if(landForSaleSelected.length === 0) dispatch(screenActions.addPopup({names : ['NoSelectedToRemove']}));
                else dispatch(screenActions.addPopup({name : 'SellLandRemovePopup', data: {landForSaleSelected}}));
                break;
            default:
                break;
        }
    };

    const _onHandleCheckAll = () => {
        const onCheckAll = forSaleLands && [...ListState].filter(fl => fl.checked === true).length  ===  [...forSaleLands].length;
        if(onCheckAll) {
            let  friendListCheckAll = [...forSaleLands].map(fl => fl.checked = false);
            setListState([...forSaleLands],friendListCheckAll);
        }
        else{
            let  friendListCheckAll = [...forSaleLands].map(fl => fl.checked = true);
            setListState([...forSaleLands],friendListCheckAll);
        }
    }
    const _handLeCheckItemForSale = (quadKey) => {
        const ListStateNew = [...ListState].map(item => {
            if(item.quadKey === quadKey){
                item.checked = !item.checked;
            }
            return item;
        });
        setListState(ListStateNew);

    };
    return (
        <Fragment>
            <div className={'container-landForSale'}>
                <div className={'header-landForSale'}>
                    <div className={'header-child-landForSale'}>
                        <img alt={'image searching'} src={loadingImage('/images/bloodLandNew/myLand/icon-LandForSale.png')}/>
                        <div><TranslateLanguage direct={'menuTab.myLand.landSold'}/></div>
                        <div className='button-header'
                             onClick={() => dispatch(screenActions.removePopup({names: ['LandForSale']}))}>
                            <div className='button-return'>
                                <div className='icon-button'/>
                            </div>
                        </div>
                    </div>
                    {(forSaleLands || typeof forSaleLands !== 'undefined') &&
                        <div className={'btn-action-header'}>
                            {btnActionLandForSale.map((item,index) => {
                                const {imageUrl,name,lineSpace, type} = item;
                                return(
                                    <Fragment key={index}>
                                        <button className={`${screens && screens[`${type}`] ? 'active btn-items' : 'btn-items'}`} onClick={()=>handleActionLandForSale(type)}>
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
                {(!forSaleLands || typeof forSaleLands === 'undefined')  ?  <div  className={'body-landForSale-loading'}>
                    <div className="lds-roller"> <div> </div><div> </div><div> </div><div> </div><div> </div><div> </div><div> </div>
                    </div> </div> :
                <Fragment>
                    <div className={'total-land-sales'}>
                        <TranslateLanguage direct={'menuTab.myLand.landSold.MyLandsCounter.heading'}/>
                        ( <span style={{color: '#6EF488'}}> {forSaleLands && forSaleLands.length} </span>) </div>
                    <div className='checkAll-container'>
                        <div className='checkAll-button'>
                            <StyledCheckbox2 value='checkAll' onChange={_onHandleCheckAll}
                                             checked={ListState && ListState.filter(fl=> fl.checked === true).length === ListState.length }
                            />
                        </div>
                        <div className='checkAll-title'>
                            <TranslateLanguage direct={'menuTab.myLand.landSold.MyLandsCounter.checkAllButton'}/>
                        </div>
                        <div className='amount-sale' style={{display : 'flex'}}>
                            <div style={{color: '#12354F'}}>(</div>
                            <span style={{color: '#6EF488'}}>{(ListState && ListState.filter(fl=> fl.checked === true).length) || 0}/{forSaleLands && forSaleLands.length} </span>
                            <div style={{color: '#12354F'}}>)</div>
                        </div>

                    </div>
                    <div className='line-container'/>
                    <div className={'body-landForSale'} id={'body-landForSale'}>
                        {ListState && ListState.length === 0 ? <div className={'landForSale-empty-container'}>
                                <img alt={'empty'} src={loadingImage('images/bloodlandNew/error-icon.png')}/>
                                <TranslateLanguage direct={'menuTab.myLand.landSold.noInformation'}/>
                            </div>:
                            <div  className={'landForSale-container'}>
                                { ListState && ListState.map((item,ind) => {
                                    const {name, quadKey, sellPrice, checked} = item;
                                    return(
                                        <div key={ind} className={'container-list-total'}>
                                            <div className='landForSale-list-item' >
                                                <div className='item-check-button'>
                                                    <StyledCheckbox2  checked={checked} onChange={() => _handLeCheckItemForSale(quadKey)}/>
                                                </div>
                                                <div className='item-name'>
                                                    {name !=='' ? name : quadKey};
                                                </div>
                                                <div className='item-money-blood'>
                                                    {sellPrice}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>}

                    </div>
                </Fragment>}


            </div>
            {screens['NoSelectedToRemove'] && <NoSelectedToRemove/>}
            {screens['SellLandRemovePopup'] && <SellLandRemovePopup {...screens['SellLandRemovePopup']}/>}
            {screens['SaleLandModifiedPopup'] && <SellLandModify/>}
            {screens['NoSelectedToModified'] && <NoSelectedToModified/>}
        </Fragment>
    )
}
export default LandForSaleComponent;
