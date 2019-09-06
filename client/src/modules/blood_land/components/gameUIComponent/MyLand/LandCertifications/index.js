import React, {memo, useEffect, Fragment} from 'react';
import connect from "react-redux/es/connect/connect";
import {landActions} from "../../../../../../store/actions/landActions/landActions";
import {loadingImage} from '../../../general/System';
import TranslateLanguage from "../../../general/TranslateComponent";
import {loading, getNoInfoView} from "../../../common/Components/CommonScreen"
import {screenActions} from "../../../../../../store/actions/commonActions/screenActions";
import LandCertificatePopup from "../../../common/Components/LandCertificate"
import LoadingPopup from "../../../common/Popups/commomPopups/LoadingPopup";
import LandCertificateImage from "../../../common/Components/LandCertificate/landCertificateImage"
const LandCertifications = memo((props) => {
    const {myLands, PREVIOUS_SCREEN, handleChangeScreen, addPopup , screens} = props;
    useEffect(() => {
        const {user: {_id}, getAllLandById} = props;
        getAllLandById(_id)
    }, []);


    const onHandleClickLand = (land) => {
        props.getLandInfo(land.quadKey);
        addPopup({name:'LandCertificatePopup'})
    };

    const landListRender = () => {
        return myLands.length === 0 ? getNoInfoView(PREVIOUS_SCREEN, handleChangeScreen) :
            <div className='land-certification-ui-screen'>
                {myLands.map((land, index) => {
                    const {name, quadKey} = land;
                    return (
                        <div className='land-certificate-item' key={index} onClick={() => onHandleClickLand(land)}>
                            {index + 1}. {name ? name : quadKey}
                        </div>
                    )
                })}
            </div>


    };

    return (
        <Fragment>
            <div className='screen-title'>
                <img src={loadingImage('/images/game-ui/tab2/nav3.svg')} alt=''/>
                <div>
                    <TranslateLanguage direct={'menuTab.myLand.certified'}/>
                </div>
            </div>
            {!myLands ? loading() : landListRender()}
            {screens['LandCertificatePopup'] && <LandCertificatePopup/>}
            {screens['LoadingPopup'] && <LoadingPopup/>}
            {screens['LandCertificateImage'] && <LandCertificateImage/>}
        </Fragment>
    )
});


const mapStateToProps = (state) => {
    const {lands: {myLands}, authentication: {user}, map , screens} = state;
    return {
        myLands,
        user,
        map, screens
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getAllLandById: (userId) => dispatch(landActions.getAllLandById(userId)),
        getLandInfo: (quadKey) => dispatch(landActions.getLandInfo({quadKey})),
        addPopup: (screen) => dispatch(screenActions.addPopup(screen))
    };
};

const connectedPage = connect(mapStateToProps, mapDispatchToProps)(LandCertifications);
export default connectedPage;
