import React, {useState, useEffect, Fragment} from 'react'
import {loadingImage} from "../../../blood_land/components/general/System";
import MiniMapBox from "../../component/mapBoxComponent/MiniMapBox";
import { useSelector } from 'react-redux';
import { getFisrtLocation } from '../mapBoxComponent/mapFunction'

const MINIMAPS = [
    {
        classname : 'map map-1',
        name: 'MAP 1',
        data: {
            //center,
            zoom: 5,
            maxZoom: 7,
            minZoom: 3,
        }
    },
    {
        classname : 'map map-2',
        name: 'MAP 2',
        data: {
            //center,
            zoom: 11,
            maxZoom: 13,
            minZoom: 9,
        }
    },
    {
        classname : 'map map-3',
        name: 'MAP 3',
        data: {
            //center,
            zoom: 16,
            maxZoom: 18,
            minZoom: 14,
        }
    }
];

const SIZES = [
    { width: 353, height: 55 },
    { width: 353, height: 275 },
    { width: 510, height: 387 },
]

function MenuMap(props) {

    const [CLOSE, SMALL, LARGE] = SIZES;
    // const [MAP1, MAP2, MAP3] = MINIMAPS;
    const { maps } = useSelector(state => state);

    const [toggleMap, setToggleMap] = useState(null); //null, small, large
    const [selectedMap, setSelectedMap] = useState(null);
    const [center, setCenterMiniMap] = useState(null);
    //set size

    const [size, setSize] = useState(CLOSE);
    const [lastSelectMap, setLastSelect] = useState(MINIMAPS[0]);

    //get center first load
    useEffect(() => {
        getFisrtLocation().then(location => {
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
        setSelectedMap(MINIMAPS[index]);
        if(!toggleMap){
            setTimeout(() => setSize(SMALL), 0.01);
            setToggleMap('small');
        }
    };

    const closeMap = () => {
        setTimeout(()=> setSize(CLOSE), 0.01);
        setToggleMap(null);
        setLastSelect(selectedMap);
        setSelectedMap(null);
    }

    const onHandleToggle = (zoomType) => {
        if(zoomType === 'zoomLarge'){
            if(toggleMap === 'large'){
                closeMap();
            } else {
                setTimeout(()=> setSize(LARGE), 0.01);
                setToggleMap('large');
                setSelectedMap(lastSelectMap);
            }
        } else if(zoomType === 'zoomSmall'){
            if(toggleMap === 'small'){
                closeMap();
            } else {
                setTimeout(()=> setSize(SMALL), 0.01);
                setToggleMap('small');
                setSelectedMap(lastSelectMap);
            }
        }

    };

    useEffect(()=> {
        props.receiveState(size.height);
    }, [size]);

    return (
        <Fragment>
            <div className={`${toggleMap === 'small' ? 'container-child-map show' : 'container-child-map' }`} style={{ ...size, position: 'relative', overflow: 'hidden' }}>
                <div className={`${(toggleMap === 'small' || toggleMap === 'large')? 'toggle-map-active' : 'toggle-map'}`} onClick={() => onHandleToggle('zoomSmall')}>
                    <img alt='toggle-map-chat' src={loadingImage('/images/bloodLandNew/func/Toggle-map-chat.png')} />
                </div>
                <div className={`${toggleMap === 'large' ? 'zoom active' : 'zoom' }`} onClick={() => onHandleToggle('zoomLarge')}>
                    <img alt='zoom' src={loadingImage('/images/bloodLandNew/func/Zoom.png')} />
                </div>
                {
                    //selectedMap
                    MINIMAPS.map((map, index) => {
                        const {classname, name } = map;
                        return (<div className={`${ selectedMap && MINIMAPS[index].name === selectedMap.name ? 'active' : ''} ${classname}`} key={index} onClick={() => onHandleToggleMap(index)}>
                            {name}
                        </div>)
                    })
                }
                {
                    selectedMap && selectedMap.data && center && size && size.height !== CLOSE.height &&
                        <div className={'mapView-container'}>
                            <MiniMapBox {...selectedMap.data } { ...{center} } { ...size } />
                        </div>
                }

            </div>
        </Fragment>
    )
};
export default MenuMap