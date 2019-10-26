import React, { useState, useRef, useEffect } from 'react';
import ReactMapGL, { Marker, Layer, Source, FlyToInterpolator } from 'react-map-gl';
import { fromJS, setIn, get, getIn } from 'immutable';
import {
    LatLongToTileXY,
    TileXYToLatLong,
    TileXYToQuadKey,
} from './System';
import MAP_STYLE from './map-style-basic-v8.json';
import { mapBoxKey } from '../../../../helpers/config';
import { mapActions } from '../../../../store/actions/commonActions/mapActions';
import { useDispatch, useSelector } from 'react-redux';
import { getFisrtLocation } from './mapFunction';
import moduleName from 'lodash';
import axios from 'axios';

function LandMapBox(props){

  let map = useRef();
  const dispatch = useDispatch();
  const { auth, maps } = useSelector((state) => state);
  const OFFSET_ZOOM = 1;

  //console.log('props',props)
  const defaultViewport = {
    zoom: props.zoom,
    latitude: props.center.lat,
    longitude: props.center.lng,
    pitch: 0,
    bearing: 0,
  }
  const [mapLoaded, setMapLoaded] = useState(false);
  const [viewport, setViewport] = useState(defaultViewport);
  //const [center, setViewport] = useState(initViewport);
  //const [mapStyle, setMapStyle] = useState(fromJS(MAP_STYLE));
  //const [zoom, setZoom] = useState(props.zoom);
  //const [center, setCenter] = useState(props.center);
  //const [viewport, setViewport] = useState({});
  //const [center, setCenter] = useState({ lat: 10.750806, lng: 106.710205 });
  const [tiles, setTiles] = useState([]);
  //const [pitch, setPitch] = useState(0/*45*/);
  //const [bearing, setBearing] = useState(0/*-17*/);

  // load fist location login or from last location
  useEffect(() => {

    getFisrtLocation().then(location => {
      // console.log('location', location);
      //const tmp = { latitude: 45.137451890638886, longitude: -67.13734351262877 };
      setViewport({
        ...viewport,
        //...tmp,
        latitude: location.lat,
        longitude: location.lng
      });
    });
  }, []);

  //sync center map from minimap
  useEffect(() => {
    if(maps.center){
      setViewport({
        ...viewport,
        latitude: maps.center.lat,
        longitude: maps.center.lng
      });
    }
  }, [maps.center]);

  const createArrayTile = ({beginTile, endTile, level, lands, selectedTiles}) => {
      //console.log('createArrayTile');
      //tạo ra nhiều tiles , được gọi trong function drawTiles
      //const MAX_LEVEL = 24;
      let arrTile = [];
      //console.log('x', endTile.x - beginTile.x);
      //console.log('y', endTile.y - beginTile.y);

      for (let x = beginTile.x; x <= endTile.x; x++) {
          for (let y = beginTile.y; y <= endTile.y; y++) {
            let tileQuadKey = TileXYToQuadKey(x, y, level);
            let tileLatLng = TileXYToLatLong(x, y, level);
            let tile = {x, y, level, latlng: tileLatLng, quadKey: tileQuadKey};
            arrTile.push(tile);
          }
      }

      console.log('arrTile', arrTile);

      return arrTile;
  }

  const setNewViewport = (newViewport) => {
    setViewport({ ...viewport, ...newViewport });
  }

  //change mode map
  useEffect(() => {
    //console.log('maps.landMode change', maps.landMode);
    if(maps.landMode){
      //console.log('mapLoaded',mapLoaded)
      if(mapLoaded){
        setNewViewport({
          pitch: 0,
          zoom:  Math.round(viewport.zoom),
          //transitionDuration: 0,
        })
      }
    } else {
      //console.log('lan')
      setTiles([]);
      //console.log('pitch', 45);
      //if(viewport.pitch === 0){
        setNewViewport({
          pitch: 45,
          zoom: 18,
          //transitionInterpolator: new FlyToInterpolator({speed: 2, easing: function (t) { return t; }}),
          //transitionDuration: 2000,
          // onTransitionEnd: () => {
          //   console.log('viewport.pitch')
          //   //draw(viewport, 'viewport.pitch');
          // },
        });
      //}

    }
  }, [maps.landMode]);

  const _onViewportChange = (curViewport) => {
    const { latitude, longitude, zoom, pitch, bearing } = curViewport;
    console.log("maps.landMode, pitch, zoom, mapLoaded", maps.landMode, pitch, zoom, mapLoaded);
    //console.log('_onViewportChange maps.landMode', maps.landMode);
    // console.log('firstLoad', firstLoad);
    const newZoom = Math.round(zoom);

    if(maps.landMode){
      setNewViewport({ latitude, longitude, pitch: 0, zoom: newZoom/*, transitionInterpolator: 0*/ });
      // /console.log('mapLoaded && pitch === 0')
      if(mapLoaded){
        // /console.log('load map', map)
        draw({ zoom: newZoom }, '_onViewportChange');
      }
    } else {
      setNewViewport({ latitude, longitude, pitch, zoom, bearing });
    }

    //sync center to minimap
    dispatch(mapActions.syncMap({
      center: { lat: latitude, lng: longitude },
      oddZoom: zoom,
      zoom: newZoom,
    }));

    //set last location out
    localStorage.setItem('lat', viewport.latitude);
    localStorage.setItem('lng', viewport.longitude );
  }


  const _onLoad = (e) => {
    console.log('_onLoad');

    if(!map) return null;

    console.log('map  ===> ', map);
    const zoom = map.current.getMap().getZoom();
    console.log('zoom =>', zoom);
    draw({ zoom: Math.round(zoom) }, '_Load');

    setMapLoaded(true);
  }

  const draw = ({ zoom }, place) => {
    console.log('draw', place);
    if(!map) return;
    const bounds = map.current.getMap().getBounds();
    const newTiles = drawTiles({zoom, bounds});
    setTiles(newTiles);
  }

  const drawTiles = ({zoom, bounds, selectedTiles=[], lands=[], dBugPlace}) => {
      const DEFAULT_LEVEL_OFFSET = 2;
      //if(dBug) {console.log('drawTiles ==>', dBugPlace, zoom);}
      //tạo biến level
      const level = zoom + DEFAULT_LEVEL_OFFSET + OFFSET_ZOOM;

      const nw = bounds.getNorthWest();
      const se = bounds.getSouthEast();
      //tạo tile với tọa độ x,y từ latlng góc trái trên
      let beginTile = bounds && LatLongToTileXY(nw.lat, nw.lng, level);
      //tạo tile với tọa độ x,y từ latlng góc phải dưới
      let endTile = bounds && LatLongToTileXY(se.lat, se.lng, level);

      const arr = [{beginTile, endTile}].reduce((total, {beginTile, endTile}) => total.concat(createArrayTile({ beginTile, endTile, level, lands, selectedTiles })), []);
      //console.log('arr', arr.length)
      return arr;
  }
  const data = {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-67.13734351262877, 45.137451890638886],
          [-66.96466, 44.8097],
          [-68.03252, 44.3252],
          [-69.06, 43.98],
          [-70.11617, 43.68405],
          [-70.64573401557249, 43.090083319667144],
          [-70.75102474636725, 43.08003225358635],
          [-70.79761105007827, 43.21973948828747],
          [-70.98176001655037, 43.36789581966826],
          [-70.94416541205806, 43.46633942318431],
          [-71.08482, 45.3052400000002],
          [-70.6600225491012, 45.46022288673396],
          [-70.30495378282376, 45.914794623389355],
          [-70.00014034695016, 46.69317088478567],
          [-69.23708614772835, 47.44777598732787],
          [-68.90478084987546, 47.184794623394396],
          [-68.23430497910454, 47.35462921812177],
          [-67.79035274928509, 47.066248887716995],
          [-67.79141211614706, 45.702585354182816],
          [-67.13734351262877, 45.137451890638886]
        ]
      ]
    }
  }

  // const _onMouseDown = () => {
  //   console.log('_onMouseDown');
  // }

  // const _onResize = () => {
  //   console.log('_onResize');
  // }

  //console.log('map', map);
  return (
    <ReactMapGL
      ref={map}
      width='100vw'
      height='100vh'
      mapStyle={'mapbox://styles/mapbox/streets-v11'}
      onViewportChange={_onViewportChange}
      mapboxApiAccessToken={mapBoxKey}
      maxZoom={23}
      minZoom={5}
      onLoad={_onLoad}
      container={'map'}
      {...viewport}
      //antialias={true}
      //onMouseDown={_onMouseDown}
      //onResize={_onResize}
    >
      {
        // tiles.map(tile =>{
        //   return (<Marker className={'tile-n'} latitude={tile.latlng.lat} longitude={tile.latlng.lng} offsetLeft={0} offsetTop={0} captureDrag={false} />)
        // })
      }
      <Source id="maine" type="geojson" data={data} />
      {
        !maps.landMode && <Layer
          id="3d-buildings"
          type="fill-extrusion"
          source="composite"
          source-layer="building"
          filter={['==', 'extrude', 'true']}
          minzoom={15}
          paint={{
            'fill-extrusion-color': '#aaa',
            // use an 'interpolate' expression to add a smooth transition effect to the
            // buildings as the user zooms in
            'fill-extrusion-height': [
              "interpolate", ["linear"], ["zoom"],
              15, 0,
              15.05, ["get", "height"]
            ],
            'fill-extrusion-base': [
              "interpolate", ["linear"], ["zoom"],
              15, 0,
              15.05, ["get", "min_height"]
            ],
            'fill-extrusion-opacity': .6
          }}
        />
      }
    </ReactMapGL>
  );

}

export default LandMapBox;

    // startAndEndBounds = ({level, beginTile, endTile}) => {
    //     if (beginTile.x > endTile.x) {
    //         let tmpEndTile = 127;
    //         if (level > 7) {
    //             tmpEndTile = 2 ** level - 1;
    //         }
    //         return [{ //split end chunk
    //             beginTile: {x: beginTile.x, y: beginTile.y},
    //             endTile: {x: tmpEndTile, y: endTile.y}
    //         }, { //split start chunk
    //             beginTile: {x: 0, y: beginTile.y},
    //             endTile: {x: endTile.x, y: endTile.y}
    //         }]
    //     } else {
    //         return [{beginTile, endTile}];
    //     }
    // };

