import React, {Fragment, useEffect, useState} from 'react';
import {useDispatch ,useSelector} from "react-redux";
import {loadingImage} from "../../../../blood_land/components/general/System";
import {screenActions} from "../../../../../store/actions/commonActions/screenActions";
import useInfiniteScroll from "../../../../blood_land/components/general/UseInfinityScroll";
import {landActions, TranslateLanguage} from "../../../../../helpers/importModule";
import LandCertificatePopup from "../../Popup/LandCertificate/LandCertificatePopup";
import LandCertificateImage from "../../Popup/LandCertificate/landCertificateImage";

// let list = [];
// for (let i = 0; i < 100; i++) {
//     let temp = { type : i, name : 'Mr.hello' };
//     list.push(temp);
// }

const RegisteredComponent = () => {
    const dispatch = useDispatch();
    const [ListState, setListState] = useState();
    const {lands, lands : {myLandQuadKeys}, authentication: {user} , screens} = useSelector(state => state);

    const fetchMoreListItems = () => {
        setTimeout(() => {
            setListState(prevState => ([...prevState, ...myLandQuadKeys.slice(prevState.length, prevState.length + 30)]));
            setIsFetching(false);
        }, 500);
    };
    const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems, "body-registered");

    useEffect(() => {
        if (lands && myLandQuadKeys && Array.isArray(myLandQuadKeys)) {
            setListState(myLandQuadKeys.slice(0, 30))
        }
    }, [myLandQuadKeys]);

    const onHandleClickLand = (quadKey) => {
        dispatch(landActions.getLandInfo({quadKey}));
        dispatch(screenActions.addPopup({name:'LandCertificatePopup'}));
    };


    return (
        <Fragment>
            <div className={'container-registered'}>
                <div className={'header-registered'}>
                    <div className={'header-child-registered'}>
                        <img alt={'image searching'} src={loadingImage('/images/bloodLandNew/myLand/icon-RegisteredLand.png')}/>
                        <div><TranslateLanguage direct={'menuTab.myLand.certified'}/></div>
                        <div className='button-header'
                             onClick={() => dispatch(screenActions.removePopup({names: ['RegisteredLand']}))}>
                            <div className='button-return'>
                                <div className='icon-button'/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='checkAll-container'>
                    <div className='checkAll-title'>
                        <TranslateLanguage direct={'menuTab.myLand.certified.total'}/>
                    </div>
                    <div className='amount-sale' style={{display : 'flex'}}>
                        <div style={{color: '#12354F'}}>(</div>
                        {(lands && lands.myLandQuadKeys.length) || 0}
                        <div style={{color: '#12354F'}}>)</div>
                    </div>

                </div>
                <div className='line-container'/>
                <div className={'body-registered'} id={'body-registered'}>
                    {ListState && ListState.length === 0 ? <div className={'registered-empty-container'}>
                            <img alt={'empty'} src={loadingImage('images/bloodlandNew/error-icon.png')}/>
                            <TranslateLanguage direct={'menuTab.myLand.certified.getNoInfoView.noInformation'}/>
                        </div>:
                        <div  className={'registered-container'}>
                            { ListState && ListState.map((value,ind) => {
                                return(
                                    <div key={ind} className={'container-list-total'} onClick={()=>onHandleClickLand(value)}>
                                        <div className='registered-list-item' >
                                            <div className='item-check-button' >
                                                {ind + 1}
                                            </div>
                                            <div className='item-name'>
                                                {value}
                                            </div>
                                            <div className='item-money-blood'>
                                                <img alt={'image certification'} src={loadingImage('/images/bloodLandNew/myLand/icon-certification.png')}/>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>}

                </div>
            </div>
            {screens['LandCertificatePopup'] && <LandCertificatePopup/>}
            {screens['LandCertificateImage'] && <LandCertificateImage/>}
        </Fragment>
    )
}
export default RegisteredComponent;
