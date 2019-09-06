import React, { useEffect , Fragment} from 'react';
import connect from "react-redux/es/connect/connect";
import GameUICommon from '../../gameUIComponent/Common/IdentityCard';
import {loadingImage} from "../../general/System";
import TranslateLanguage from "../../general/TranslateComponent";
import Tooltip from './../../general/Tooltip';

import BitaminExchange from './bitaminComponent/bitaminExchange';
import BitaminHistory from './bitaminComponent/bitaminHistory';
import { bitaminActions } from '../../../../../store/actions/landActions/bitaminActions';
import { LazyImage } from 'react-lazy-images';
import {loadingImg, loading} from "../../common/Components/CommonScreen"
import {screenActions} from "../../../../../store/actions/commonActions/screenActions";

const BitaminMenuList = [
    {
        name: <TranslateLanguage direct={'menuTab.bitamin.bitaminExchange'}/>,
        image: loadingImage('/images/game-ui/tab11/nav1.svg'),
        type: "bitaminExchange",
        toolTip: <Tooltip nameLang={'menuTab.bitamin.bitaminExchange.toolTip.name'} descLang={'menuTab.bitamin.bitaminExchange.toolTip.desc'} />
    },
    {
        name: <TranslateLanguage direct={'menuTab.bitamin.bitaminHistory'}/>,
        image: loadingImage('/images/game-ui/tab11/nav2.svg'),
        type: "bitaminHistory",
        toolTip: <Tooltip nameLang={'menuTab.bitamin.bitaminHistory.toolTip.name'} descLang={'menuTab.bitamin.bitaminHistory.toolTip.desc'} />
    }
];
const  Bitamin = (props) => {
    const {bitamin , getMyBitamin , user , addPopup , screens} = props;

    useEffect(() => {
        const {user: {wToken}} = props;
        getMyBitamin({wToken});
    },[]);

    return(
        <Fragment>
            <ul className='function-menu'>
                <GameUICommon/>
                <li className='no-hover'>
                    <div className='my-blood-coin'>
                        <div className='blood-coin'>
                            <LazyImage src={loadingImage('/images/game-ui/bitamin-title.svg')}
                                       placeholder={({ ref }) => (
                                           loadingImg(ref)
                                       )}
                                       actual={({ imageProps }) => <img {...imageProps} alt="bitamin" />} />
                            <br/>
                            <TranslateLanguage direct={'menuTab.bitamin.myBitamin'}/>
                        </div>

                        <div className='blood-coin-value'>
                            <TranslateLanguage direct={'menuTab.bitamin.myBitamin.availableBitamin'}/>
                            {typeof (bitamin) === 'undefined' ? loading() : bitamin ? parseFloat(bitamin).toLocaleString() : user.bitamin && parseFloat(user.bitamin).toLocaleString() }
                        </div>
                    </div>
                </li>
                {BitaminMenuList.map((item , index) => {
                    const {name , type , image , toolTip} = item;
                    return (
                        <li className={screens[type] && 'active'} key={index} onClick={() => addPopup({name: type })}>
                            <LazyImage src={image}
                                       placeholder={({ref}) => (loadingImg(ref))}
                                       actual={({ imageProps }) => <img {...imageProps} alt={type} />} />
                            <div>{name}</div>
                            {toolTip}
                        </li>
                    )
                })}
            </ul>
            {screens['bitaminExchange'] && <BitaminExchange bitamin={bitamin}/>}
            {screens['bitaminHistory'] && <BitaminHistory/>}
        </Fragment>

    )
};

const mapStateToProps = (state) => {
    const {authentication: {user}, bitaminReducer:{bitamin} , screens} = state;
    return {
        user,
        bitamin, screens
    };
};

const mapDispatchToProps = (dispatch) => ({
    addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
    getMyBitamin: (param) => dispatch(bitaminActions.getMyBitamin(param))
});

const connectedPage = connect(mapStateToProps, mapDispatchToProps)(Bitamin);
export default connectedPage;