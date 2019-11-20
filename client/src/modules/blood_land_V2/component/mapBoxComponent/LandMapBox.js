import React, { useState, useRef, useEffect } from 'react';
import ReactMapGL, { Marker, Layer, Source, FlyToInterpolator, NavigationControl } from 'react-map-gl';
// import { fromJS, setIn, get, getIn } from 'immutable';
import {
    LatLongToTileXY,
    TileXYToLatLong,
    TileXYToQuadKey,
    LatLongToQuadKey,
    QuadKeyToTileXY,
} from './System';
// import MAP_STYLE from './map-style-basic-v8.json';
import { mapBoxKey } from '../../../../helpers/config';
import { mapActions } from '../../../../store/actions/commonActions/mapActions';
import { useDispatch, useSelector } from 'react-redux';
import { getFisrtLocation, splitMultiDeep } from './mapFunction';
import _ from 'lodash';
// import axios from 'axios';
// import {loadingImage} from "../../../blood_land/components/general/System";
import Geocoder from 'react-map-gl-geocoder';
import TileMapBox from './TileMapBox';
import {
  MAX_LEVEL,
  // MAX_ZOOM,
  MIN_ZOOM_MAPBOX,
  MAX_ZOOM_MAPBOX,
  DEFAULT_LEVEL_MAPBOX_OFFSET,
  // MAX_ZOOM_SELECTED_TILE,
  MIN_ZOOM_SELECTED_TILE,
  // PARENT_1_RANGE,
  // PARENT_2_RANGE,
  // dBug,
} from '../../../../helpers/constants';
// import classNames from "classnames";

function LandMapBox(props){
  // console.log("LandMapBox");

  let map = useRef();
  const dispatch = useDispatch();
  const { auth, maps, lands } = useSelector((state) => state);
  // const  = useSelector((state) => state.maps && state.clickMode);
  const {hintMode} = useSelector((state) => state.maps);

  const defaultViewport = {
    zoom: props.zoom,
    latitude: props.center.lat,
    longitude: props.center.lng,
    pitch: 0,
    bearing: 0,
  }
  const [mapLoaded, setMapLoaded] = useState(false);
  const [viewport, setViewport] = useState(defaultViewport);
  const [tiles, setTiles] = useState([]);;
  const [tileStart, setTileStart] = useState(null);
  const [mapDragging, setMapDragging] = useState(false);
  // const [currentHoverQuadKeyParent, setCurrentHoverQuadKeyParent] = useState(null);
  //const { hintMode } = useSelector(state => state.maps);




  // load fist location login or from last location
  useEffect(() => {
    getFisrtLocation().then(location => {
      // console.log('location', location);
      const tmp = { latitude: 40.7648, longitude: -73.9808 };
      setViewport({
        ...viewport,
        latitude: location.lat,
        longitude: location.lng,
        ...tmp,
      });
    });
  }, []);

  //sync center map from minimap
  useEffect(() => {
    // /console.log("maps.center", maps.center);
    if(maps.center){
      setNewViewport({
        ...viewport,
        latitude: maps.center.lat,
        longitude: maps.center.lng
      });

      console.log("getBounds", map.current.getMap().getBounds().getNorthWest() )

      mapLoaded && !maps.pauseDrawTile && drawTiles({ zoom: maps.zoom }, 'maps.center');



    }
  }, [maps.center]);

  //sync center map from minimap
  useEffect(() => {
    // /console.log("maps.center", maps.center);
    if(maps.zoom){
      setNewViewport({
        ...viewport,
        zoom: maps.zoom,
      });
      mapLoaded && !maps.pauseDrawTile && drawTiles({zoom: maps.zoom}, 'maps.zoom change');
    }
  }, [maps.zoom]);

  const createArrayTile = ({beginTile, endTile, level, selected, allSpecialQuadKeys}) => {
    //console.log("selectedTiles ==> ", selectedTiles);
    //tạo ra nhiều tiles, được gọi trong function drawTiles
    let arrTile = [];
    for (let x = beginTile.x; x <= endTile.x; x++) {
      for (let y = beginTile.y; y <= endTile.y; y++) {
        const tileQuadKey = TileXYToQuadKey(x, y, level);
        const tileLatLng = TileXYToLatLong(x, y, level);
        let tile = {x, y, level, ...tileLatLng, quadKey: tileQuadKey, selected: false};
        tile.selected = selected.some(slQK => slQK === tileQuadKey);

        // console.log("tileQuadKey", tileQuadKey);
        tile.isSpecial = /*['0202322303330003']*/allSpecialQuadKeys.some(spQuadKey => tileQuadKey.indexOf(spQuadKey) === 0);
        
        // // console.log("allSpecialQuadKeys", allSpecialQuadKeys);
        // if(tile.isSpecial){
        //   console.log('tile.isSpecial', tile.isSpecial)
        // }

        arrTile.push(tile);
      }
    }

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
          bearing: 0,
          zoom:  Math.round(viewport.zoom),
          //transitionDuration: 0,
        });
        mapLoaded && !maps.pauseDrawTile && drawTiles({ zoom: Math.round(viewport.zoom) }, 'maps.landMode change');
      }
    } else {
      
      // remove tiles
      setTiles([]);

        setNewViewport({
          pitch: 0,
          //zoom: 18,
          //transitionInterpolator: new FlyToInterpolator({speed: 2, easing: function (t) { return t; }}),
          //transitionDuration: 2000,
          // onTransitionEnd: () => {
          //   console.log('viewport.pitch')
          //   //drawTiles(viewport, 'viewport.pitch');
          // },
        });
    }
  }, [maps.landMode]);


  useEffect(() => {
    //console.log('maps.selected', maps.selected);
    const newTiles = tiles.map(t => {
      if(maps.selected.includes(t.quadKey)){
        t.selected = true;
      } else {
        t.selected = false;
      }
      return t;
    });
    setTiles(newTiles);
  }, [maps.selected]);

  useEffect(() => {
    if(!maps.pauseDrawTile){
      dispatch(mapActions.setPauseDrawTile(false));
    }
  }, [maps.pauseDrawTile]);


  const _onViewportChange = (curViewport) => {

    // console.log("curViewport", curViewport);
    const { latitude, longitude, zoom, pitch, bearing } = curViewport;
    const newZoom = Math.round(zoom);
    if(maps.landMode){
      // console.log('land=', maps.landMode);
      setNewViewport({ latitude, longitude, pitch: 0, bearing: 0, zoom: newZoom/*, transitionInterpolator: 0*/ });
    } else {
      // console.log('maps.landMode=', maps.landMode);
      setNewViewport({ latitude, longitude, pitch, bearing, zoom });
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

    const mapbox = map.current.getMap();
    console.log('mapbox ===>', mapbox);

    drawTiles({}, '_onLoad');
    setMapLoaded(true);

    //=======================================================================cluster=======================================================================
    // // Add a new source from our GeoJSON data and set the
    // // 'cluster' option to true. GL-JS will add the point_count property to your source data.
    // // mapbox.addSource("earthquakes", {
    // //   type: "geojson",
    // //   // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
    // //   // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
    // //   data: "https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson",
    // //   cluster: true,
    // //   clusterMaxZoom: 14, // Max zoom to cluster points on
    // //   clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
    // // });
     
    // mapbox.addLayer({
    //   id: "clusters",
    //   type: "circle",
    //   source: "earthquakes",
    //   filter: ["has", "point_count"],
    //   paint: {
    //     // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
    //     // with three steps to implement three types of circles:
    //     //   * Blue, 20px circles when point count is less than 100
    //     //   * Yellow, 30px circles when point count is between 100 and 750
    //     //   * Pink, 40px circles when point count is greater than or equal to 750
    //     "circle-color": [
    //       "step",
    //       ["get", "point_count"],
    //       "#51bbd6",
    //       100,
    //       "#f1f075",
    //       750,
    //       "#f28cb1"
    //     ],
    //     "circle-radius": [
    //     "step",
    //     ["get", "point_count"],
    //     20,
    //     100,
    //     30,
    //     750,
    //     40
    //     ]
    //   }
    // });
 
    // mapbox.addLayer({
    //   id: "cluster-count",
    //   type: "symbol",
    //   source: "earthquakes",
    //   filter: ["has", "point_count"],
    //   layout: {
    //     "text-field": "{point_count_abbreviated}",
    //     "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
    //     "text-size": 12
    //   }
    // });
     
    // mapbox.addLayer({
    //   id: "unclustered-point",
    //   type: "circle",
    //   source: "earthquakes",
    //   filter: ["!", ["has", "point_count"]],
    //   paint: {
    //     "circle-color": "#11b4da",
    //     "circle-radius": 4,
    //     "circle-stroke-width": 1,
    //     "circle-stroke-color": "#fff"
    //   }
    // });
 
    // // inspect a cluster on click
    // mapbox.on('click', 'clusters', function (e) {
    //   var features = mapbox.queryRenderedFeatures(e.point, { layers: ['clusters'] });
    //   var clusterId = features[0].properties.cluster_id;
    //   mapbox.getSource('earthquakes').getClusterExpansionZoom(clusterId, function (err, zoom) {
    //     if (err)
    //     return;
         
    //     mapbox.easeTo({
    //       center: features[0].geometry.coordinates,
    //       zoom: zoom
    //     });
    //   });
    // });
     
    // mapbox.on('mouseenter', 'clusters', function () {
    //   mapbox.getCanvas().style.cursor = 'pointer';
    // });
    // mapbox.on('mouseleave', 'clusters', function () {
    //   mapbox.getCanvas().style.cursor = '';
    // });
    //=========================================================================

    //=========================================================================
    // map.current.getMap().addLayer({
    //   'id': 'maine',
    //   'type': 'fill',
    //   'source': {
    //     'type': 'geojson',
    //     'data': {
    //     'type': 'Feature',
    //     'geometry': {
    //     'type': 'Polygon',
    //     'coordinates': [[[-67.13734351262877, 45.137451890638886],
    //     [-66.96466, 44.8097],
    //     [-68.03252, 44.3252],
    //     [-69.06, 43.98],
    //     [-70.11617, 43.68405],
    //     [-70.64573401557249, 43.090083319667144],
    //     [-70.75102474636725, 43.08003225358635],
    //     [-70.79761105007827, 43.21973948828747],
    //     [-70.98176001655037, 43.36789581966826],
    //     [-70.94416541205806, 43.46633942318431],
    //     [-71.08482, 45.3052400000002],
    //     [-70.6600225491012, 45.46022288673396],
    //     [-70.30495378282376, 45.914794623389355],
    //     [-70.00014034695016, 46.69317088478567],
    //     [-69.23708614772835, 47.44777598732787],
    //     [-68.90478084987546, 47.184794623394396],
    //     [-68.23430497910454, 47.35462921812177],
    //     [-67.79035274928509, 47.066248887716995],
    //     [-67.79141211614706, 45.702585354182816],
    //     [-67.13734351262877, 45.137451890638886]]]
    //     }
    //     }
    //   },
    //   'layout': {},
    //   'paint': {
    //   'fill-color': '#088',
    //   'fill-opacity': 0.8
    //   }
    // });
    
  }

  const startAndEndBounds = ({level, beginTile, endTile}) => {
    // console.log("level", level);
    // console.log("beginTile", beginTile);
    // console.log("endTile", endTile);
    let tmpEndTile = 2 ** level - 1;
    if(beginTile.x === 0 || endTile.x === tmpEndTile){
        return [{ //split end chunk
            beginTile: {x: tmpEndTile-12, y: beginTile.y},
            endTile: {x: tmpEndTile, y: endTile.y}
        }, { //split start chunk
            beginTile: {x: 0, y: beginTile.y},
            endTile: {x: 11, y: endTile.y}
        }]
    } else {
        return [{beginTile, endTile}];
    }
  }

  const drawTiles = ({zoom, bounds, selected}, dBugPlace) => {
    console.log('active drawTiles ==>', dBugPlace);
    //!mapLoaded
    if(!map || !maps.landMode) return;
    console.log('drawing');

    zoom = Math.round( zoom || map.current.getMap().getZoom() );
    bounds = bounds || map.current.getMap().getBounds();

    console.log("bounds", map.current.getMap().getBounds().getNorthWest() );

    selected = selected || [...maps.selected];
    const allSpecialQuadKeys = lands.allSpecialQuadKeys || [];
    // console.log("allSpecialQuadKeys", allSpecialQuadKeys);
    //tạo biến level
    const level = zoom + DEFAULT_LEVEL_MAPBOX_OFFSET;

    const nw = bounds.getNorthWest();
    const se = bounds.getSouthEast();
    //tạo tile với tọa độ x,y từ latlng góc trái trên
    let beginTile = bounds && LatLongToTileXY(nw.lat, nw.lng, level);
    //tạo tile với tọa độ x,y từ latlng góc phải dưới
    let endTile = bounds && LatLongToTileXY(se.lat, se.lng, level);
    // console.log('change', (endTile.x - beginTile.x)*(endTile.y - beginTile.y));
    
    //ARRAY trường hợp đi hết 1 vòng trái đất, tách ra 2 loại lưới
    const arrStartEnd = startAndEndBounds({level, beginTile, endTile}); 
    // console.log("arrStartEnd", arrStartEnd);
    
    const newTiles = arrStartEnd.reduce((total, {beginTile, endTile}) => total.concat(createArrayTile({ beginTile, endTile, level, selected, allSpecialQuadKeys })), []);

    // // let arrQK = arr.map(tile => tile.quadKey.substring(0, tile.quadKey.length - 4));
    // // console.log("uniq", _.uniq(arrQK) );
    // // console.log( 'map.current.getMap()');

    // // const center = map.current.getMap().getCenter();
    // // console.log('center', LatLongToQuadKey({ ...center, level: level }));
    // console.log("=========================", [nw, se], level);
    // const beginQuadKey = LatLongToQuadKey({ ...nw, level });
    // console.log("beginQuadKey", beginQuadKey);
    // const endQuadKey = LatLongToQuadKey({ ...se, level });
    // const uniq = _.uniq([beginQuadKey.substring(0, level - 4), endQuadKey.substring(0, level - 4)]);
    
    // console.time('arrQK');
    // const allQK = uniq.reduce((total, parentQuadKey) => [...total, ...splitMultiDeep({ quadKeys: [parentQuadKey], maxDeep: beginQuadKey.length })], []);
    // const arrT = allQK.map(quadKey => {
    //   const { x, y } = QuadKeyToTileXY(quadKey);
    //   return {
    //     x,
    //     y,
    //     level,
    //     quadKey,
    //     latlng: TileXYToLatLong(x, y, level)
    //   }
    // })
    // console.log("arrT", arrT);
    // console.timeEnd('arrQK');
    
    
    setTiles(newTiles);
  }

  const handleGeocoderViewportChange = (viewport) => {
    console.log("viewport", viewport);
    const geocoderDefaultOverrides = { transitionDuration: 500 };

    return _onViewportChange({
      ...viewport,
      ...geocoderDefaultOverrides
    })
  };

  const _onMouseUp = (e, a, b) => {
    if(!e.rightButton){
      if(e.distance !== 0){
        console.log("_onMouseUp");
        // drawTiles({ zoom: viewport.zoom }, '_onMouseUp');
        setMapDragging(true);
      } else {

      }
    } else {

    }
  }

  const _onWheel = (e) => {
    // console.log('e', e);
    //last zoom not draw tile when scroll
    //if(viewport.zoom === 22 && e.delta > 0) return;
    if(viewport.zoom < 21){
      setTiles([]);
    }
    //drawTiles({ zoom: viewport.zoom }, '_onWheel');
    
  }

  // sự kiện tile click
  const tileClick = (tileQuadKey, e) => {
    // console.log("viewport.zoom", viewport.zoom);

    // chỉ cho phép click chọn tile nếu tile có giá lớn hơn 0 đồng
    // const {lands, user, screens} = this.props;
    // không cho click nếu không phải tầng 18-22
    // if (this.state.zoom < MIN_ZOOM_SELECTED_TILE) return;

    // //không cho click nếu ko có 1 miếng đất có giá lớn hơn 0
    // if (!lands || lands.landPriceLoading) return;
    // //không cho click land forbid
    // if (tile && tile.lands && tile.lands.length > 0 && tile.lands.some(land => tile.quadKey.indexOf(land.quadKey) === 0 && land.forbid)) return;    //limit don't click to Forbid Tile
    // //không cho admin click land nếu đất đó thuộc người khác
    // if (user && user.role && user.role === 'manager' && tile && tile.lands && tile.lands.length > 0 && tile.lands.some(land => land.user !== null)) return;   //limit admin don't click to Partical or Other land

    //prevent click after drag 
    if(mapDragging){
      setMapDragging(false);
      return;
    };
    // console.log('clickMode', clickMode);

    if(maps.clickMode === "single") {
      //console.log("single");
      const selectedIndex = tiles.findIndex(t => t.quadKey === tileQuadKey);
      //console.log("selectedIndex", selectedIndex);
      //nếu ô này chưa được chọn
      if (tiles[selectedIndex].selected === false) {
        //console.log('mapDragging', mapDragging);

        // show popup buy land
        const newTiles = tiles.map(t => {
          if(tileQuadKey === t.quadKey){
            t.selected = true;
          }
          return t;
        })

        setTiles(newTiles);
        dispatch(mapActions.addSelected([tileQuadKey]));
      } else { //nếu ô này đã được chọn
        const newTiles = [...tiles];
        newTiles[selectedIndex].selected = false;

        setTiles(newTiles);
        dispatch(mapActions.removeSelected([tileQuadKey]));
      }
    } else if (maps.clickMode === "multiple") {
      console.log("multi");
      if (!tileStart) {
        const tile = tiles.find(t => t.quadKey === tileQuadKey);
        console.log('tile', tile);
        //tile.selected = true;
        setTileStart(tile);
      } else {
        // console.log('==================> setTileEnd', tile);
        let newSelected = [...maps.selected];
        
        for(const aTile of tiles){
          const isSelected = newSelected.includes(aTile.quadKey);
          if(aTile.selected){
            if(!isSelected){
              newSelected = [...newSelected, aTile.quadKey];
            }
          } else {
            if(isSelected){
              const index = newSelected.findIndex(qk => qk === aTile.quadKey);
              if(index !== -1){
                newSelected.splice(index, 1);
              }
            }
          }
        }
        
        setTileStart(null);
        dispatch(mapActions.setSelected(newSelected));
      }
    }
  }

  const hoverMultiSelect = (tileEndQuadKey) => {
    //nếu đang hover mà trạng thái chọn 1 vùng
    const mapSelected = maps.selected;
    //console.log("tile Start", tileStart, tileEnd);
    const tileEnd = tiles.find(t => t.quadKey === tileEndQuadKey);
    const newTiles = _.cloneDeep(tiles).map(t => {
      if ((t.x <= tileStart.x && t.x >= tileEnd.x && t.y <= tileStart.y && t.y >= tileEnd.y)
        || (t.x <= tileStart.x && t.x >= tileEnd.x && t.y <= tileEnd.y && t.y >= tileStart.y)
        || (t.x <= tileEnd.x && t.x >= tileStart.x && t.y <= tileStart.y && t.y >= tileEnd.y)
        || (t.x <= tileEnd.x && t.x >= tileStart.x && t.y <= tileEnd.y && t.y >= tileStart.y)
      ){
        if (t.selected){
          if(mapSelected.some(qk => qk === t.quadKey)){
              t.selected = false;
          }
        } else {
          if(!mapSelected.some(qk => qk === t.quadKey)){
              t.selected = true
          }
        }
      } else {
        if (t.selected){
          if(!mapSelected.some(qk => qk === t.quadKey)){
              t.selected = false;
          }
        } else {
          const iTile = mapSelected.findIndex(qk => qk === t.quadKey);
          if(iTile !== -1){
              t.selected = true
          }
        }
      }
      return t;
    });

    setTiles(newTiles);
  }

  const hoverZoomSelect = (tileEndQuadKey, hintMode) => {
    // console.log("tileEnd", tileEnd.quadKey);
    const removeOffset = Math.log(hintMode)/Math.log(4);
    const parentQK = tileEndQuadKey.substring(0, MAX_LEVEL - removeOffset);

    const newTiles = [...tiles].map(t => {
      if(t.quadKey.indexOf(parentQK) === 0){
        // t.selected = true;
        t.isHoverZoom = true;
      } else {
        // t.selected = false;
        t.isHoverZoom = false;
      }
      return t;
    })
    setTiles(newTiles);

  }

  const tileMouseEnter = (tileEndQuadKey) => {
    //hiệu ứng hover
    if(viewport.zoom < MIN_ZOOM_SELECTED_TILE) return; //don't click when lower zoom 19
    
    // console.log("clickMode", maps.clickMode);
    if(hintMode !== 1){
      const removeOffset = Math.log(hintMode)/Math.log(4);
      const deltaRange = removeOffset - (MAX_LEVEL - tileEndQuadKey.length);
      if(deltaRange > 0){

        // const newCurrentHoverQuadKeyParent = tileEndQuadKey.substring(0, MAX_LEVEL-deltaRange);
        // if(currentHoverQuadKeyParent !== newCurrentHoverQuadKeyParent){
        //   setCurrentHoverQuadKeyParent(newCurrentHoverQuadKeyParent);
          hoverZoomSelect(tileEndQuadKey, hintMode);
        // }
      }
    }
    
    //check click mode
    if(maps.clickMode === "multiple" && tileStart){
      console.log("multiple");
      hoverMultiSelect(tileEndQuadKey);
    }

  }


  // const _onInteractionStateChange = ({ isDragging }) => {
  //   // isDragging: false
  //   // isPanning: false
  //   // isRotating: false
  //   // startBearing: null
  //   // startPanLngLat: null
  //   // startPitch: null
  //   // startZoom: undefined
  //   // startZoomLngLat: undefined
  // }
  // const _onResult = (result) => {
  //   console.log('_onResult', result);
  //   result.query = 'ne';
  // }

  return (
    <ReactMapGL
      ref={map}
      width='100vw'
      height='100vh'
      mapStyle={'mapbox://styles/mapbox/streets-v11'}
      onViewportChange={_onViewportChange}
      mapboxApiAccessToken={mapBoxKey}
      minZoom={MIN_ZOOM_MAPBOX}
      maxZoom={MAX_ZOOM_MAPBOX}
      onLoad={_onLoad}
      container={'map'}
      doubleClickZoom={false}
      onMouseUp={_onMouseUp}
      {...viewport}
      onWheel={_onWheel}
      renderWorldCopies={false}
      // onNativeClick={() => console.log('_onNativeClick')}
      // /onClick={_onClick}
      // onTouchEnd={() => { console.log('onTouchEnd') }}
      // onTouchZoomRotate={() => console.log('_onTouchZoomRotate')}
      // touchRotate={() => {  console.log('touchRotate')  }}
      // onViewStateChange={({viewState, interactionState, oldViewState}) => console.log('viewState, interactionState, oldViewState', viewState, interactionState, oldViewState)}
      //onInteractionStateChange={_onInteractionStateChange}
      // onTransitionEnd={() => console.log('map end')}
      // onMouseMove={(e) => console.log('onMouseMove', e)}
      // antialias={true}
      // onMouseDown={(e) => console.log('_onMouseDown', e)}
      // onResize={() => console.log('_onResize')}
    >
      {
        tiles.map(tile => {
          return (tile && <TileMapBox hintMode={hintMode} clickMode={maps.clickMode} {...tile} tileMouseEnter={tileMouseEnter} tileClick={tileClick} />)
        })
      }
      {<Geocoder
          mapRef={map}
          onViewportChange={handleGeocoderViewportChange}
          mapboxApiAccessToken={mapBoxKey}
          // onResults={_onResult}
          // onLoading={_onResult}
          // reverseGeocode={true}
          placeholder={'Search Location'}
          zoom ={MAX_ZOOM_MAPBOX}
        />}

      {/*{*/}
      {/*  <div style={{position: 'absolute', right: 0}}>*/}
      {/*    <NavigationControl  showCompass={false}/>*/}
      {/*  </div>*/}
      {/*}*/}

      {
        // <Source
        //   id="earthquakes"
        //   type="geojson"
        //   data={"https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson"}
        //   cluster={true}
        //   clusterMaxZoom={14} // Max zoom to cluster points on
        //   clusterRadius={50} // Radius of each cluster when clustering points (defaults to 50)
        // />
      }
      {
        // 3D
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

