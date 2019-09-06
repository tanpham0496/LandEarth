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
import connect from "react-redux/es/connect/connect";
import MapBoxGLLayer from './MapBoxGLLayer';
import { Map as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';
//import { reducer } from '../../../../../../';

function LandCertificateImageComponent(props){
     console.log('props-------------',props);
    const { user, landInfo,quadKey, screens } = props;
    useEffect(() => {
        props.getLandInfo(quadKey);
    }, []);

        if(!landInfo || !user) return <div>Loading</div>;


    const {status, info} = landInfo;
    if (status && info) {
        const { purchaseDateFormat, latlng: { lat, lng } } = info;
        return (
            <Fragment>
            {screens['LandCertificateImageComponent'] && <Modal isOpen={Boolean(screens['LandCertificateImageComponent'])} backdrop="static" className={`custom-modal modal--certificate`}>
                <span className="lnr lnr-cross lnr-custom-close" onClick={() => props.removePopup({ name: "LandCertificateImageComponent" })}/>
                <div className='certificate'>
                    <div className='certificate-content'>
                        <div>
                            ID
                            : {user && user.wId && user.wId === info.user.wId ? info.user.wId : formatCharacter(info.user.wId)}
                        </div>
                        <div style={{display: 'flex'}}>
                            <div>LOCATION :</div>
                            <div>
                                Latitude {lat} <br/>
                                Longitude {lng}
                            </div>
                        </div>
                    </div>
                    <div className='certificate-date'>
                        {purchaseDateFormat}
                    </div>
                    <div className='certificate-signature'>
                        <img src={process.env.PUBLIC_URL + `/images/bloodland-ui/sample-signature.png`} alt=''/>
                    </div>
                </div>
            </Modal>}
            </Fragment>
        )
    }
}

export default connect(
    state => {
        const { authentication: { user }, lands: { landInfo }, screens } = state;
        return { user, landInfo, screens };
    },
    dispatch => ({
        getLandInfo: (quadKey) => dispatch(landActions.getLandInfo({quadKey})),
        removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
    })
)(LandCertificateImageComponent);