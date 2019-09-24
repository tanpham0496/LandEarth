import React, {Fragment, memo} from 'react'
import {connect} from 'react-redux';
import PlantCultivationPopup from "../../gameUIComponent/Common/PlantCultivationComponent/PlantCultivationPopup";
import {translate} from 'react-i18next';
import PlantTreeOnOtherUserLand from "../../common/Popups/GameMapPopups/PlantTreeOnOtherUserLand"
import PlantTreeOnForSaleLandAlert from "../../common/Popups/GameMapPopups/PlantTreeOnForSaleLandAlert"
import ExistTreeAlert from "../../common/Popups/GameMapPopups/ExistTreeAlert"
import ConfirmPlantingTree from "../../common/Popups/GameMapPopups/ConfirmPlantingTree"
import UseLimitedItemAlert from "../../common/Popups/GameMapPopups/UseLimitedItemAlert"
import UsingItemForTreeConfirm from "../../common/Popups/GameMapPopups/UsingItemForTreeConfirm"
import UsingItemByBloodForTreeConfirm from "../../common/Popups/GameMapPopups/UsingItemByBloodForTreeConfirm"
import DroppingTreeUnsuccessAlert from "../../common/Popups/GameMapPopups/DroppingTreeUnsuccessAlert"
import PlantingTreeSuccessAlert from "../../common/Popups/GameMapPopups/PlantingTreeSuccessAlert"
import UseItemSuccessAlert from "../../common/Popups/GameMapPopups/UseItemSuccessAlert"
import LoadingPopup from '../../common/Popups/commomPopups/LoadingPopup'
import UseItemFailureAlert from '../../common/Popups/GameMapPopups/UseItemFailureAlert'
import CheckForSaleStatusAlertForItemPopup from '../../common/Popups/commomPopups/CheckForSaleStatusAlertForItemPopup'
import PlantTreeBeforeNutrientAlert from '../../common/Popups/GameMapPopups/PlantTreeBeforeNutrientAlert'
import PlantTreeBeforeShovelAlert from '../../common/Popups/GameMapPopups/PlantTreeBeforeShovelAlert'
import PlantTreeBeforeDropletAlert from '../../common/Popups/GameMapPopups/PlantTreeBeforeDropletAlert'
import RechargeAlert from '../../common/Popups/GameMapPopups/RechargeAlert'
import LeftWaterDeadAlert from '../../common/Popups/GameMapPopups/LeftWaterDeadAlert'

const GameMapRender = memo((props) => {
    const {renderMap,  screens} = props;
    return (
        <Fragment>
            {renderMap}
            {screens["PlantCultivationComponent"] && screens["PlantCultivationComponent"]._id &&
            <div className="popup-container">
                <PlantCultivationPopup objectId={screens["PlantCultivationComponent"]._id}
                                       handleHidePopup={null/* keep for old map */}
                                       handleShowAlert={null/* keep for old map */}/>
            </div>
            }
            {screens["UsingItemByBloodForTreeConfirm"] &&
            <UsingItemByBloodForTreeConfirm {...screens["UsingItemByBloodForTreeConfirm"]}/>}
            {screens["UsingItemForTreeConfirm"] && <UsingItemForTreeConfirm {...screens["UsingItemForTreeConfirm"]}/>}
            {screens["ConfirmPlantingTree"] && <ConfirmPlantingTree {...screens["ConfirmPlantingTree"]} />}
            {screens["LoadingPopup"] && <LoadingPopup/>}
            {screens["UseItemSuccessAlert"] && <UseItemSuccessAlert />}
            {screens["UseItemFailureAlert"] && <UseItemFailureAlert/>}
            {screens["CheckForSaleStatusAlertForItemPopup"] && <CheckForSaleStatusAlertForItemPopup/>}
            {screens["PlantTreeOnOtherUserLand"] && <PlantTreeOnOtherUserLand/>}
            {screens["PlantingTreeSuccessAlert"] && <PlantingTreeSuccessAlert/>}
            {screens["ExistTreeAlert"] && <ExistTreeAlert/>}
            {screens["PlantTreeOnForSaleLandAlert"] && <PlantTreeOnForSaleLandAlert/>}
            {screens["DroppingTreeUnsuccessAlert"] && <DroppingTreeUnsuccessAlert/>}
            {screens["PlantTreeBeforeNutrientAlert"] && <PlantTreeBeforeNutrientAlert/>}
            {screens["PlantTreeBeforeShovelAlert"] && <PlantTreeBeforeShovelAlert/>}
            {screens["PlantTreeBeforeDropletAlert"] && <PlantTreeBeforeDropletAlert/>}
            {screens["RechargeAlert"] && <RechargeAlert/>}
            {screens["LeftWaterDeadAlert"] && <LeftWaterDeadAlert/>}
            {screens["UseLimitedItemAlert"] && <UseLimitedItemAlert isOpenCultivationPopup={true}/>}

            {/*{ screens["ContextMenuGame"] && <ContextMenuGame/> }*/}
        </Fragment>
    )
});

const mapStateToProps = (state) => {
    const {authentication: {user}, shopsReducer: {shops}, settingReducer, screens} = state;
    return {
        user, shops, settingReducer, screens
    }
};
const mapDispatchToProps = (dispatch) => ({
    // onMoveCharacterToMap: (param) => dispatch(inventoryActions.onHandleMoveTreeToMap(param)),
    // onHandleUsingItemForTree: (param) => dispatch(inventoryActions.onHandleUsingItemForTree(param)),

    //load lai  inventory
    // getCharacterInventoryByUserId: (param) => dispatch(inventoryActions.getCharacterInventoryByUserId(param)),
    // getItemInventoryByUserId: (param) => dispatch(inventoryActions.getItemInventoryByUserId(param)),

    //load lai wallet
    // getWalletInfo: (param) => dispatch(userActions.getWalletInfo(param)),
    // onHandleGetQuadKeyBitamin: (quadKey) => dispatch(mapGameAction.onHandleGetQuadKeyBitamin(quadKey)),


});

export default connect(mapStateToProps, mapDispatchToProps)(translate('common')(GameMapRender))