import React, {useState, useEffect, Fragment} from 'react'
import {loadingImage} from "../../../blood_land/components/general/System";
import MiniMapBox from "../../component/mapBoxComponent/MiniMapBox";
import { useSelector } from 'react-redux';
import { getFisrtLocation } from '../mapBoxComponent/mapFunction'

const miniMaps = [
    {
        classname : 'map map-1',
        name: 'MAP 1',
        data: {
            //center,
            zoom: 17,
            maxZoom: 19,
            minZoom: 15,
        }
    },
    {
        classname : 'map map-2',
        name: 'MAP 2',
        data: {
            //center,
            zoom: 12,
            maxZoom: 14,
            minZoom: 10,
        }
    },
    {
        classname : 'map map-3',
        name: 'MAP 3',
        data: {
            //center,
            zoom: 6,
            maxZoom: 8,
            minZoom: 4,
        }
    }
];

function MenuMap(props) {

    const { maps } = useSelector(state => state);

    const [toggleMap, setToggleMap] = useState(null); //null, small, large
    const [selectedMap, setSelectedMap] = useState(miniMaps[0]);
    const [center, setCenterMiniMap] = useState(null);
    //set size
    const CLOSE_SIZE = { width: 353, height: 55 };
    const SMALL_SIZE = { width: 353, height: 275 };
    const LARGE_SIZE = { width: 510, height: 387 };
    const [size, setSize] = useState(CLOSE_SIZE);

    //get center first load
    useEffect(() => {
        getFisrtLocation().then(location => {
            // console.log('location', location);
            setCenterMiniMap(location);
        });
    }, []);

    //
    useEffect(() => {
        if(maps.center){
            setCenterMiniMap(maps.center);
        }
    }, [maps.center]);

    useEffect(()=> {
        props.receiveState(size.height);
    }, [size]);

    const onHandleToggleMap = (index) => {
        setSelectedMap(miniMaps[index]);
        if(!toggleMap){
            setTimeout(() => setSize(SMALL_SIZE), 0.01);
            setToggleMap('small');
        }
    };

    const onHandleToggleSmallSize = () => {
        if(toggleMap === 'small'){
            setTimeout(()=> setSize(CLOSE_SIZE), 0.01);
            setToggleMap(null);
            setSelectedMap(miniMaps[0])
        } else {
            setTimeout(()=> setSize(SMALL_SIZE), 0.01);
            setToggleMap('small');
            setSelectedMap(miniMaps[0]);
        }
    };

    const onHandleToggleLargeSize = () => {
        if(toggleMap === 'large'){
            setTimeout(()=> setSize(CLOSE_SIZE), 0.01);
            setToggleMap(null);
            setSelectedMap(miniMaps[0])
        } else {
            setTimeout(()=> setSize(LARGE_SIZE), 0.01);
            setToggleMap('large');
            setSelectedMap(miniMaps[0]);
        }
    };

    useEffect(()=> {
        props.receiveState(size.height);
    }, [size]);

    return (
        <Fragment>
            <div className={`${toggleMap === 'small' ? 'container-child-map show' : 'container-child-map' }`} style={{ ...size, position: 'relative', overflow: 'hidden' }}>
                <div className={`${(toggleMap === 'small' || toggleMap === 'large')? 'toggle-map-active' : 'toggle-map'}`} onClick={onHandleToggleSmallSize}>
                    <img src={loadingImage('/images/bloodLandNew/func/Toggle-map-chat.png')} />
                </div>
                <div className={`${toggleMap === 'large' ? 'zoom active' : 'zoom' }`} onClick={onHandleToggleLargeSize}>
                    <img  src={loadingImage('/images/bloodLandNew/func/Zoom.png')} />
                </div>
                {
                    //selectedMap
                    miniMaps.map((map, index) => {
                        const {classname, name } = map;
                        return (<div className={`${miniMaps[index].name === selectedMap.name ? 'active' : ''} ${classname}`} key={index} onClick={() => onHandleToggleMap(index)}>
                            {name}
                        </div>)
                    })
                }
                {
                    selectedMap && selectedMap.data && center && size &&
                        <div className={'mapView-container'}>
                            <MiniMapBox {...selectedMap.data } { ...{center} } { ...size } />
                        </div>
                }

            </div>
        </Fragment>
    )
};
export default MenuMap