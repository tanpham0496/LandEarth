import React, { PureComponent, useState, useRef, useEffect, useReducer } from 'react'
import ReactDOMServer from "react-dom/server";
import MapBoxGLLayer from './MapBoxGLLayer';
import update from 'immutability-helper';
import JsxMarker from './JsxMarker';
import DivIcon from 'react-leaflet-div-icon';
import { Map as LeafletMap, TileLayer, Marker, Popup } from 'react-leaflet';
import * as L from "leaflet";
import connect from "react-redux/es/connect/connect";
import uniq from "lodash.uniq";
import isNull from "lodash.isnull";
import isEqual from "lodash.isequal";
import {
    mapActions, landActions, screenActions,
    LatLongToTileXY, TileXYToQuadKey, TileXYToLatLong, QuadKeyToLatLong, QuadKeyToTileXY,
    loadingImage
} from "../../../../../helpers/importModule";
import { toggleLandIcon } from "../../landMapComponent/component/asset";
import { covertDragPositionToQuadkey } from "../../gameMapComponent/component/GameMapFunction";
import {
    calculatorLand,
    removeDuplicates,
    checkInCountry,
} from '../../landMapComponent/component/MapFunction';
import _ from "lodash";
import TranslateLanguage from "../../general/TranslateComponent";
import {Modal} from "reactstrap";
import LandCertificateComponent  from './LandCertificateComponent';

const LIMIT_ZOOM_SELECTED = 20;
const DEFAULT_LEVEL_OFFSET = 2;
const PARENT_1_RANGE = 4;
const PARENT_2_RANGE = 5;

function createClassLand({props}){
    let arrClassName = [];
    if(props.zoom === 22){
        const { tile: { land, selected, isCenter }, user } = props;
        if(!land) return [];
        if(land.outsideOpenCountries) return ['forbid'];
        if (land.user) {
            if (land.landmark){
                arrClassName.push('landmark');
            } else {
                if (land.user._id === user._id) { //is MyLand
                    arrClassName.push('myLand');
                    if (land.forSaleStatus === true) arrClassName.push('myForSell');
                } else { //is other user
                    arrClassName.push(land.forSaleStatus === true ? 'forSell' : 'noSell')
                }
            }
        }
        if(selected) arrClassName.push('selected');
        if(isCenter) arrClassName.push('center');
        //console.log('arrClassName', arrClassName);
    } else {
        if(!props.tile) return [];
        if(props.tile.outsideOpenCountries) return ['forbid'];

        const { tile: { canBuy, canNotBuy, totalCount } } = props;
        if(canBuy === totalCount) return [];
        else if (canNotBuy === totalCount) arrClassName.push('noSell');
        else arrClassName.push('partial');
        //console.log('arrClassName',arrClassName)
    }
    return arrClassName;
}

function renderTileDetailHtml ({ props, toggleCertification, clsName, infoHtml }) {
    const { tile: { quadKey, totalCount } } = props;
    return (
        <React.Fragment>
            {
                toggleCertification &&
                <div className="toggle-land-button-container-leftMap">
                    <div id={'hover-icon-' + quadKey} className='toggle-land-button'>
                        <img src={toggleLandIcon} alt='' />
                    </div>

                </div>
            }
            {(clsName.indexOf('partial') !== -1 || clsName.indexOf('noSell') !== -1 || clsName.indexOf('myLand') !== -1 || clsName.indexOf('myForSell') !== -1) && infoHtml}

            {clsName.indexOf('center') !== -1 ? <div className='centick' /> : null}
            {(clsName.indexOf('myForSell') !== -1 && clsName.indexOf('myLand') === -1) || clsName.indexOf('forSell') !== -1 ?
                <div className='fs-cont'>
                    <div className="fs-img" />
                    <div className='fs-title'> for sale</div>

                </div>
                : ''
            }
            {clsName.indexOf('myLand') !== -1 && clsName.indexOf('myForSell') === -1 ?
                <div className='ml-cont'>
                    <div className="ml-img" />
                    <div className='ml-title'> my land</div>
                </div>
                : ''
            }
            {clsName.indexOf('myLand') !== -1 && clsName.indexOf('myForSell') !== -1 ?
                <div className='fl-cont' style={{ marginTop: '22px' }}>
                    <div className='fs-cont'>
                        <div className="fs-img" />
                        <div className='fs-title'> for sale</div>
                    </div>
                    <div className='ml-cont'>
                        <div className="ml-img" />
                        <div className='ml-title'> my land</div>
                    </div>
                </div> : ''
            }
        </React.Fragment>

    );
}

function LandTileComponent(props) {
    const { tile: { quadKey, land }, tile, lat, lng, user, tileStart, map: { zoom } } = props;
    const [toggleCertification, setToggleCertification] = useState(false); //hover land show certificate
    const [toolTipDisplay, setToolTipDisplay] = useState(false);
    
    const createInfoLandZoomLower23 = ({ props }) => {
        const { tile: { totalCount, canBuy, canNotBuy, quadKey }, zoom, settings } = props;
        if (zoom === 22 || !settings || !settings.land || !settings.land.showInfo) return "";
        return (
            <div className='cell'>
                <div>
                    <div className='cell-info' id={'hover-land-info-icon-' + quadKey}>
                        {/* <img src={cellInfoImg} alt=''/> */}
                        <span className='can-buy'>{canNotBuy}/&nbsp;</span><span
                        className='total-count'>{totalCount}</span>
                        { toolTipDisplay &&
                        <span className="tooltiptext-land">
                                <div>
                                    <div>총 랜드: {totalCount}</div>
                                <div> 구매 가능 랜드: {canBuy} </div>
                                    <div> 이미 판매된 랜드: {canNotBuy} </div>
                                </div>
                            </span>
                        }
                    </div>
                </div>
            </div>
        )
    }

    //==============================================MOUSE EVENT=====================================================
    //tile click
    const tileClick = ({e, tile}) => {
        //console.log('{e, tile}',{e, tile});
        const MIN_OFFSET = 0;
        const MAX_OFFSET = 20;
        if(toggleCertification && e.originalEvent.offsetX > MIN_OFFSET && e.originalEvent.offsetX < MAX_OFFSET && e.originalEvent.offsetY > MIN_OFFSET && e.originalEvent.offsetY < MAX_OFFSET){
            props.addPopup({ name: 'LandCertificateComponent', data: { quadKey } });
        } else {
            console.log('Tile click select Land!!');
            props.tileClick(tile);
        }
    }

    //Hover show icon certificate
    const tileMouseOver = ({e, tile}) => {
        if(!tileStart){ //sigle hover
            if(zoom === 22){
                if(tile.land && tile.land.user && tile.land.forbid === false){
                    setToggleCertification(true);
                }
            } else {
                setToolTipDisplay(true);
            }
        } else { //multi selection hover
            props.tileMouseEnter(tile);
        }
    }

    //hide icon certificate when leave
    const tileMouseLeave = ({ e, tile}) => {
        if(zoom === 22){
            setToggleCertification(false);
        } else {
            setToolTipDisplay(false);
        }
    }

    const tileRightMouseClick = ({ e, tile }) => {
        const { selected } = props.map;
        if(Array.isArray(selected)){
            const isTileInSelected = selected.some(tileSelected => tileSelected.quadKey === tile.quadKey);
            if(isTileInSelected){
                props.addPopup({ name: "ContextMenu" });
            }
            else{
                props.removePopup({ name: "ContextMenu" });
            }
        }
    }
    //=============================================END MOUSE EVENT======================================================

    const infoHtml = createInfoLandZoomLower23({ props });
    const clsNames = createClassLand({ props });
    const clsName = ' '+ clsNames.join(' ');
    const reactDetail = renderTileDetailHtml({ props, toggleCertification, clsName, infoHtml });

    let icon = L.divIcon({
        iconUrl: null,
        iconRetinaUrl: null,
        iconAnchor: null,
        popupAnchor: null,
        shadowUrl: null,
        shadowSize: null,
        shadowAnchor: null,
        iconSize: new L.Point(64, 64),
        className: 'tile-n ico-'+ quadKey + clsName,
        idName: 'ico-'+ quadKey,
        html: ReactDOMServer.renderToString(reactDetail)
    });

    return (
        <React.Fragment>

            <Marker
                position={[lat, lng]}
                icon={icon}
                onClick={e => tileClick({e, tile})}
                onMouseOver={e => tileMouseOver({e, tile})}
                onMouseOut={e => tileMouseLeave({e, tile})}
                onContextmenu={e => tileRightMouseClick({e, tile})}
            />

        </React.Fragment>
    )
}

export default connect(
    state => {
        const { authentication: { user }, map, alert, users, settings, lands, lands: { myLands } } = state;
        return { user, alert, lands, map, users, settings, myLands };
    },
    dispatch => ({
        getLandInfo: (quadKey) => dispatch(landActions.getLandInfo({quadKey})),
        syncCenterMap: (center, zoom, centerQuadKey, centerChange) => dispatch(mapActions.syncCenterMap(center, zoom, centerQuadKey, centerChange)),
        addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
        removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
    })
)(LandTileComponent);