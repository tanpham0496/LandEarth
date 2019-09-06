import React, { Fragment, PureComponent, useState, useRef, useEffect, useReducer } from 'react'
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
    loadingImage,
    getMapImgByItemId,
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
import moment from 'moment';
import TreePositionRender from './TreePositionRender';
import PlantCultivationPopup from "../../gameUIComponent/Common/PlantCultivationComponent/PlantCultivationPopup";

const LIMIT_ZOOM_SELECTED = 20;
const DEFAULT_LEVEL_OFFSET = 2;
const PARENT_1_RANGE = 4;
const PARENT_2_RANGE = 5;

//create class image of leaft-top cornor
function createClassLand({ props }){
    let arrClassName = [];
    if(props.zoom !== 22) return [];
    const { tile: { land, selected, isCenter }, user , arrayTileEffect } = props;
    if(!land) return [];
    if(land.outsideOpenCountries) return ['forbid'];
    if (land.user) {
        //if (land.landmark){
        //    arrClassName.push('landmark');
        //} else {
            if (land.user._id === user._id) { //is MyLand
                arrClassName.push('myLand');
                if (land.forSaleStatus === true) arrClassName.push('myForSell');
                if(arrayTileEffect){
                    for(let i=0 ; i < arrayTileEffect.length ; i++){
                        if(land.quadKey === arrayTileEffect[i].quadKey){
                            arrayTileEffect.length !== 4 ? arrClassName.push('specialTreeUnAvailable') : arrayTileEffect[i].squareAvailable ?arrClassName.push('specialTreeAvailable')  : arrClassName.push('specialTreeUnAvailable')
                        }
                    }
                }
            } else { //is other user
                arrClassName.push(land.forSaleStatus === true ? 'forSell' : 'noSell')
            }
        //}
    }
    if(selected) arrClassName.push('selected');
    if(isCenter) arrClassName.push('center');
    return arrClassName;
}


function GameTileComponent(props) {

    const { tile: { land, quadKey, totalCount, latlng, tree }, tile, user, objects, screens, tileStart, zoom } = props;
    const [toggleCertification, setToggleCertification] = useState(false); //hover land show certificate
    const [hoverTree, setHoverTree] = useState(false);

    const treeRender = () => {
        //calculator waterEndDayRemaining
        const { itemId, waterEndTime } = tree;
        const waterEndHours = waterEndTime && moment(waterEndTime).diff(moment(), "hours");
        const waterEndDayRemaining = _.isNumber(waterEndHours) ? Math.ceil(waterEndHours/24) : null;

        //console.log('waterEndDayRemaining', waterEndDayRemaining);
        return (
            <Fragment>
                    {/*toggleTree && tile.user.userId === user._id &&
                    <div className={`${itemId === 'T10' ? 'toggle-special-tree-button' : 'toggle-tree-button'}`} onClick={() => this.onHandleCheckPopup(item)}>
                        <img src={getMapImgByItemId(itemId)} alt=''/>
                    </div>*/}
                    {/*onClick={() => onHandleClick(itemId)}*/}
                    <div className={`game-obj ${itemId === 'T10' ? 'pos-special-item-yx11' : 'pos-item-leaftmap'}`} >
                        {_.isNumber(waterEndDayRemaining) && <div className={`char-status ${waterEndDayRemaining <= 15 ? 'water-warning' : ''} `}  />}
                        <img className={`${itemId === 'T10' ? 'char-special-img' : 'char-img'}`}
                             src={getMapImgByItemId(itemId)} alt={itemId} />
                    </div>
            </Fragment>
        )
    }

    const renderTileDetailHtml = ({ user, clsNames, quadKey, tile }) => {
        if(clsNames.length === 0) return null;
        return (
            <React.Fragment>
                {hoverTree && tile.tree && tile.tree.itemId &&
                    <div className={`${tile.tree.itemId === 'T10' ? 'toggle-special-tree-button-leaflet' : 'toggle-tree-button-leaflet'}`} >
                        <img src={getMapImgByItemId(tile.tree.itemId)} alt=''/>
                    </div>}
                { clsNames.includes("center") && <div className='centick' /> }
                { tree && treeRender() }
                <Fragment>
                    {clsNames.includes("forSell") && <div className='fs-cont-gm'>
                        <div className='fs-title'> for sale</div>
                    </div>}
                    {clsNames.includes("myLand") && !clsNames.includes("myForSell") && <div className='ml-cont-gm' >
                        <div className='ml-title'> my land</div>
                    </div>}
                    {clsNames.includes("myLand") && clsNames.includes("myForSell") && <div className='fg-cont-gm'>
                        <div className='fs-cont-gm'>
                            <div className='fs-title'>sale</div>
                        </div>
                        <div className='ml-cont-gm'>
                            <div className='ml-title'>my</div>
                        </div>
                    </div>}
                </Fragment>
            </React.Fragment>
        )
    }

    // const infoHtml = createInfoLandZoomLower23({ props });
    const clsNames = createClassLand({ props });
    const clsName = ' '+ clsNames.join(' ');
    const reactDetail = renderTileDetailHtml({ user, clsNames, quadKey, tile });

    let icon = L.divIcon({
        iconUrl: null,
        iconRetinaUrl: null,
        iconAnchor: null,
        popupAnchor: null,
        shadowUrl: null,
        shadowSize: null,
        shadowAnchor: null,
        iconSize: new L.Point(64, 64),
        className: 'tile-n qId'  + quadKey + clsName,
        html: ReactDOMServer.renderToString(reactDetail)
    });

    //================================================MOUSE EVENTS==============================================================
    const handleClickTree = ({ e, tile }) => {
        const MIN_OFFSET = 0;
        const MAX_OFFSET = 20;
        if(e.originalEvent.offsetX > MIN_OFFSET && e.originalEvent.offsetX < MAX_OFFSET && e.originalEvent.offsetY > MIN_OFFSET && e.originalEvent.offsetY < MAX_OFFSET){
            props.addPopup({ name: 'PlantCultivationComponent', data: { tree: tile.tree } });
            setHoverTree(toggleTree => false);
        } else {
            // console.log('Tile game click select!!!');
            props.tileGameClick(tile);
        }
    }

    //Hover show icon certificate
    const tileMouseOver = ({e, tile}) => {
        if(!tileStart){ //sigle hover
            if(zoom === 22){
                if(tile.land && tile.land.user && tile.land.forbid === false){
                    setHoverTree(true);
                }
            }
        } else { //multi selection hover
            props.tileMouseEnter(tile);
        }
    }

    //hide icon certificate when leave
    const tileMouseLeave = ({ e, tile}) => {
        if(zoom === 22){
            setHoverTree(false);
        }
    }

    const tileRightMouseClick = ({ e, tile }) => {
        const { selected } = props.map;
        if(Array.isArray(selected)){
            const isTileInSelected = selected.some(tileSelected => tileSelected.quadKey === tile.quadKey);
            if(isTileInSelected){
                props.addPopup({ name: "ContextMenuGame" });
            } else{
                props.removePopup({ name: "ContextMenuGame" });
            }
        }
    }
    //================================================END MOUSE EVENTS==============================================================

    return (
        <React.Fragment>
            <Marker
                position={latlng}
                icon={icon}
                onClick={e => handleClickTree({ e, tile }) }
                onMouseOver={e => tileMouseOver({e, tile})}
                onMouseOut={e => tileMouseLeave({e, tile})}
                onContextmenu={e => tileRightMouseClick({e, tile})}
            />
        </React.Fragment>
    )
}

export default connect(
    state => {
        const { authentication: { user }, objects, screens, map } = state;
        return { user, objects, screens, map  };
    },
    dispatch => ({
        syncCenterMap: (center, zoom, centerQuadkey) => dispatch(mapActions.syncCenterMap(center, zoom, centerQuadkey)),
        addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
        removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
    })
)(GameTileComponent);