import React, {useState, useEffect, Fragment} from 'react'
import {loadingImage} from "../../../blood_land/components/general/System";

import MenuFunction from './MenuFunction';
import MenuMap from './MenuMap'
import MenuChat from "../Chat";

const MenuLeftComponent = (props) => {
    const [transferState, setTransferState] = useState(0);
    const receiveState = (heightMap) => {
        setTransferState(heightMap);
    };
      return (
        <Fragment>
            <div className="columns is-desktop">
                <div className={'column-left'}>
                    <form className="form-search" action="">
                        <div className={'line-height'} />
                        <div className={'line-height-2'} />
                        <input className="form-control" type="text" placeholder="" aria-label="Search" />
                            <button type="submit" className={'image-search'}>
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
