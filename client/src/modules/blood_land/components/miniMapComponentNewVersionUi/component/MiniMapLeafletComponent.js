import React from 'react';

import connect from "react-redux/es/connect/connect";
import { mapActions } from "../../../../../store/actions/commonActions/mapActions";
import { Map as LeafletMap,  Marker  } from 'react-leaflet';
import MapBoxGLLayer from '../../general/MapBoxGLLayer';
import * as L from "leaflet";


function MiniMapLeafletComponent(props){

	const { map, type } = props;
	//console.log('props.map.miniMap', map.miniMap);
    //const { tiles, center, dataMap } = this.state;
    const { center } = map;
    const { zoom, minZoom, maxZoom } = map.miniMap[type];
    //console.log('center', center);
    //console.log('zoom', zoom);

    const clickMap = (e) => {
    	//console.log('clickMap', e.latlng);
    	if(e && e.latlng){
    		props.syncCenterMap([e.latlng.lat, e.latlng.lng]);
    	}
    }

    return (
        <LeafletMap
            center={center}
            zoom={zoom}
            //user={this.props.user}
            minZoom={minZoom}
            maxZoom={maxZoom}
            attributionControl={true}
            zoomControl={false}
            doubleClickZoom={false}
            scrollWheelZoom={true}
            dragging={true}
            animate={true}
            onClick={(e) => clickMap(e)}
            // easeLinearity={0.35}
            // ref={this.map}
            // onMoveend={this.onMoveEnd}
            // onMovestart={this.onMovestart}
            // onZoomstart={this.onZoomstart}
            // onZoom={this.onZoom}
            // onZoomend={this.onZoomend}
            // onViewreset={this.onViewreset}
        >
			{/* eslint-disable-next-line react/style-prop-object */}
            <MapBoxGLLayer accessToken='pk.eyJ1Ijoibmd1eWVucXVhbjEzIiwiYSI6ImNqeWwxMXBpejAzankzY3Q0czBjeHVuZ3IifQ.Rbuh_pPMRWpj_mUi1VRcUA' style='mapbox://styles/nguyenquan13/cjyl18qu4106a1do20r6j7wii' />
            {center && <Marker
                position={center}
                icon={L.divIcon({
			        iconSize: new L.Point(12, 12),
			        className: "minimapLeaf pinLeaf",
			    })}
                // onClick={e => tileClick({e, tile})}
                // onMouseover={e => tileMouseOver({e, tile})}
                // onMouseout={e => tileMouseLeave()}
            />}
        </LeafletMap>
    );

	// _onChange = ({ center, zoom, size, bounds}) => {
	// 	this.setState({ center: center, pinLeft: 0, pinTop: 0 });
	// };

	// componentDidUpdate(prevProps){
	// 	const {map:{center}} = this.props;
	// 	if(center && center !== prevProps.map.center){
	// 		this.setState({ center });
	// 	}
	// }

	// _onGoogleApiLoaded = ({map, maps}) => {
	// 	if(!maps || maps.event) return;

	// 	this.setState({ map, maps });
	// 	maps.event.addListener(map, 'bounds_changed', () => {
	// 		// this.changePin(map, maps);
	// 	});
 //        maps.event.addListener(map, 'click', (e) => {
 //            const center = {
 //                lat: e.latLng.lat(),
 //                lng: e.latLng.lng()
 //            };
	// 		this.setState({
	// 			locationPin: center
	// 		});
 //            this.props.syncCenterMap(center, null, null, true);

 //        });
	// };


	// render() {
	// 	const {dataMap:{zoom, mapOptions} } = this.state;
	// 	const {map: {center}} = this.props;
	// 	return (
	// 		<GoogleMap
	// 			center={center}
	// 			zoom={zoom}
 //                options={mapOptions}
	// 			onGoogleApiLoaded={this._onGoogleApiLoaded}
	// 			onChange={this._onChange}
	// 			yesIWantToUseGoogleMapApiInternals={true}
	// 		>
	// 			{center && <MinimapRender className={"minimap pin"} lat={center.lat} lng={center.lng}/>}
	// 		</GoogleMap>
	// 	);
	// }
}

export default connect(
	state => ({
	    map: state.map,
	}),
	dispatch => ({
	    syncCenterMap: (center, zoom, centerQuadKey, centerChange) => dispatch(mapActions.syncCenterMap(center, zoom, centerQuadKey, centerChange))
	})
)(MiniMapLeafletComponent);


// class MinimapRender extends PureComponent{
// 	render() {
// 		const {className} = this.props;
// 		return (
// 			<div className={className}/>
// 		)
// 	}
// }