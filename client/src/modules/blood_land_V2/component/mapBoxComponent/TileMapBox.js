import React, { useState, useRef, useEffect, memo, useMemo } from 'react';
import { Marker } from 'react-map-gl';
// import { fromJS, setIn, get, getIn } from 'immutable';
// import {
//     LatLongToTileXY,
//     TileXYToLatLong,
//     TileXYToQuadKey,
//     LatLongToQuadKey,
//     QuadKeyToTileXY,
// } from './System';
// import MAP_STYLE from './map-style-basic-v8.json';
// import { mapBoxKey } from '../../../../helpers/config';
// import { mapActions } from '../../../../store/actions/commonActions/mapActions';
import { useDispatch, useSelector } from 'react-redux';
// import { getFisrtLocation, splitMultiDeep } from './mapFunction';
import _ from 'lodash';
// import axios from 'axios';
// import {loadingImage} from "../../../blood_land/components/general/System";
// import Geocoder from 'react-map-gl-geocoder';
// import { createSelector } from 'reselect';
import {
  MAX_LEVEL,
  // DEFAULT_LEVEL_MAPBOX_OFFSET,
  // MAX_ZOOM,
  // MAX_ZOOM_SELECTED_TILE,
  // MIN_ZOOM_SELECTED_TILE,
  // PARENT_1_RANGE,
  // PARENT_2_RANGE,
  // dBug,
} from '../../../../helpers/constants';
import {screenActions} from "../../../../store/actions/commonActions/screenActions";
import classNames from "classnames";

function createTileClass({ isSpecial, selected }) {
  //console.log('isSpecial', isSpecial)
  return classNames({
      'tile-n': true,
      // 'center': true,
      'selected': selected,
      'special': isSpecial,

  });
}


function TileMapBox(props){

  // console.log('tile');
  const { quadKey, hintMode, selected, isHoverZoom, lat, lng, isSpecial } = props;

  const dispatch = useDispatch();
  let bdStyle = {
    borderTop: '0.1px solid rgba(0, 0, 0, 0.1)',
    borderLeft: '0.1px solid rgba(0, 0, 0, 0.1)',
    borderBottom: '0.1px solid rgba(0, 0, 0, 0.1)',
    borderRight: '0.1px solid rgba(0, 0, 0, 0.1)',
    borderStyle: 'dashed',
  };
  const generalStyle = `${'1.5px'} ${'solid'} ${'rgba(0, 0, 0, 0.22'}`;

  //const zoomSelect = Number(clickMode.replace('zoom', ''));
  const removeOffset = Math.log(hintMode)/Math.log(4);
  // console.log("removeOffset", removeOffset);
  const deltaRange = removeOffset - (MAX_LEVEL - quadKey.length);
  if(deltaRange > 0){
  //   bdStyle.borderTop = generalStyle;
  //   bdStyle.borderLeft = generalStyle;
  //   bdStyle.borderBottom = generalStyle;
  //   bdStyle.borderRight = generalStyle;
  // } else {
    const particalQKs = quadKey.substring(quadKey.length - deltaRange).split('');
    // console.log('particalQKs', particalQKs);
    const objLine = {
      borderTop: [0, 1],
      borderRight: [1, 3],
      borderBottom: [2, 3],
      borderLeft: [0, 2],
    }
    
    for(let [key, line] of Object.entries(objLine)){
      // console.log(particalQKs)
      const isMatch = particalQKs.every(strNum => line.some(num => num === Number(strNum)));
      if(isMatch){
        bdStyle[key] = generalStyle;
      }
    }
  }


  const cls = createTileClass(props);
  //console.log("cls", cls);

  return (
    <Marker
      id={quadKey}
      latitude={lat}
      longitude={lng}
      //offsetLeft={0}
      //offsetTop={0}
      captureDrag={false}
      captureClick={false}             
    >
      <div
        id={quadKey}
        style={isHoverZoom ? bdStyle : {borderStyle: 'solid'}}
        className={cls}
        
        onClick={(e) => props.tileClick(quadKey, e)}
        onMouseOver={() => props.tileMouseEnter(quadKey)}
        // onDragStart={() => console.log('onDragStart')}
        onContextMenu={(e)=> dispatch(screenActions.addPopup({name : 'ContextMenu', closes: ["ContextMenu"],  data : {clientX : e.clientX, clientY : e.clientY}}))}
      >
        <div className='centick'/>
      </div>
    </Marker>
  );

}

export default memo(TileMapBox);

// function areEqual(prevProps, nextProps) {
//   const { tileClick, tileMouseEnter, ...prev } = prevProps;
//   const { tileClick: tileClick2, tileMouseEnter: tileMouseEnter2 , ...next } = nextProps;
//   return _.isEqual(prev, next);
// }