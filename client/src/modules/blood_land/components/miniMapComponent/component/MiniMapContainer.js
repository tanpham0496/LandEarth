import React, {Component, Fragment} from 'react'
import MiniMapComponent from "./MiniMapComponent";
import MiniMapLeafletComponent from "./MiniMapLeafletComponent";
import EarthMapComponent from './earthMapComponent'
import { leafmapMode } from '../../../../../helpers/config';

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
export default class MiniMapContainer extends Component {
    state = {
        areaMapCity: infoMapCity,
        areaMapTown: infoMapTown,
        areaMapCountry: infoMapCountry
    };
    render() {
        const {areaMapTown, areaMapCity, areaMapCountry} = this.state;
        const {currentTab} = this.props;
        return (
            <Fragment>
                <div className='mapView-container'>
                    {currentTab === 1 ?
                        (leafmapMode ? <MiniMapComponent dataMap={areaMapCountry}/> : <MiniMapLeafletComponent type="country" /> )
                        :  <div className="earth-container">
                        <EarthMapComponent location={infoMapCountry.location} />
                    </div> }

                </div>
                <div className='mapView-container'>
                { leafmapMode ? <MiniMapComponent dataMap={areaMapCity}/> : <MiniMapLeafletComponent type="city" /> }
                </div>
                <div className='mapView-container'>
                    { leafmapMode ? <MiniMapComponent dataMap={areaMapTown}/> : <MiniMapLeafletComponent type="town" /> }
                </div>
            </Fragment>

        )
    }
}
