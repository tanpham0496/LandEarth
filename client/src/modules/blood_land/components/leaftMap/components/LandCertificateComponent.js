import React, { Fragment, PureComponent, useState, useRef, useEffect, useReducer } from 'react'
import {Modal} from "reactstrap";
// import moment from "moment";
import GoogleMap from 'google-map-react';
import TranslateLanguage from "../../general/TranslateComponent";
import { formatCharacter } from './LeafMapFunction';
import {
    mapActions, landActions, screenActions,
    LatLongToTileXY, TileXYToQuadKey, TileXYToLatLong, QuadKeyToLatLong, QuadKeyToTileXY,
    loadingImage,
} from "../../../../../helpers/importModule";
import { connect, useDispatch, useSelector } from "react-redux";
import MapBoxGLLayer from './MapBoxGLLayer';
import { Map as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';
import LandCertificateImageComponent from './LandCertificateImageComponent';

function LandCertificateComponent(props){
    const dispatch = useDispatch();
    const { quadKey } = props;
    const screens = useSelector(state => state.screens);
    const user = useSelector(state => state.authentication.user);
    const landInfo = useSelector(state => state.lands.landInfo);

    const h = useSelector((state, action) => {
        console.log('action', action);
    });

    //get Land Info
    useEffect(() => {
        dispatch(landActions.getLandInfo({quadKey}))
    }, []);
    
    const onHandleGoToLocation = (quadKey) => {
        const center = QuadKeyToLatLong(quadKey);
        dispatch(mapActions.syncCenterMap(center, quadKey.length - 2, quadKey))
        dispatch({ type: 'REMOVE_POPUP', name: "LandCertificateComponent" });
    }

    if(!landInfo || !user) return <div>Loading</div>;
    const { info, status } = landInfo;
    if(!status) return null;
    //console.log('landInfo', landInfo);
    const { latlng: { lat, lng }, purchaseDateFormat, purchasePrice, initialPrice, txid } = info;
    return (
        <Fragment>
            {screens["LandCertificateComponent"] && <Modal isOpen={true} backdrop="static" className={`custom-modal modal--land-centificate`}>
                <div className='custom-modal-header'>
                    <img src={loadingImage('/images/game-ui/tab2/nav3.svg')} alt=''/>
                    <TranslateLanguage direct={'menuTab.myLand.certified'}/>
                    <span className="lnr lnr-cross lnr-custom-close" onClick={() => dispatch({ type: 'REMOVE_POPUP', name: "LandCertificateComponent" }) }/>
                </div>
                <Fragment>
                    <div className='custom-modal-body'>
                        <div className='land-certificate-grid-container'>
                            <div className="cell bottom-border"><TranslateLanguage direct={'menuTab.myLand.certified.selectedLand'}/></div>
                            <div className="cell bottom-border"><TranslateLanguage direct={'menuTab.myLand.certified.content'}/></div>

                            <div className="cell top-padding"><TranslateLanguage direct={'menuTab.myLand.certified.ownInfo'}/></div>
                             <div className="cell top-padding">{user.wId === info.user.wId ? info.user.wId : formatCharacter(info.user.wId)}</div>

                            <div className="cell"><TranslateLanguage direct={'menuTab.myLand.certified.firstLandPrice'}/></div>
                            <div className="cell">{initialPrice.toLocaleString()} Blood</div>

                            <div className="cell"><TranslateLanguage direct={'menuTab.myLand.certified.purchasedPrice'}/></div>
                            <div className="cell">{purchasePrice.toLocaleString()} Blood</div>

                            <div className="cell"><TranslateLanguage direct={'menuTab.myLand.certified.datePurchase'}/></div>
                            <div className="cell">{purchaseDateFormat}</div>

                            <div className="cell bottom-padding"><TranslateLanguage direct={'menuTab.myLand.certified.hashInfo'}/></div>
                                <div className="cell hash-key">{formatCharacter(txid)}</div>

                            <div className="cell top-border top-padding"><TranslateLanguage direct={'menuTab.myLand.certified.cellInfo'}/></div>
                            <div className="cell top-border top-padding">
                                <div>Quadkey : {quadKey}</div>
                                <div><TranslateLanguage direct={'menuTab.myLand.certified.GPSCoor'}/> : {lat}(<TranslateLanguage direct={'menuTab.myLand.certified.latitude'}/>), 
                                                                                                        {lng}(<TranslateLanguage direct={'menuTab.myLand.certified.longitude'}/>)
                                </div>
                                <div className='img-quadkey-lammao'>
                                    <div className='google-map-lite'>
                                        <LeafletMap
                                            center={[lat, lng]}
                                            zoom={14}
                                            //user={user}
                                            maxZoom={22}
                                            attributionControl={false}
                                            zoomControl={false}
                                            doubleClickZoom={false}
                                            scrollWheelZoom={false}
                                            dragging={true}
                                            animate={true}
                                            easeLinearity={0.35}
                                        >
                                            <MapBoxGLLayer accessToken='pk.eyJ1Ijoibmd1eWVucXVhbjEzIiwiYSI6ImNqeWwxMXBpejAzankzY3Q0czBjeHVuZ3IifQ.Rbuh_pPMRWpj_mUi1VRcUA' style='mapbox://styles/nguyenquan13/cjyl18qu4106a1do20r6j7wii' />
                                        </LeafletMap>
                                        <div className='cell-center' onClick={() => onHandleGoToLocation(quadKey)}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='certification-lammao' onClick={() => dispatch({type: 'ADD_POPUP', name: "LandCertificateImageComponent", data: {quadKey}}) }>
                        <img src={process.env.PUBLIC_URL + `/images/bloodland-ui/certificate-sample.png`} alt=''/>
                    </div>
                    <div className='custom-modal-footer-action-group' style={{height: '52px'}}>
                        <button onClick={() => dispatch({ type: 'REMOVE_POPUP', name: "LandCertificateComponent" }) }>
                            <img src={process.env.PUBLIC_URL + `/images/game-ui/sm-close.svg`} alt=''/>
                            <div>
                                <TranslateLanguage direct={'menuTab.myLand.certified.closeBtn'}/>
                            </div>
                        </button>
                    </div>
                </Fragment>
            </Modal>}
            
        </Fragment>
       
    )
}

export default LandCertificateComponent;