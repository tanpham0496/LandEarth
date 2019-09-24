import React, {memo, useEffect, useState , Fragment} from 'react';
import { useDispatch, useSelector } from "react-redux";
import {landActions} from "../../../../../../store/actions/landActions/landActions";
import {loadingImage} from '../../../general/System';
import TranslateLanguage from "../../../general/TranslateComponent";
import {loading, getNoInfoView} from "../../../common/Components/CommonScreen"
import {screenActions} from "../../../../../../store/actions/commonActions/screenActions";
import LandCertificatePopup from "../../../common/Components/LandCertificate"
import LoadingPopup from "../../../common/Popups/commomPopups/LoadingPopup";
import LandCertificateImage from "../../../common/Components/LandCertificate/landCertificateImage";
import _ from 'lodash';
import useInfiniteScroll from "../../../general/UseInfinityScroll";
import {infiniteScroll} from "../../../../../../helpers/config";

const LandCertifications = memo((props) => {
    const dispatch = useDispatch();
    const {lands, authentication: {user} , screens} = useSelector(state => state);
    const { PREVIOUS_SCREEN, handleChangeScreen } = props;
    const [myLandQuadKeysState, setMyLandQuadKeysState ]  = useState();
    const fetchMoreListItems = () =>  {
        setTimeout(() => {
            setMyLandQuadKeysState(prevState => ([...prevState, ...lands.myLandQuadKeys.slice(prevState.length , prevState.length  + 20) ]));
            setIsFetching(false);
        }, 500);
    }
    const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems , "land-certification-scroll");
    useEffect(() => {
        if(user && user._id) dispatch(landActions.getAllLandById(user && user._id));
    }, []);

    useEffect(() => {
        if(_.isArray(lands.myLandQuadKeys) && lands.myLandQuadKeys){
            infiniteScroll ? setMyLandQuadKeysState(lands.myLandQuadKeys.slice(0,40)) : setMyLandQuadKeysState(lands.myLandQuadKeys)
        }
    }, [lands]);

    const onHandleClickLand = (quadKey) => {
        dispatch(landActions.getLandInfo({quadKey}));
        dispatch(screenActions.addPopup({name:'LandCertificatePopup'}));
    };

    const landListRender = () => {
        return lands.myLandAmount
            ? <div className='land-certification-ui-screen' id="land-certification-scroll">
                  {myLandQuadKeysState && myLandQuadKeysState.map((quadKey, index) => {
                        return (
                          <div className='land-certificate-item' key={index} onClick={() => onHandleClickLand(quadKey)}>
                              {index + 1}. { quadKey }
                          </div>
                      )
                  })}
              </div>
            : getNoInfoView(PREVIOUS_SCREEN, handleChangeScreen);


    };

    return (
        <Fragment>
            <div className='screen-title'>
                <img src={loadingImage('/images/game-ui/tab2/nav3.svg')} alt=''/>
                <div>
                    <TranslateLanguage direct={'menuTab.myLand.certified'}/>
                </div>
            </div>
            {!_.isNumber(lands.myLandAmount) ? loading() : landListRender()}
            {screens['LandCertificatePopup'] && <LandCertificatePopup/>}
            {screens['LoadingPopup'] && <LoadingPopup/>}
            {screens['LandCertificateImage'] && <LandCertificateImage/>}
        </Fragment>
    )
});

export default LandCertifications