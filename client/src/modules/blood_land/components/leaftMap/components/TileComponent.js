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
        //console.log('props.tile.land', props.tile.land)
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
    // /c
    return arrClassName;
}

function renderTileDetailHtml ({ props, toggleCertification, clsName, infoHtml }) {
    const { tile: { lands, quadKey, totalCount } } = props;
    return (
        <React.Fragment>
            {
                toggleCertification &&
                <div className="toggle-land-button-container">
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

function createInfoLandZoomLower23({ props, toolTipDisplay }){
    const { tile: { totalCount, canBuy, canNotBuy, quadKey }, zoom, settings } = props;
    //console.log('sdgsdgsd', totalCount, canBuy, canNotBuy);
    if (zoom === 22 || !settings || !settings.land || !settings.land.showInfo)  return "";
    return (
        <div className='cell'>
            <div>
                <div className='cell-info' id={'hover-land-info-icon-' + quadKey} onMouseOver={() => this.setState({ toolTipDisplay: true })}
                    onMouseLeave={() => this.setState({ toolTipDisplay: false })}>
                    {/* <img src={cellInfoImg} alt=''/> */}
                    <span className='can-buy'>{canNotBuy} /&nbsp; </span><span
                        className='total-count'>{totalCount}</span>
                    {
                        toolTipDisplay &&
                        <span className="tooltiptext">
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

function TileComponent(props) {
    const { tile: { lands, quadKey, totalCount }, tile, lat, lng, zoom, user, myLands, screens: { popupName, popupOpen }, tileStart } = props;
    const [toggleCertification, setToggleCertification] = useState(false); //hover land show certificate
    const [toolTipDisplay, setToolTipDisplay] = useState(false);

    //===================================================================================================
    //Hover show icon certificate
    const tileMouseOver = ({e, tile}) => {
        if(!tileStart){
            const { land } = tile;
            if(land && land.user && land.forbid === false) setToggleCertification(true);
        } else {
            props.tileMouseEnter(tile);
        }
    }

    //hide icon certificate when leave
    const tileMouseLeave = () => {
        setToggleCertification(false);
    }
    //===================================================================================================


    // let { isOpenCertificateImage } = this.state;
    // let { tile: { lands, quadKey, totalCount }, tile, lat, lng, zoom, user, myLands, syncCenterMap } = this.props;


    //      //zoom === 22
    //     let otherLand = lands && lands.length > 0 && lands.reduce((otherLand, land) => {
    //         if (land.user) {
    //             if (land.user._id === user._id)
    //                 otherLand.myLand += land.landCount;
    //             else {
    //                 if (land.forSaleStatus === true)
    //                     otherLand.forSale += land.landCount;
    //                 else
    //                     otherLand.noSell += land.landCount;
    //             }
    //         } else if (land.forbid) {
    //             otherLand.forbid += land.landCount;
    //         }
    //         return otherLand;
    //     }, { noSell: 0, forSale: 0, forbid: 0, myLand: 0 });

    //     // // làm lại chỗ này no sell === ko có tại zoom khác 22
    //     const { noSell, forSale, forbid, myLand } = otherLand;
    //     const empty = totalCount - (noSell + forSale + forbid + myLand);
    //     const canBuy = forSale + empty ? forSale + empty : '';
    //     const canNotBuy = myLand + noSell ? myLand + noSell : '';
    //     clsName = this.createClassLand(this.props, { canBuy, canNotBuy })

    const infoHtml = createInfoLandZoomLower23({ props, toolTipDisplay });
    //const infoHtml = "";
    const clsNames = createClassLand({props});
    const clsName = ' '+ clsNames.join(' ');
    //console.log('clsName', clsName);
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

    const tileClick = ({e, tile}) => {
        const MIN_OFFSET = 0;
        const MAX_OFFSET = 20;
        if(toggleCertification && e.originalEvent.offsetX > MIN_OFFSET && e.originalEvent.offsetX < MAX_OFFSET && e.originalEvent.offsetY > MIN_OFFSET && e.originalEvent.offsetY < MAX_OFFSET){
            props.addPopup({ popupName: 'LandCertificateComponent', popupData: { quadKey } });
        } else {
            console.log('Tile click select Land!!');
            props.tileClick(tile);
        }
    }

    return (
        <React.Fragment>
            <Marker
                position={[lat, lng]}
                icon={icon}
                onClick={e => tileClick({e, tile})}
                //onClick={() => props.tileClick()}
                // onMouseenter={e => {console.log("enter ne0")}}
                onMouseover={e => tileMouseOver({e, tile})}
                onMouseout={e => tileMouseLeave()}
            // onMouseOver={e => {console.log("mouse over")}}
            >

            </Marker>
        </React.Fragment>
    )
}

export default connect(
    state => {
        const { authentication: { user }, map, alert, users, settings, lands, lands: { myLands }, screens } = state;
        return { user, alert, lands, map, users, settings, myLands, screens };
    },
    dispatch => ({
        getLandInfo: (quadKey) => dispatch(landActions.getLandInfo({quadKey})),
        syncCenterMap: (center, zoom, centerQuadkey) => dispatch(mapActions.syncCenterMap(center, zoom, centerQuadkey)),
        addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
        removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
    })
)(TileComponent);