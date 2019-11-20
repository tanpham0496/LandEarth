import React, {Fragment, memo} from "react";
import {loadingImage, QuadKeyToLatLong} from "../../../../blood_land/components/general/System";
import TranslateLanguage from "../../../../blood_land/components/general/TranslateComponent";
import {Modal} from "reactstrap";
import { landActions, mapActions ,screenActions } from "../../../../../helpers/importModule";
import {connect} from "react-redux";
import ReactMapGL from 'react-map-gl';
import {mapBoxKey} from "../../../../../helpers/config";
const formatCharacter = (name) => {
    if (!name) return "";
    const nameLength = name && name.length;
    return name.slice(0, Math.ceil(nameLength * 0.3)).padEnd(nameLength, 'X');
};

const LandCertificatePopup = memo(props => {
    const {removePopup, landInfo, addPopup, user  } = props;
    const moveToLand = () => {
        const {map, gameMode, saveLandSelectedPosition, syncCenterMap} = props;
        const {info: {quadKey}} = landInfo;
        const center = QuadKeyToLatLong(quadKey);
        map && map.zoom === 22 && gameMode && saveLandSelectedPosition(landInfo.info);
        map && map.zoom === 22 ? syncCenterMap(center, quadKey.length - 2, quadKey) : syncCenterMap(center);
        removePopup({name: 'LandCertificatePopup'})
    };
    const certificateInfoRender = () => {
        const {info, info: {purchaseDateFormat, quadKey, purchasePrice, initialPrice, txid, latlng: {lat, lng}}} = landInfo;
        return (
            <Fragment>
                <div className='custom-modal-body'>
                    <div className='land--certificate-grid-container'>
                        <div className="cell bottom-border"><TranslateLanguage direct={'menuTab.myLand.certified.selectedLand'}/></div>
                        <div className="cell bottom-border"><TranslateLanguage direct={'menuTab.myLand.certified.content'}/> </div>
                        <div className="cell top-padding"><TranslateLanguage direct={'menuTab.myLand.certified.ownInfo'}/> </div>
                        <div className="cell top-padding">{user.wId === info.user.wId ? info.user.wId : formatCharacter(info.user.wId)}</div>
                        <div className="cell"><TranslateLanguage direct={'menuTab.myLand.certified.firstLandPrice'}/> </div>
                        <div className="cell">{initialPrice.toLocaleString()} Blood</div>
                        <div className="cell"><TranslateLanguage direct={'menuTab.myLand.certified.purchasedPrice'}/> </div>
                        <div className="cell">{purchasePrice.toLocaleString()} Blood</div>
                        <div className="cell"><TranslateLanguage direct={'menuTab.myLand.certified.datePurchase'}/> </div>
                        <div className="cell">{purchaseDateFormat}</div>
                        <div className="cell bottom-padding"><TranslateLanguage direct={'menuTab.myLand.certified.hashInfo'}/></div>
                        <div className="cell hash-key">{user.wId === info.user.wId ? txid : formatCharacter(txid)}</div>
                        <div className="cell top-border top-padding"><TranslateLanguage direct={'menuTab.myLand.certified.cellInfo'}/></div>
                        <div className="cell top-border top-padding">
                            <div>Quadkey : {quadKey}</div>
                            <div><TranslateLanguage
                                direct={'menuTab.myLand.certified.GPSCoor'}/> : {lat}(<TranslateLanguage
                                direct={'menuTab.myLand.certified.latitude'}/>),
                                {lng}(<TranslateLanguage direct={'menuTab.myLand.certified.longitude'}/>)
                            </div>
                            <div className='img-quadkey-lammao'>
                                <div className='google-map-lite'>
                                    <ReactMapGL
                                        width='auto'
                                        height='20vh'
                                        mapStyle={'mapbox://styles/mapbox/streets-v11'}
                                        mapboxApiAccessToken={mapBoxKey}
                                        latitude={lat}
                                        longitude={lng}
                                        zoom={14}
                                    >
                                    </ReactMapGL>
                                    <div className='cell-center' onClick={() => moveToLand()}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='certification-lammao' onClick={() => addPopup({name: 'LandCertificateImage'})}>
                    <img src={process.env.PUBLIC_URL + `/images/bloodland-ui/certificate-sample.png`} alt=''/>
                </div>
                <div className='custom-modal-footer-action-group-certificate' style={{height: '52px'}}>
                    <button onClick={() => removePopup({name: 'LandCertificatePopup'})}>
                        <div>
                            <TranslateLanguage direct={'menuTab.myLand.certified.closeBtn'}/>
                        </div>
                    </button>
                </div>
            </Fragment>

        )
    };
    return (
        <Fragment>
            {!landInfo ? addPopup({name: 'LoadingPopup'}) : removePopup({name: 'LoadingPopup'})}
            {landInfo && <Modal isOpen={true} backdrop="static" className={`custom-modal modal-land-certificate`}>
                <div className='custom-modal-header'>
                    <img src={loadingImage('/images/bloodLandNew/myLand/icon-RegisteredLand.png')} alt=''/>
                    <TranslateLanguage direct={'menuTab.myLand.certified'}/>
                    <div className='button-header'
                         onClick={() => removePopup({name: 'LandCertificatePopup'})}>
                        <div className='button-return'>
                            <div className='icon-button'/>
                        </div>
                    </div>
                </div>
                <div className="line-container"> </div>
                {certificateInfoRender()}
            </Modal>}
        </Fragment>

    )
});


const mapStateToProps = (state) => {
    const {lands: {landInfo}, authentication: {user}, settingReducer: {gameMode}, map } = state;
    return {
        landInfo, user, gameMode, map
    }
};

const mapDispatchToProps = (dispatch) => ({
    removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
    addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
    syncCenterMap: (center, zoom, centerQuadKey) => dispatch(mapActions.syncCenterMap(center, zoom, centerQuadKey)),
    saveLandSelectedPosition: (landSelected) => dispatch(landActions.saveSelectedLandPosition(landSelected)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LandCertificatePopup)