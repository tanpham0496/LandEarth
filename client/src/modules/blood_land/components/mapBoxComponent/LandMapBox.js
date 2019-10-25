import React, { useState, useRef, useEffect } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import { fromJS, setIn, get, getIn } from 'immutable';
import {
    LatLongToTileXY,
    TileXYToLatLong,
    TileXYToQuadKey,
} from '../general/System';
import MAP_STYLE from './map-style-basic-v8.json';

const mapStyleDefalt = fromJS({
  version: 11,
  sources: {
    "mapbox": {
      "url": "mapbox://styles/mapbox/streets-v11",
      "type": "vector"
    },
    // points: {
    //     type: 'geojson',
    //     data: {
    //         type: 'FeatureCollection',
    //         features: [
    //             {type: 'Feature', geometry: {type: 'Point', coordinates: [-122.45, 37.78]}}
    //         ]
    //     }
    // }
  },
  // layers: [
  //     {
  //         id: 'my-layer',
  //         type: 'circle',
  //         source: 'points',
  //         paint: {
  //             'circle-color': '#f00',
  //             'circle-radius': 4
  //         }
  //     }
  // ]
});

const dataLayer = fromJS({
  id: 'data',
  source: 'incomeByState',
  type: 'fill',
  interactive: true,
  paint: {
    'fill-color': {
      property: 'percentile',
      stops: [
        [0, '#3288bd'],
        [1, '#66c2a5'],
        [2, '#abdda4'],
        [3, '#e6f598'],
        [4, '#ffffbf'],
        [5, '#fee08b'],
        [6, '#fdae61'],
        [7, '#f46d43'],
        [8, '#d53e4f']
      ]
    },
    'fill-opacity': 0.8
  }
});

const data = fromJS({
  "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
    "properties": {
      "name": "Maine",
      "income": {
        "1995": 31189,
        "1996": 33002,
        "1997": 33140,
        "1998": 35560,
        "1999": 36902,
        "2000": 37589,
        "2001": 38036,
        "2002": 37963,
        "2003": 39212,
        "2004": 41287,
        "2005": 42648,
        "2006": 43472,
        "2007": 45832,
        "2008": 46419,
        "2009": 45708,
        "2010": 45882,
        "2011": 46160,
        "2012": 46856,
        "2013": 47095,
        "2014": 49381,
        "2015": 51419
      }
    },
    "geometry": {
      "type": "MultiPolygon",
      "coordinates": [
        [
          [
            [-86.923828125,
              36.65079252503471
            ],
            [-83.56201171875,
              36.65079252503471
            ],
            [-83.56201171875,
              38.151837403006766
            ],
            [-86.923828125,
              38.151837403006766
            ],
            [-86.923828125,
              36.65079252503471
            ]
          ],
          [
            [-82.7490234375,
              36.63316209558658
            ],
            [-79.8486328125,
              36.63316209558658
            ],
            [-79.8486328125,
              38.18638677411551
            ],
            [-82.7490234375,
              38.18638677411551
            ],
            [-82.7490234375,
              36.63316209558658
            ]
          ]
        ]
      ]
    }
  }]
});

function LandMapBox(props){

  let map = useRef();
  const OFFSET_ZOOM = 1;

  //const [center, setViewport] = useState(initViewport);
  const [mapStyle, setMapStyle] = useState(fromJS(MAP_STYLE));
  const [zoom, setZoom] = useState(16);
  const [center, setCenter] = useState({ lat: 38.8410857803, lng: -76.9750541388 });
  //const [center, setCenter] = useState({ lat: 10.750806, lng: 106.710205 });
  const [tiles, setTiles] = useState([]);
  const [pitch, setPitch] = useState(0/*45*/);
  const [bearing, setBearing] = useState(0/*-17*/);
  //const [mapOrigin, setMapOrigin] = useState(null);






  useEffect(() => {
    if(map){

      //setMapStyle();
      // console.log('did')
      // // Start the animation.
      // rotateCamera(0);
      // 
      // 
      // 
      
      // const mapStyle2 = fromJS({
      //     version: 11,
      //     sources: {
      //         "mapbox": {
      //           "url": "mapbox://styles/mapbox/streets-v11",
      //           "type": "vector"
      //         },
      //         // points: {
      //         //     type: 'geojson',
      //         //     data: {
      //         //         type: 'FeatureCollection',
      //         //         features: [
      //         //             {type: 'Feature', geometry: {type: 'Point', coordinates: [-122.45, 37.78]}}
      //         //         ]
      //         //     }
      //         // }
      //     },
      //     layers: [
      //         {
      //             id: 'my-layer',
      //             type: 'circle',
      //             source: 'points',
      //             paint: {
      //                 'circle-color': '#f00',
      //                 'circle-radius': 4
      //             }
      //         }
      //     ]
      // });



      //console.log('data', data);
      // console.log('mapStyle', mapStyle);
      const newMapStyle = fromJS(mapStyle).setIn(['sources', "mapbox"], fromJS({type: 'geojson', data}))
      //                              // /.set('layers', mapStyle.get('layers').push(dataLayer));

      // console.log('newMapStyle', newMapStyle);
      setMapStyle(newMapStyle);

    }
  }, [])



  useEffect(() => {
    //map
    //console.log('map be',map);
    if(map){
      const bounds = map.getMap().getBounds();
      //console.log('getBounds', bounds);
      const dt = drawTiles({zoom, bounds});
      setTiles(dt);
    }
  }, [zoom, center]);



  const rotateCamera = (timestamp) => {
    console.log('rotate')
    if(!map) return null;
    const mapOrigin = map.getMap();
    // clamp the rotation between 0 -360 degrees
    // Divide timestamp by 100 to slow rotation to ~10 degrees / sec
    mapOrigin.rotateTo((timestamp / 100) % 360, {duration: 0});
    // Request the next frame of the animation.
    requestAnimationFrame(rotateCamera);
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


  const createArrayTile = ({beginTile, endTile, level, lands, selectedTiles}) => {
      //console.log('createArrayTile');
      //tạo ra nhiều tiles , được gọi trong function drawTiles
      //const MAX_LEVEL = 24;
      let arrTile = [];
      for (let x = beginTile.x; x <= endTile.x; x++) {
          for (let y = beginTile.y; y <= endTile.y; y++) {
            let tileQuadKey = TileXYToQuadKey(x, y, level);
            let tileLatLng = TileXYToLatLong(x, y, level);
            let tile = {x, y, level, latlng: tileLatLng, quadKey: tileQuadKey};
            arrTile.push(tile);
          }
      }
      return arrTile;
  }


  const _onChange = (viewport) => {
    //console.log('viewport', viewport)
    const {latitude, longitude, zoom, pitch, bearing} = viewport;
    //console.log('zoom', zoom);
    const newZoom = Math.round(zoom); 
    //console.log("newZoom", newZoom);
    setZoom(newZoom);
    setCenter({ lat: latitude, lng: longitude });
    setPitch(pitch);
    setBearing(bearing);
  }


  const _onLoad = (e) => {
    console.log('e');

    if(!map) return null;
    console.log('map  ===> ', map);

    // Insert the layer beneath any symbol layer.
    const mapOrigin = map.getMap();
    //setMapOrigin(mapOrigin);
    var layers = mapOrigin.getStyle().layers;
     
    var labelLayerId;
    for (var i = 0; i < layers.length; i++) {
      if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
        labelLayerId = layers[i].id;
        break;
      }
    }
     
    // mapOrigin.addLayer({
    //   'id': '3d-buildings',
    //   'source': 'composite',
    //   'source-layer': 'building',
    //   'filter': ['==', 'extrude', 'true'],
    //   'type': 'fill-extrusion',
    //   'minzoom': 15,
    //   'paint': {
    //     'fill-extrusion-color': '#aaa',
         
    //     // use an 'interpolate' expression to add a smooth transition effect to the
    //     // buildings as the user zooms in
    //     'fill-extrusion-height': [
    //       "interpolate", ["linear"], ["zoom"],
    //       15, 0,
    //       15.05, ["get", "height"]
    //     ],
    //     'fill-extrusion-base': [
    //       "interpolate", ["linear"], ["zoom"],
    //       15, 0,
    //       15.05, ["get", "min_height"]
    //     ],
    //     'fill-extrusion-opacity': .6
    //   }
    // }, labelLayerId);

  }

  const _onMouseDown = () => {
    console.log('_onMouseDown');
  }

  return (
    <ReactMapGL
      ref={ m => map = m }
      width='100vw'
      height='100vh'
      zoom={zoom}
      latitude={center.lat}
      longitude={center.lng}
      mapStyle={mapStyle}
      //mapStyle={'mapbox://styles/mapbox/streets-v11'}
      // zoom={19}
      // latitude={37.566535}
      // longitude={126.9779692}
      // mapStyle={'mapbox://styles/nguyenquan13/cjyl18qu4106a1do20r6j7wii'}
      onViewportChange={_onChange}
      mapboxApiAccessToken={'pk.eyJ1IjoiYmxhbmQxIiwiYSI6ImNrMWtldHl2ejBjczgzb25wNWlreDVkMjgifQ.7pdpqi8QyPySNEhFbcLzdA'}
      maxZoom={23}
      minZoom={5}
      pitch={pitch}
      bearing={bearing}
      onLoad={_onLoad}
      container={'map'}
      antialias={true}
      onMouseDown={_onMouseDown}
    >
      {
        tiles.map(tile =>{
          return (<Marker className={'tile-n'} latitude={tile.latlng.lat} longitude={tile.latlng.lng} offsetLeft={0} offsetTop={0} captureDrag={false} />)
        })

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

