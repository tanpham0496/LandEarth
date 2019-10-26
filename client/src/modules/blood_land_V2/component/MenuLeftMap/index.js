import React, {useState, useEffect, Fragment} from 'react'
import {loadingImage} from "../../../blood_land/components/general/System";

import MenuFunction from '../Function';
import MenuMap from './MenuMap'
import MenuChat from "../Chat";
import { mapBoxKey } from '../../../../helpers/config'
import axios from 'axios';
import { useDispatch } from 'react-redux';
import {mapActions} from '../../../../store/actions/commonActions/mapActions'

const MenuLeftComponent = (props) => {

    const dispatch = useDispatch();
    const [searchText, setSearchText] = useState("");
    const [transferState, setTransferState] = useState(0);

    const receiveState = (heightMap) => {
        setTransferState(heightMap);
    };
    
    const _onChangeText = (e) => {
        setSearchText(e.target.value);
    }

    const _onHandleSubmitSearch = (e) => {
        e.preventDefault();
        axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${ searchText }.json?access_token=${ mapBoxKey }&autocomplete=true`)
            .then(json => {
                if(json && json.data && json.data.features && json.data.features[0] && json.data.features[0].center){
                    const [lng, lat] = json.data.features[0].center;

                    //set empty input
                    setSearchText('');

                    //go to center
                    dispatch(mapActions.syncMap({ center: { lat, lng } }));

                    //save last location
                    localStorage.setItem('lat', lat);
                    localStorage.setItem('lng', lng );
                }
            })
    }

    return (
        <Fragment>
            <div className="columns is-desktop">
                <div className={'column-left'}>
                    <form className="form-search" onSubmit={_onHandleSubmitSearch}>
                        <div className={'line-height'} />
                        <div className={'line-height-2'} />
                        <input className="form-control" type="text" placeholder="Search" aria-label="Search" value={searchText} onChange={_onChangeText} />
                            <button type="submit" className={'image-search'} >
                                <img className={'image-search'}  src={loadingImage('/images/bloodLandNew/func/search.png')}/>
                            </button>
                    </form>
                    <MenuFunction />
                    <div className={'map-chat'}>
                       <MenuMap receiveState={receiveState}/>
                       <MenuChat transferState={transferState}/>
                    </div>
                </div>
            </div>
        </Fragment>
    )
};
export default MenuLeftComponent
