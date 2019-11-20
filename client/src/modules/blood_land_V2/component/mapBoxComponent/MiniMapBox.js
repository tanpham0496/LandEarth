import React, { useState, useRef, useEffect } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import { fromJS, setIn, get, getIn } from 'immutable';
import {mapActions} from '../../../../store/actions/commonActions/mapActions'
import {
    LatLongToTileXY,
    TileXYToLatLong,
    TileXYToQuadKey,
} from './System';
import { mapBoxKey } from '../../../../helpers/config';
import { useDispatch, useSelector } from 'react-redux';

function MiniMapBox(props){

  // let map = useRef();
  const dispatch = useDispatch();

  const [zoom, setZoom] = useState(props.zoom);
  const [center, setCenter] = useState(props.center);
  const { maps } = useSelector(state => state);
  // const [pinCenter, setPinCenter] = useState(props.center);
  //const [pitch, setPitch] = useState(0/*45*/);
  // const [bearing, setBearing] = useState(0/*-17*/);

  //load zoom
  useEffect(() => {
    setZoom(props.zoom);
    setCenter(props.center);
  }, [props.zoom, props.center]);

  const _onChange = (viewport) => {
    const {latitude, longitude, zoom, pitch, bearing} = viewport;
    // const newZoom = Math.round(zoom); 
    setZoom(zoom);
    setCenter({ lat: latitude, lng: longitude });
    //setPitch(pitch);
    // setBearing(bearing);
    
  }

  // const _onLoad = (e) => {
  //   // console.log('e');
  //   if(!map) return null;
  // }
  
  const _onClick = ({ lngLat: [lng, lat] }) => {
    //console.log('onClick', [lng, lat]);
    const newCenter = { lat, lng };
    //setCenter(newCenter);
    // setPinCenter(newCenter);
    dispatch(mapActions.syncMap({
      center: newCenter,
      //oddZoom: zoom,
      //zoom: newZoom,
    }));
  }

  return (
    <ReactMapGL
      // ref={ m => map = m }
      width={ props.width }
      height={ props.height }
      mapStyle={'mapbox://styles/mapbox/streets-v11'}
      mapboxApiAccessToken={mapBoxKey}
      //onLoad={_onLoad}
      onViewportChange={_onChange}
      zoom={zoom}
      latitude={center.lat}
      longitude={center.lng}
      minZoom={props.minZoom}
      maxZoom={props.maxZoom}
      onClick={_onClick}
      // pitch={pitch}
      // bearing={bearing}
    >
      <Marker
        //style={{ display: props.isLoadPin ? 'block' : 'none' }}
        className={`pinLeaf`}
        latitude={maps.center.lat}
        longitude={maps.center.lng}
        captureDrag={false}
        captureClick={false}
        
      >
      </Marker>
    </ReactMapGL>
  );

}

export default MiniMapBox;