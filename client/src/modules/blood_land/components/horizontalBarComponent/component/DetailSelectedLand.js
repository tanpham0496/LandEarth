import React, {Fragment, useEffect, useRef} from 'react';
import TranslateLanguage from './../../general/TranslateComponent';
import {connect, useDispatch} from "react-redux";
import { MAX_LEVEL, MAX_BLOOD, MAX_SELECTED_TILE } from '../../../../../helpers/constants';
import _ from 'lodash';



function DetailSelectedLand(props) {
    const {
        map: { selected=[] },
        lands: { buyLandInfos=[], sellLandInfos=[], cancelLandInfos=[]},
        user: { goldBlood },
    } = props;
    const root = useRef();

    useEffect(() => {
        //use single click show tooltip
        if (props.isClick) {
            window.addEventListener('click', _handleHoverSelected, false);
        } else {
            window.addEventListener('mouseover', _handleHoverSelected, false);
        }

        return () => {
            //use single click show tooltip
            if (props.isClick) {
                window.addEventListener('click', _handleHoverSelected, false);
            } else {
                window.removeEventListener('mouseover', _handleHoverSelected, false);
            }
        };
    }, []);

    const _handleHoverSelected = (event) => {
        event.preventDefault();

        const clickX = event.clientX;
        const clickY = event.clientY;

        const screenW = window.innerWidth;
        const screenH = window.innerHeight;

        if (!root || !root.current) return;
        //if(root.current) return;
        const rootW = root.current.offsetWidth;
        const rootH = root.current.offsetHeight;

        const right = (screenW - clickX) > rootW;
        const left = !right;
        const top = (screenH - clickY) > rootH;
        const bottom = !top;
        
        //set location show totalSelected and totalMoneyBlood
        if(right) root.current.style.left = `${clickX + 5}px`;
        if(left) root.current.style.left = `${clickX - rootW + 55}px`;
        if(top) root.current.style.top = `${clickY - 120}px`;
        if (bottom) root.current.style.top = `${clickY - rootH}px`;
    };

    const totalTile = selected.reduce((total, sl) => total += 4**(MAX_LEVEL - sl.level), 0);
    const totalBlood = buyLandInfos.reduce((total, sl) => total += sl.sellPrice, 0);

    const numberStyleSelected = { fontWeight: 'bold', color: '#228654' }
    const numberStyleCanBuy = { fontWeight: 'bold', color: (buyLandInfos && buyLandInfos.length > MAX_SELECTED_TILE ? '#AC0000' : '#228654') }
    const numberStyleCanSell = { fontWeight: 'bold', color: (sellLandInfos.length > MAX_SELECTED_TILE ? '#AC0000' : '#228654') }
    const numberStyleCandCancelSell = { fontWeight: 'bold', color: (cancelLandInfos.length > MAX_SELECTED_TILE ? '#AC0000' : '#228654') }
    const numberStyleBlood = { fontWeight: 'bold', color: (totalBlood > MAX_BLOOD || totalBlood > goldBlood ? '#AC0000' : '#228654') }
    return (
        <div ref={root} className='tooltipTotalBlood'>
            {
                <Fragment> 
                    {totalBlood <= MAX_BLOOD && <div className={'totalTileSelected'}><TranslateLanguage direct={'totalSelected.totalTile'}/> : <span style={numberStyleSelected} >{ totalTile }</span></div>}
                    {totalBlood <= MAX_BLOOD && <div className={'totalTileSelected'}><TranslateLanguage direct={'totalSelected.totalCanBuy'}/> : <span style={numberStyleCanBuy} >{ buyLandInfos && buyLandInfos.length }</span></div>}
                    {totalBlood <= MAX_BLOOD && <div className={'totalTileSelected'}><TranslateLanguage direct={'totalSelected.totalCanSale'}/> : <span style={numberStyleCanSell} >{ sellLandInfos && sellLandInfos.length }</span></div>}
                    {totalBlood <= MAX_BLOOD && <div className={'totalTileSelected'}><TranslateLanguage direct={'totalSelected.totalCanCancelSale'}/> : <span style={numberStyleCandCancelSell} >{ cancelLandInfos && cancelLandInfos.length }</span></div>}
                    {buyLandInfos && buyLandInfos.length <= MAX_SELECTED_TILE && <div className={'totalTileSelected'} ><TranslateLanguage direct={'totalSelected.totalBlood'}/> : <span style={numberStyleBlood} >{ totalBlood > MAX_BLOOD ? "999999999+" : totalBlood }</span></div>}
                </Fragment>
            }
        </div>
    );
}


export default connect(
    state => {
        const { authentication: {user}, map, lands, wallet } = state;
        return { user, map, lands, wallet };
    },
    null
)(DetailSelectedLand);