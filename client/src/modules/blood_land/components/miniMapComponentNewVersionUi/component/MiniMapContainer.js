//MinhTan minimap

import React, {Component, Fragment} from 'react'
import MiniMapComponent from "./MiniMapComponent";
import MiniMapLeafletComponent from "./MiniMapLeafletComponent";
import { leafmapMode } from '../../../../../helpers/config';
import {screenActions} from "../../../../../store/actions/commonActions/screenActions";
import {connect} from "react-redux";

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
class MiniMapContainer extends Component {
    state = {
        areaMapCity: infoMapCity,
        areaMapTown: infoMapTown,
        areaMapCountry: infoMapCountry
    };
    render() {
        const {areaMapTown, areaMapCity, areaMapCountry} = this.state;
        const { toggleCountry,toggleCity,toggleTown } = this.props;
        return (
            <Fragment>
                <div className={`mapView-container ${toggleCountry} `}>
                    {leafmapMode ? <MiniMapComponent dataMap={areaMapCountry}/> : toggleCountry && <MiniMapLeafletComponent type="country" />  }
                </div>
                <div className={`mapView-container ${toggleCity} `}>
                    { leafmapMode ? <MiniMapComponent dataMap={areaMapCity}/> : toggleCity &&  <MiniMapLeafletComponent type="city" /> }
                </div>
                <div className={`mapView-container ${toggleTown} `}>
                    { leafmapMode ? <MiniMapComponent dataMap={areaMapTown}/> : toggleTown  &&  <MiniMapLeafletComponent type="town" /> }
                </div>
            </Fragment>

        )
    }
}

const mapStateToProps = (state) => {
    const { screens } = state;
    return {
        screens
    };
};

const mapDispatchToProps = (dispatch) => ({
    addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
});

export default connect(mapStateToProps,mapDispatchToProps)(MiniMapContainer)