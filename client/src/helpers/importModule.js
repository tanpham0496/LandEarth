import common,{onHandleTranslate} from './Common';
import Rules                      from "./ValidationRule";
import {    
   getImgByTypeCode,
   getShopThumbnailByItemId,
   getMapImgByItemId,
   getShopImgByItemId
} from './thumbnails';

import {
   loadingImage,
   QuadKeyToLatLong,
   TileXYToQuadKey,
   TileXYToLatLong,
   QuadKeyToTileXY,
   LatLongToTileXY,
} from '../modules/blood_land/components/general/System';


import TranslateLanguage        from './../modules/blood_land/components/general/TranslateComponent';
import MessageBox               from '../modules/blood_land/components/general/MessageBox';
import MessageBoxNew            from '../modules/blood_land_V2/component/Popup/MessageBox';
import ItemTranslate            from '../modules/blood_land/components/general/ItemTranslate';

import {alertActions}           from "../store/actions/commonActions/alertActions";
import {objectsActions}         from '../store/actions/gameActions/objectsActions';
import {shopsActions}           from '../store/actions/gameActions/shopsActions';
import {inventoryActions}       from '../store/actions/gameActions/inventoryActions';
import {userActions}            from '../store/actions/commonActions/userActions';

import {landActions}            from "../store/actions/landActions/landActions";
import {mapActions}             from "../store/actions/commonActions/mapActions";
import {socketActions}          from "../store/actions/commonActions/socketActions"
import {screenActions}           from "../store/actions/commonActions/screenActions";
import {mapGameAction}           from "../store/actions/gameActions/mapGameActions";
import {settingActions}           from "../store/actions/commonActions/settingActions";



export {
   common,
   onHandleTranslate,
   Rules,

   getImgByTypeCode,
   getShopThumbnailByItemId,
   getMapImgByItemId,
   getShopImgByItemId,
   //System
   loadingImage,
   QuadKeyToLatLong,
   TileXYToQuadKey,
   TileXYToLatLong,
   QuadKeyToTileXY,
   LatLongToTileXY,

   TranslateLanguage,
   MessageBox,
   ItemTranslate,
   //Action
   alertActions,
   objectsActions,
   shopsActions,
   inventoryActions,
   userActions,
   landActions,
   mapActions,
   socketActions,
   screenActions,
   mapGameAction,
   settingActions,
   MessageBoxNew
};