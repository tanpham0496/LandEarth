import React, {useState, useEffect, Fragment} from 'react'
import {loadingImage} from "../../../blood_land/components/general/System";
import MiniMapComponent from "../../../blood_land/components/miniMapComponent/component/MiniMapComponent";
const infoMapCity = {
    center: [37.566535, 126.9779692],
    zoom: 12,
    mapOptions: {
        maxZoom: 14,
        minZoom: 10,
        disableDoubleClickZoom: true,
        fullscreenControl: false,
    },
    loadTile: false,
    loadPin: true,
};
const infoMapTown = {
    center: [37.566535, 126.9779692],
    zoom: 17,
    mapOptions: {
        maxZoom: 19,
        minZoom: 15,
        disableDoubleClickZoom: true,
        fullscreenControl: false,
    },
    loadTile: false,
    loadPin: true,
};
const infoMapCountry = {
    center: [37.566535, 126.9779692],
    zoom: 6,
    mapOptions: {
        maxZoom: 8,
        minZoom: 4,
        disableDoubleClickZoom: true,
        fullscreenControl: false,
    },
    loadTile: false,
    loadPin: true,
};
const ListMap = [
    {
        tab : '1',
        classname : 'map map-1',
        state: 'toggleMap1',
        setState: 'setToggleMap1',
        name: 'MAP 1',
        map : <MiniMapComponent dataMap={infoMapCity}/>
    },
    {
        tab : '2',
        classname : 'map map-2',
        state: 'toggleMap2',
        setState: 'setToggleMap2',
        name: 'MAP 2',
        map : <MiniMapComponent dataMap={infoMapTown}/>
    } ,
    {
        tab : '3',
        classname : 'map map-3',
        state: 'toggleMap3',
        setState: 'setToggleMap3',
        name: 'MAP 3',
        map : <MiniMapComponent dataMap={infoMapCountry}/>
    }
];
function MenuMap(props) {
    const [toggleMap, setToggleMap] = useState(false);

    const [activeIndexMap, setActiveIndexMap] = useState(0);

    const [zoomMap, setZoomMap] = useState(false);
    //State width height Map
    const [widthMap, setWidthMap] = useState(353);
    const [heightMap, setHeightMap]= useState(55);

    const onHandleToggleMap = (state,tab,ind) => {
        setActiveIndexMap(ind);
        setTimeout(()=> { setWidthMap(353);  setHeightMap(215); },0.01);
        setToggleMap(true);
    };

    const onHandleResizeMap = () => {
        setToggleMap(!toggleMap);
        setZoomMap(false);
        setTimeout(()=> {
            if(toggleMap){setHeightMap(55); setWidthMap(353)}
            else  {setHeightMap(275);  setWidthMap(353) }
        },0.01)
    };
    const onHandleZoomMap = () => {
        setZoomMap(!zoomMap);
        setToggleMap(false);
        if(zoomMap) {setHeightMap(55); setWidthMap(353)}
        else  { setHeightMap(387); setWidthMap(510)}
    };
    useEffect(()=> {
        props.receiveState(heightMap);
    }, [heightMap])

    return (
        <Fragment>
            <div className={`${toggleMap ? 'container-child-map show' : 'container-child-map' }`} style={{width: `${widthMap + 'px'}` , height: `${heightMap + 'px'}` }}>
                <div className={`${toggleMap || zoomMap ? 'toggle-map-active' : 'toggle-map'}`} onClick={onHandleResizeMap}>
                    <img src={loadingImage('/images/bloodLandNew/func/Toggle-map-chat.png')} />
                </div>
                <div className={`${zoomMap ? 'zoom active' : 'zoom' }`} onClick={onHandleZoomMap}>
                    <img  src={loadingImage('/images/bloodLandNew/func/Zoom.png')} />
                </div>
                {ListMap.map((value,ind) => {
                    const {tab, classname, state,name, map} = value;
                    const classActive = activeIndexMap === ind ? 'active' : '';
                    return(
                        <div>
                            <div key={ind} className={`${classActive} ${classname}`} onClick={()=>onHandleToggleMap(state,tab,ind)}>
                                {name}
                            </div>
                            {(toggleMap || zoomMap) && <div className={'mapView-container'}>
                                {map}
                            </div>}
                        </div>
                        
                    )
                })}

            </div>
        </Fragment>
    )
};
export default MenuMap