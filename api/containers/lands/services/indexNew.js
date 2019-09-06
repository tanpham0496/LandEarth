// process.env.NODE_ENV = 'development';

const isNil = require('lodash.isnil');
const isNull = require('lodash.isnull');
const bCrypt = require('bcryptjs');
const groupBy = require('lodash.groupby');
const db = require('../../../db/db');
const Land = db.Land;
const Objects = db.Object;
const Land23 = db.Land23;
const LandPending = db.LandPending;
const LandCategory = db.LandCategory;
const LandCharacter = db.LandCharacter;
const LandConfig = db.LandConfig;
const LandHistory = db.LandHistory;
const AdminLandHistory = db.AdminLandHistory;
const ObjectId = require('mongoose').Types.ObjectId;
const uuid4 = require('uuid4');
const rp = require('request-promise');
const cheerio = require('cheerio');
const _ = require('lodash');
const moment = require('moment');

const gameService = require('../../game');
const gameTreeService = require('../../game/changeOwnerTree');
const config = require('../../../db/config');

const usersService = require('./../../users/services/index');
const mailsSerivice = require('./../../users/services/mails');
const landLogService = require('../../../containers/lands/services/landLog');

const LAND_LEVEL_OFFSET = 1;
const PARENT_1_RANGE = 4; //lv19
const PARENT_2_RANGE = 5; //lv18

const landCollections = {
    1: db.Land01,
    2: db.Land02,
    3: db.Land03,
    4: db.Land04,
    5: db.Land05,
    6: db.Land06,
    7: db.Land07,
    8: db.Land08,
    9: db.Land09,
    10: db.Land10,
    11: db.Land11,
    12: db.Land12,
    13: db.Land13,
    14: db.Land14,
    15: db.Land15,
    16: db.Land16,
    17: db.Land17,
    18: db.Land18,
    19: db.Land19,
    20: db.Land20,
    21: db.Land21,
    22: db.Land22
};

const {
    QuadKeyToTileXY,
    TileXYToLatLong,
    LatLongToTileXY,
    TileXYToQuadKey,
    QuadKeyToLatLong,
} = require("../../../helpers/custom/quadKeyConvert");

module.exports = {
    getSellLandInfos,
    getLandInfo,
    getLandByQuadKeys,
    getAreaLand,
    getOpenCountry,
    getAllLandMarkCategoryInMap,
    addCenterCategory,
    getAllLandById,
    forbidLandDirect,
    purchaseLand23,
    getAllHistoryTradingLandById,
    removeHistory,
    getAllCategory,

    addCategory,
    editCategory,
    transferLandCategory,
    getAllLandByUserId,

    updateLandsState,
    deleteLandCategory,
    editLand,

    getAllLandCategory,
    getAllLandMarkCategory,
    getLandByCategory,

    updateLandMarksState,
    getAllLandCategoryNew,
    transferLandCategoryNew,
    getAllLandByCategoryId
};

const MAX_SELECTED_LAND = 300;

function splitLandLevel24({ quadKeys, level=24 }) {
    while(quadKeys.some(qk => qk.length < level)){
        const fIndex = quadKeys.findIndex( qk => qk.length < level);
        const baseQK = quadKeys.splice(fIndex, 1)[0];
        const allChild = [0, 1, 2, 3].map(number => baseQK + number);
        quadKeys = quadKeys.concat(allChild);
    }
    return quadKeys;
}

async function getSellLandInfos({ userId, quadKeys, cateIds }){
    //console.log('getSellLandInfos', { userId, quadKeys, cateIds })
    try {
        if(!userId) return { status: false, err: 'noUserId' };
        if(!_.isArray(quadKeys)) return { status: false, err: 'noQuadKeys' };
        if(!_.isArray(cateIds)) return { status: false, err: 'noCateIds' };

        const sellLands = await db.Land23.find({ 'user._id': ObjectId(userId), $or:[{categoryId: { $in: cateIds }}, {quadKey: { $in: quadKeys }}], forSaleStatus: false })
                                        .select('quadKey sellPrice initialPrice forSaleStatus forbidStatus user -_id');
        if(!sellLands && sellLands.length === 0) return { status: false, err: 'noLandsForSale' };
        //console.log('sellLands',sellLands);
        return { status: true, sellLands };
    } catch(e) {
        console.log('Err:', e);
        return { status: false, err: e };
    }
}

/*
    controler: /lands/getLandByQuadKeys
    getLandByQuadKeys({ userId, itemQuadKeys })
    userId: userID
    itemQuadKeys: [{ quadKey, userId }];
*/
async function getLandByQuadKeys({ userId, quadKeys }){
    //check min number quadkey buy
    if(!quadKeys || quadKeys.length === 0) return { status: false, error: "noLand", buyLandInfos: [] };

    //check max number quadkey buy
    const quadKeys24 = splitLandLevel24({ quadKeys });

    //check default landprice
    const landConfig = await LandConfig.findOne({});
    if(!landConfig) return { status: false, error: "cannotFoundLandConfig", buyLandInfos: [] };

    //arrLandExist: include land buy from other user sale and land cannot buy (other user don't sell or my land)
    const arrLandExist = await db.Land23.find({ quadKey: { $in: quadKeys24 } }).select('quadKey sellPrice initialPrice forSaleStatus forbidStatus user -_id');
    //const arrLandCanBuy = await db.Land23
    const [arrLandCanBuy, arrLandCannotBuy] = _.partition(arrLandExist, land => !_.isEqual(ObjectId(land.user._id), ObjectId(userId)) && land.forSaleStatus === true && land.forbidStatus === false);
    //console.log('[arrLandCanBuy, arrLandCannotBuy]', [arrLandCanBuy, arrLandCannotBuy]);

    const arrQuadKeyByFromSanta = quadKeys24.filter(qk => !arrLandExist.some(existLand => existLand.quadKey === qk));
    const arrLandBuyFromSanta = arrQuadKeyByFromSanta.map(qk => ({ quadKey: qk, sellPrice: landConfig.landPrice, initialPrice: landConfig.landPrice }));
    const totalCanBuyLand = [...arrLandBuyFromSanta, ...arrLandCanBuy];
    //console.log('totalCanBuyLand', totalCanBuyLand);

    const arrLandNoSell = await db.Land23.find({ quadKey: { $in: quadKeys24 }, 'user._id': ObjectId(userId), forSaleStatus: false }).select('quadKey sellPrice initialPrice forSaleStatus forbidStatus user -_id');
    const arrLandSell = await db.Land23.find({ quadKey: { $in: quadKeys24 }, 'user._id': ObjectId(userId), forSaleStatus: true }).select('quadKey sellPrice initialPrice forSaleStatus forbidStatus user -_id');
    
    if(totalCanBuyLand.length === 0) return { status: false, error: "noLand", buyLandInfos: [], sellLandInfos: arrLandNoSell, cancelLandInfos: arrLandSell };
    //if(totalCanBuyLand.length === 0) return { status: false, error: "noLand", buyLandInfos: [], sellLandInfos: arrLandNoSell, cancelLandInfos: arrLandSell };
    if(totalCanBuyLand.length > MAX_SELECTED_LAND) return { status: false, error: "tooManyLand", buyLandInfos: totalCanBuyLand };

    return { status: true, buyLandInfos: totalCanBuyLand, sellLandInfos: arrLandNoSell, cancelLandInfos: arrLandSell };
}

/*
controler: /lands/getLandInfo
getLandInfo({ quadKey })
quadKey: "132110320123013000331112"
result success: { status: true, landInfo }
result error: { status: false, landInfo: null }
*/
async function getLandInfo({ quadKey }){
    const info = await db.Land23.findOne({ quadKey }).select('user.name user.wId quadKey initialPrice sellPrice purchasePrice purchaseDate txid -_id').lean();
    if(!info) return { status: false, info: null };
    info.latlng = QuadKeyToLatLong(info.quadKey);
    info.purchaseDateFormat = moment(info.purchaseDate).format('DD/MM/YYYY');
    // console.log('info', info);
    return { status: true, info };
}

async function createAdminLandHistory({ type, quadKey, price, seller, buyer, nid }) {
    const newAdminHistory = new AdminLandHistory({ type, quadKey, price, seller, buyer, nid });
    return newAdminHistory.save();
}

async function getAllLandMarkCategoryInMap() {
    let allLandMark = await LandCategory.find({ typeOfCate: 'landmark' }).lean();
    let landmarkWithLocation = allLandMark.filter(lm => lm && lm.center && lm.center.lat && lm.center.lng);
    let allLandMarkWithLocation = landmarkWithLocation.map(lmwl => {
        let { x, y } = LatLongToTileXY(lmwl.center.lat, lmwl.center.lng, 24);
        let centerQuadKey = TileXYToQuadKey(x, y, 24);
        lmwl.centerQuadKey = centerQuadKey;
        return lmwl;
    });
    return allLandMarkWithLocation;
}

async function addCenterCategory(param) {
    const { cateId, center } = param;
    const update = await LandCategory.findOneAndUpdate({ _id: ObjectId(cateId) }, { center: center }, { new: true });
    return { update, success: update ? true : false };
}

async function getLandByCategory({ cateId, userId }) {
    try {
        //console.log("cate", typeof cateId);
        let lands = await Land23.find({ categoryId: cateId || null, 'user._id': ObjectId(userId) }).select("quadKey sellPrice name forSaleStatus categoryId");
        return { cateId, lands };
    } catch (err) {
        console.log("Err: ", err);
        return { cateId, lands: [] };
    }
}

function getOpenCountry() {
    return db.OpenCountry.find({ releaseDate: { $lte: new Date() } });
}

async function getAreaLand({ parents1, level }) {
    //console.log('getAreaLand', { parents1, level });
    let allLands = [];
    if (level) {
        const landLevel = level - LAND_LEVEL_OFFSET;
        if (landLevel === 23) {
            allLands = await Land23.find({ quadKeyParent1: { $in: parents1 } }).select('user._id user.role forbidStatus forSaleStatus sellPrice quadKey').lean();
        } else {
            allLands = await landCollections[landLevel].find({ quadKeyParent1: { $in: parents1 } }).select('-user.nid  -__v').lean();
        }
    }
    return { allLands };
}

async function getAllLandById({ userId }) {
    let myLand = await Land23.find({ 'user._id': userId }).lean();
    return { myLand: myLand };
}

//quadKeys= ["123", "212"]
async function cancelSellLand({ userId, quadKeys, mode, zoom }){
    try {
        const MIN_ZOOM = 18;
        const MAX_ZOOM = 22;
        const QUADKEY_LEVEL_OFFSET = 2;

        if(!userId) return { success: false, mode, updates: [], zoom };
        if(!_.isArray(quadKeys) || _.isEmpty(quadKeys)) return { success: false, mode, updates: [], zoom };
        if(zoom > MAX_ZOOM || zoom < MIN_ZOOM) return { success: false, mode, updates: [], zoom };

        //check exist 
        const user = await db.User.findOne({ _id: ObjectId(userId) });
        if(!user) return { success: false, mode, updates: [], zoom };
        const nid = Number(user.nid);
        userId = ObjectId(userId);

        //check quadKey
        const hasOtherUserLand = await db.Land23.findOne({ quadKey: { $in: quadKeys }, 'user._id': { $ne: userId } });
        if(hasOtherUserLand) return { success: false, mode, updates: [], zoom };

        //check pending quadKEy
        const landPending = await db.LandPending.find({ 'quadKey': { $in: quadKeys } });
        const landNotPending = quadKeys.filter(qk => !landPending.some(pending => pending.quadKey === qk));

        //update cancel land
        const cancelSellUpdates = await Promise.all( landNotPending.map(quadKey => Land23.findOneAndUpdate({ quadKey, 'user._id': userId, forSaleStatus: true }, { forSaleStatus: false }, { new: true })));
        const cancelSellUpdateSuccess = cancelSellUpdates.filter(l => l !== null);

        if(cancelSellUpdateSuccess.length === 0) return { success: false, mode, updates: [], zoom };

        //update fail => write log failure
        const updateFailure = quadKeys.filter(quadKey => !cancelSellUpdateSuccess.some(sUpdate => sUpdate.quadKey === quadKey));
        if(!_.isEmpty(updateFailure)) updateFailure.map(quadKey => landLogService.createLandRemoveSellHistory({ success: false, sellerId: userId, quadKey, sellerNid: nid }));

        //write log success
        cancelSellUpdateSuccess.map(landS => createAdminLandHistory({ type: 'remove sell', quadKey: landS.quadKey, price: landS.sellPrice, buyer: null, seller: userId, nid }));
        cancelSellUpdateSuccess.map(landS => landLogService.createLandRemoveSellHistory({ success: true, sellerId: userId, quadKey: landS.quadKey, price: landS.sellPrice, sellerNid: nid }));
        await updateParent(cancelSellUpdateSuccess, 'buy');

        //update zoom < 22 
        const uniqQuadKeys = _.uniq(cancelSellUpdateSuccess.map(update => update.quadKey.substring(0, zoom + QUADKEY_LEVEL_OFFSET)));
        const updateslt22 = zoom === MAX_ZOOM ? [] : await landCollections[zoom+LAND_LEVEL_OFFSET].find({ quadKey: { $in: uniqQuadKeys } });
        
        return { success: cancelSellUpdateSuccess.length > 0, updates: cancelSellUpdateSuccess, mode, updateFailure, updateslt22, zoom };
    } catch (e) {
        console.log('Error: ', e);
    }
}

//sellLand + remove sell land + change price sell land
//param = { userId, forSaleStatus, quadKeys, mode }
async function updateLandsState({ userId, forSaleStatus, quadKeys, mode, zoom=22 }) {

    if(mode === "remove_sell"){
        return await cancelSellLand({ userId, quadKeys, mode, zoom });
    }

    //==========================================================Validate==========================================================
    if(mode !== 'sell' && mode !== 're_selling') return { success: false, updates: [] };
    
    //check user
    if(!userId) return { success: false, updates: [], mode };
    const user = await db.User.findOne({ _id: ObjectId(userId) });
    
    if(!user) return { success: false, updates: [] };
    
    //check quadKey
    if(!_.isArray(quadKeys) || _.isEmpty(quadKeys)) return { success: false, updates: [] };
    const hasOtherUserLand = await db.Land23.findOne({ quadKey: { $in: quadKeys.map(q => q.quadKey) }, 'user._id': { $ne: ObjectId(userId) } });
    if(hasOtherUserLand) return { success: false, updates: [] };
    
    //check zoom
    if(zoom > 22 || zoom < 18) return { success: false, updates: [] };

    const nid = Number(user.nid);
    
    //check pending
    const pendingLandQuadKeys = await db.LandPending.find({ 'quadKey': { $in: quadKeys.map(q => q.quadKey) } }).lean();
    if (pendingLandQuadKeys.length > 0 && mode === 're_selling') {
        quadKeys.map(itemQK => landLogService.createLandChangePriceHistory({ success: false, sellerId: userId, quadKey: itemQK.quadKey, price: itemQK.landPrice, sellerNid: nid }));
        return { updates: [], success: false, mode };
    }
    //==========================================================Validate==========================================================

    //đất còn lại
    const notPendingLandQuadKeys = quadKeys.filter(qk => !pendingLandQuadKeys.some(q => q.quadKey === qk));

    //check sellLand in BigTreeQuadKey?
    const myObjects = await db.Object.find({ userId, bigTreeQuadKeys: { $exists: true } }).lean();
    const allBigTreeQuadKey = myObjects.length > 0 ? myObjects.reduce((totalQK, obj) => totalQK.concat(obj.bigTreeQuadKeys), []) : [];
    if(allBigTreeQuadKey.length > 0 && notPendingLandQuadKeys.length > 0){
        const allowQuadKeys = notPendingLandQuadKeys.map(npQK => npQK.quadKey);
        const includeQuaKeys = _.intersection(allowQuadKeys, allBigTreeQuadKey);
        if(includeQuaKeys.length > 0){
            return { updates: [], success: false, mode };
        }
    }


    let sellUpdates = [];
    if(mode === "sell"){
        sellUpdates = await Promise.all(notPendingLandQuadKeys.map(itemQK => Land23.findOneAndUpdate({ quadKey: itemQK.quadKey, 'user._id': ObjectId(userId), forSaleStatus: false }, { forSaleStatus: true, sellPrice: itemQK.landPrice }, { new: true }) ));
    } else if(mode === "re_selling"){
        sellUpdates = await Promise.all(notPendingLandQuadKeys.map(itemQK => Land23.findOneAndUpdate({ quadKey: itemQK.quadKey, 'user._id': ObjectId(userId), forSaleStatus: true }, { sellPrice: itemQK.landPrice }, { new: true }) ));
    }

    //filter
    sellUpdates = sellUpdates.filter(l => l !== null);
    let updateFailure = quadKeys.filter(itemQK => !sellUpdates.some(sUpdate => sUpdate.quadKey === itemQK.quadKey));
    if (updateFailure && updateFailure.length > 0) {
        if (mode === "sell") {
            updateFailure.map(itemQKFail => landLogService.createLandSellHistory({ success: false, sellerId: userId, quadKey: itemQKFail.quadKey, price: itemQKFail.sellPrice, sellerNid: nid }));
        }
    }
    
    if (mode === "sell") {
        try {
            sellUpdates.map(landS => createAdminLandHistory({ type: 'sell', quadKey: landS.quadKey, price: landS.sellPrice, buyer: null, seller: userId, nid }));
            sellUpdates.map(landS => landLogService.createLandSellHistory({ success: true, sellerId: userId, quadKey: landS.quadKey, price: landS.sellPrice, sellerNid: nid }));
        } catch (e) { console.log('Error: ', e) }
        await updateParent(sellUpdates, 'sell');
    } else if (mode === "re_selling") {
        try {
            sellUpdates.map(landS => createAdminLandHistory({ type: 'resell', quadKey: landS.quadKey, price: landS.sellPrice, buyer: null, seller: userId, nid }));
            sellUpdates.map(landS => landLogService.createLandChangePriceHistory({ success: true, sellerId: userId, quadKey: landS.quadKey, price: landS.sellPrice, sellerNid: nid }));
        } catch (e) { console.log('Error: ', e) }
        //do not update Parent
    }

    //==========================================New UI==========================================
    //update zoom < 22 
    let updateslt22 = [];
    if(zoom < 22 && sellUpdates.length > 0){
        const QUADKEY_LEVEL_OFFSET = 2;
        const quadKeys = sellUpdates.map(update => update.quadKey.substring(0, zoom + QUADKEY_LEVEL_OFFSET));
        const uniqQuadKeys = _.uniq(quadKeys);
        updateslt22 = await landCollections[zoom+LAND_LEVEL_OFFSET].find({ quadKey: { $in: uniqQuadKeys } });
        //console.log('updateslt22', updateslt22);
    }
    //==========================================New UI==========================================

    return { success: sellUpdates.length > 0, updates: sellUpdates, mode, updateFailure, updateslt22, zoom }
}

//=================================================================PUSCHASE LAND==================================================================================
//Puschase Land
async function buyFromWho(quadKeys, buyMode, userId) {

    const arrPM = await Promise.all(quadKeys.map(itemQK => checkExistQuadkey(itemQK.quadKey)));
    //console.log('_id', typeof arrPM[0].user._id, arrPM[0].user._id);
    //console.log('_id 2', typeof userId, userId);
    if (typeof buyMode !== 'undefined' && buyMode === 'forbid') {
        let result = quadKeys.reduce((splitLand, itemQK, i) => {
            if (arrPM[i]) {
                if (arrPM[i].forSaleStatus === true && !_.isEqual(arrPM[i].user._id, userId)) {
                    itemQK.seller = arrPM[i].user._id;
                    itemQK.sellerNid = arrPM[i].user.nid;
                    itemQK.userRole = arrPM[i].user.role;
                    splitLand.buyFromOtherUserSale.push(itemQK);
                } else {
                    splitLand.buyFromOtherUserNoSale.push(itemQK);
                }
            } else {
                splitLand.buyFromSystem.push(itemQK);
            }
            return splitLand;
        }, { buyFromSystem: [], buyFromOtherUserSale: [], buyFromOtherUserNoSale: [] });
        return result;
    }
    else {
        const qkeys = quadKeys.map(itemQk => itemQk.quadKey);
        const pendings = await LandPending.find({ 'quadKey': { $in: qkeys } });
        if (pendings.length !== qkeys.length) {
            return { buyFromSystem: [], buyFromOtherUserSale: [], buyFromOtherUserNoSale: [] };
        } else {
            let result = quadKeys.reduce((splitLand, itemQK, i) => {
                if (arrPM[i]) {
                    if (arrPM[i].forSaleStatus === true && !_.isEqual(arrPM[i].user._id, userId)) {
                        itemQK.seller = arrPM[i].user._id;
                        itemQK.sellerNid = arrPM[i].user.nid;
                        itemQK.userRole = arrPM[i].user.role;
                        splitLand.buyFromOtherUserSale.push(itemQK);
                    } else {
                        splitLand.buyFromOtherUserNoSale.push(itemQK);
                    }
                } else {
                    splitLand.buyFromSystem.push(itemQK);
                }
                return splitLand;
            }, { buyFromSystem: [], buyFromOtherUserSale: [], buyFromOtherUserNoSale: [] });
            //console.log('result', result);
            return result;
        }
    }
}

//param = { categoryName userRole, userId, nid, quadKeys: [{ quadKey,  }]}
async function purchaseLand23(param) {
    const { userId, nid, name, wId, categoryName, userRole, quadKeys, buyMode, txid, sellerNid } = param;
    const landConfig = await LandConfig.findOne({});
    if (buyMode === "forbid") {
        let updateMany = await puschaseNewLandFromSystem_New({
            user: { _id: new Object(userId), nid, role: userRole, name, wId },
            quadKeys: quadKeys,
            initialPrice: buyMode && buyMode === "forbid" ? landConfig.landPrice : 0,
            // categoryId: category ? category._id : null,
            categoryId: null,
            buyMode,
            txid
        });
        let pmBuyFromSystem = await Promise.all(updateMany.map(update => Land23.findOne({ quadKey: update.quadKey }).lean()));
        return { updates: pmBuyFromSystem, success: quadKeys.length === updateMany.length };
    }

    let { buyFromSystem, buyFromOtherUserSale, buyFromOtherUserNoSale } = await buyFromWho(quadKeys, buyMode, userId);

    //puschase land from system
    let updateMany = await puschaseNewLandFromSystem_New({
        user: { _id: new Object(userId), nid, role: userRole, name, wId },
        quadKeys: buyFromSystem,
        initialPrice: buyMode && buyMode === "forbid" ? landConfig.landPrice : 0,
        categoryId: null,
        buyMode,
        txid
    });

    let pmBuyFromSystem = [];
    if (buyMode && buyMode === 'forbid') {
    } else {
        //add history buy from system
        try {
            updateMany.map(update => createLandHistory({ landId: update._id, soldPrice: update.sellPrice, buyer: update.user._id }));
        } catch (e) {
            console.log('Error add history land buy from system:', e);
        }
        pmBuyFromSystem = await Promise.all(updateMany.map(update => Land23.findOne({ quadKey: update.quadKey }).lean()));
    }

    //buy from other user
    let pmBuyFromOtherUser = await Promise.all(
        buyFromOtherUserSale.map(itemQK => {
            return Land23.findOneAndUpdate(
                { quadKey: itemQK.quadKey, sellPrice: itemQK.landPrice },
                {
                    forSaleStatus: false,
                    user: { _id: Object(userId), nid, role: userRole, name, wId },
                    isPlant: false,
                    categoryId: null,
                    purchasePrice: itemQK.landPrice,
                    purchaseDate: new Date(),
                    txid,
                },
                { new: true }
            ).lean()
        })
    );

    pmBuyFromOtherUser = pmBuyFromOtherUser.filter(rs => !isNull(rs));
    buyFromOtherUserNoSale = [...buyFromOtherUserNoSale, ...pmBuyFromOtherUser.filter(rs => isNull(rs))]
    await updateParent(buyFromOtherUserSale, 'buy');

    //add history land by from other user
    try {
        //======================================================================================================GAME=======================================================================================================
        //let k = await Promise.all(
        buyFromOtherUserSale.map(landUserSale => gameTreeService.changeTreeOwner({ quadKey: landUserSale.quadKey, sellerId: landUserSale.seller, buyerId: userId, historyPrice: landUserSale.landPrice }))
        //)
        //====================================================================================================GAME CHANGE=======================================================================================================

        pmBuyFromOtherUser.map((update, i) => createLandHistory({ landId: update._id, soldPrice: update.sellPrice, buyer: update.user._id, seller: buyFromOtherUserSale[0].seller }));
        buyFromOtherUserSale.map(landUserSale => landLogService.createLandBuySuccessHistory({ buyerNid: nid, sellerNid: landUserSale.sellerNid, quantity: 1, price: landUserSale.landPrice, quadKey: landUserSale.quadKey, txid }));
    } catch (e) {
        console.log('Error add history land by from other user:', e);
    }

    //add to Admin
    try {
        pmBuyFromOtherUser.map(landU => createAdminLandHistory({ type: "buy", quadKey: landU.quadKey, price: landU.purchasePrice, buyer: userId, seller: buyFromOtherUserSale[0].seller, nid }));
    } catch (e) {
        console.log('Error: ', e);
    }
    
    let totalBuyLand = pmBuyFromOtherUser.concat(pmBuyFromSystem);
    const isSuccess = quadKeys.length === totalBuyLand.length;

    let qks = quadKeys.map(q => q.quadKey);
    await LandPending.deleteMany({ quadKey: { $in: qks } });

    buyFromOtherUserNoSale.map(itemQK => landLogService.createLandBuyFailureHistory({ buyerNid: nid, sellerNid, quantity: 1, price: itemQK.landPrice, quadKey: itemQK.quadKey }));

    return { updates: totalBuyLand, success: isSuccess, buyFailure: buyFromOtherUserNoSale, buyFromSystem: pmBuyFromSystem }
}

async function checkExistQuadkey(quadKey) {
    return Land23.findOne({ quadKey });
}

async function getAllLandMarkCategory({ userId }) {
    let LandMarkCates = await LandCategory.find({ userId: userId, typeOfCate: 'landmark' }).lean();
    let _result = LandMarkCates.map(l => {
        return {
            checked: false,
            category: {
                name: l.name,
                lands: [],
                _id: l._id,
                center: l.center,
            },
            _id: l._id,
            type: 'landmark'
        }
    });
    return _result;
}

async function getAllLandCategoryNew({ userId }) {
    try {
        const categories = await db.LandCategory.aggregate([
            { $match: { userId: ObjectId(userId) } },
            { $lookup: {
                from: "land23",
                as: "lands",
                localField: "_id",
                foreignField: "categoryId"
            } },
            {
                $project: {
                    name: 1,
                    center: 1,
                    name: 1,
                    typeOfCate: 1,
                    userId: 1,
                    landCount: { $cond: { if: { $isArray: "$lands" }, then: { $size: "$lands" }, else: 0} }
                }
            }
        ])
        //console.log('categories', categories);
        return { status: true, categories };
    } catch(e){
        console.log('Err', e);
        return { status: false, categories: null }
    }
    
}

async function getAllLandByCategoryId(param){

}

//vuonglt fix load category without land []
async function getAllLandCategory({ userId }) {

    let LandCates = await LandCategory.find({ userId: userId, typeOfCate: 'normal' }).lean();
    let _result = LandCates.map(l => {
        return {
            checked: false,
            category: {
                name: l.name,
                lands: null,
                _id: l._id,
                center: l.center,
            },
            _id: l._id,
            type: 'normal'
        }
    });
    _result.push(
        {
            checked: false,
            category: {
                name: 'empty',
                lands: null,
                _id: null,
                center: null,
            },
            _id: null,
            type: 'normal'
        }
    )

    return _result;
}

async function puschaseNewLandFromSystem_New(param) {
    const { user, quadKeys, initialPrice, categoryId, buyMode, txid } = param;
    let newLandInsert = quadKeys.map(land => {
        const { landPrice, quadKey } = land;
        return {
            user,
            categoryId: null,
            quadKey,
            sellPrice: landPrice,
            initialPrice: landPrice,
            purchasePrice: landPrice,
            forbidStatus: user.role === "manager",
            puschaseDate: new Date(),
            quadKeyParent1: quadKey.substr(0, 24 - PARENT_1_RANGE),
            quadKeyParent2: quadKey.substr(0, 24 - PARENT_2_RANGE),
            txid
        }
    });

    const landUpdate = await Land23.insertMany(newLandInsert);
    try {
        //create log history admin
        landUpdate.map(landU => createAdminLandHistory({ type: "buy", quadKey: landU.quadKey, price: landU.purchasePrice, seller: null, buyer: user._id, nid: user.nid }));
        //add log history buy land success
        landUpdate.map(landU => landLogService.createLandBuySuccessHistory({ buyerNid: user.nid, sellerNid: 0, quantity: 1, price: landU.purchasePrice, quadKey: landU.quadKey, txid }));

    } catch (e) {
        console.log('Error: ', e);
    }

    await updateParent(landUpdate, 'buy');
    return landUpdate;
}

async function forbidLandDirect({ user, quadKeys, categoryId }) {
    const { _id, role, nid, wId, name } = user;
    let newLandInsert = quadKeys.map(quadKey => {
        const landPrice = 80000;
        const forSaleStatus = true;
        const forbidStatus = false;
        return {
            user: { _id, nid, role, name, wId },
            categoryId,
            quadKey,
            sellPrice: landPrice,
            initialPrice: landPrice,
            purchasePrice: landPrice,
            forbidStatus: forbidStatus,
            forSaleStatus: forSaleStatus,
            isPlant: false,
            puschaseDate: new Date(),
            quadKeyParent1: quadKey.substr(0, 24 - PARENT_1_RANGE),
            quadKeyParent2: quadKey.substr(0, 24 - PARENT_2_RANGE),
        }
    });
    let landUpdate = [];
    try {
        landUpdate = await Land23.insertMany(newLandInsert);
        await updateParent(landUpdate, 'buy', true);
    } catch (e) {
        throw e;
        console.log(e);
    }
    return landUpdate;
}

async function updateParent(landUpdate, mode, managerCreateLandmark=null) {
    for (let landLevel = 22; landLevel > 0; landLevel--) {
        let counts = countParentCell(landUpdate, landLevel); // quadkey length = landLevel + 1
        if (counts) {
            await Promise.all(
                Object.entries(counts).map(([qk, count]) => {
                    const tmpCount = mode === 'buy' ? count : -count;
                    let update = null;
                    if(landUpdate[0].userRole === 'manager'){
                        update = { $inc: { count: tmpCount, landmarkCount: -tmpCount } };
                    } else {
                        if(managerCreateLandmark){
                            update = { $inc: { count: tmpCount, landmarkCount: tmpCount } };
                        } else {
                            update = { $inc: { count: tmpCount } }
                        }
                    }
                    if (qk.length > 5) {
                        update.quadKeyParent1 = qk.substr(0, (landLevel + 1) - PARENT_1_RANGE);
                        update.quadKeyParent2 = qk.substr(0, (landLevel + 1) - PARENT_2_RANGE);
                    }
                    return landCollections[landLevel].update({ quadKey: qk }, update, { upsert: true });
                })
            );
        }
    }
}

function getNewParents(lands, level) {
    var count = lands.length || 0;
    var parents = [];

    var quadKey;
    for (var i = 0; i < count; i++) {
        quadKey = lands[i].quadKey;
        quadKey = quadKey.substr(0, level + 1);

        parents.push({ quadKey: quadKey, count: 0 });
    }
    return parents;
}

function countParentCell(lands, level) {

    var count = lands.length || 0;
    var landCounts = {};

    var quadKey;
    for (var i = 0; i < count; i++) {
        quadKey = lands[i].quadKey;
        quadKey = quadKey.substr(0, level + 1);
        landCounts[quadKey] = (landCounts[quadKey] || 0) + 1;
    }

    return landCounts;
}
//=================================================================PUSCHASE LAND END==================================================================================

async function createLandHistory({ landId, soldPrice, seller, buyer }) {
    const newHistory = new LandHistory({ landId, soldPrice, seller, buyer });
    return newHistory.save();
}

async function getAllHistoryTradingLandById({ userId }) {
    try {
        return db.LandHistory.aggregate([
           {
              $match: {
                   $or: [
                        { 'buyer': ObjectId(userId), buyerDeleted: false },
                        { 'seller': ObjectId(userId), sellerDeleted: false }
                    ]
              }
           }
           ,{
             $lookup:
               {
                 from: "land23",
                 localField: "landId",
                 foreignField: "_id",
                 as: "land"
               }
           },
           {$unwind: '$land'},
           {
                $project: {
                    "status": true,
                    "seller": true,
                    "sellerDeleted": true,
                    "buyer": true,
                    "buyerDeleted": true,
                    "soldPrice": true,
                    "dateTrading": true,
                    "landId": "$land._id",
                    "quadKey": "$land.quadKey",
                }
           },{$sort: { dateTrading: -1 }}
        ]);
    } catch (e) {
        console.log('Error', e);
        return [];
    }
}

async function removeHistory(histories) {
    let removeBuyLands = histories.filter(h => h.buyerDeleted).map(h => new ObjectId(h.historyId));
    let removeSellLands = histories.filter(h => h.sellerDeleted).map(h => new ObjectId(h.historyId));
    if (removeBuyLands.length > 0) {
        await LandHistory.updateMany({ _id: { $in: removeBuyLands } }, { $set: { buyerDeleted: true } });
    }
    if (removeSellLands.length > 0) {
        await LandHistory.updateMany({ _id: { $in: removeSellLands } }, { $set: { sellerDeleted: true } });
    }
}

async function getAllLandByUserId(id) {
    return await Land.find({ userId: new ObjectId(id) });
}

async function getAllCategory({ userId, movedLands }) {
    let Cates = await LandCategory.find({ userId: userId }).lean();
    let effectedLands = typeof movedLands === 'undefined' ? [] : movedLands;
    //lấy tất cả lands
    let AllLands = await Land23
        .find({ "user._id": userId })
        .populate({
            path: 'categoryId',
            Model: 'LandCategory'
        })
        .lean();

    //chọn ra những land thuộc empty
    let empty = AllLands.filter(l => isNull(l.categoryId));
    //chọn ra những land khác empty
    let anotherCates = AllLands.filter(l => !isNull(l.categoryId));

    //group empty lại thành 1 object ( theo cấu trúc cũ )
    let groupEmptyCate = {
        checked: false,
        category: {
            name: "empty",
            lands: empty.map(l => {
                let land = l;
                delete land.categoryId;
                let checked = effectedLands.findIndex(eL => eL === land._id.toString()) !== -1 && !land.forSaleStatus ? true : false;
                return { land: land, checked: checked }
            })
        }
    }

    //group các land khác thành nhiều object ( theo cấu trúc cũ )
    let groupAnotherCates = anotherCates.map(cate => {
        cate.cateId = cate.categoryId._id;
        cate.cateName = cate.categoryId.name;
        cate.typeOfCate = cate.categoryId.typeOfCate;
        cate.center = cate.categoryId.center;
        delete cate.categoryId;
        return cate;

    });
    groupAnotherCates = groupBy(groupAnotherCates, 'cateId');
    let tempGroupAnotherCates = [];
    let tempGroupForbidLands = [];

    for (let cate of Cates) {
        let anotherCateName = Object.keys(groupAnotherCates);
        let index = anotherCateName.findIndex(c => c.toString() === cate._id.toString());
        if (index !== -1) {
            //nếu cate này có chứa land

            let type = cate.typeOfCate;


            let otherCate = {
                checked: false,
                type: type,
                category: {
                    _id: cate._id,
                    name: cate.name,
                    center: cate.center,
                    lands: groupAnotherCates[cate._id.toString()].map(l => {
                        let land = l;
                        delete land.categoryId;
                        let checked = effectedLands.findIndex(eL => eL === land._id.toString()) !== -1 && !land.forSaleStatus ? true : false;
                        return { land: land, checked: checked }
                    })
                }
            };
            tempGroupAnotherCates = [...tempGroupAnotherCates, otherCate];
        } else {
            //nếu cate rỗng
            let type = cate.typeOfCate;
            let otherCate = {
                checked: false,
                type: type,
                category: {
                    _id: cate._id,
                    name: cate.name,
                    lands: [],
                    center: { lat: 0, lng: 0 }
                },
            };
            tempGroupAnotherCates = [...tempGroupAnotherCates, otherCate];
        }
    }
    return [groupEmptyCate, ...tempGroupAnotherCates];

}

async function transferLandCategory(param) {
    // return param;
    const oldCateId = param.oldCateId;
    const newCateId = param.newCateId;
    const userId = param.userId;
    const movedLands = param.lands.map(l => { return l.land });

    const landIds = param.lands.map(l => l.land._id);

    if (isNil(oldCateId)) {
        await Land23.updateMany({ _id: { $in: landIds } }, { $set: { categoryId: ObjectId(newCateId) } });
        return await getLandByMultyCategory(oldCateId, newCateId, userId, movedLands);
    } else {
        if (isNil(newCateId)) {
            await Land23.updateMany({ _id: { $in: landIds } }, { $set: { categoryId: null } });
            return await getLandByMultyCategory(oldCateId, newCateId, userId, movedLands);
        } else {
            await Land23.updateMany({ _id: { $in: landIds } }, { $set: { categoryId: ObjectId(newCateId) } });
            return await getLandByMultyCategory(oldCateId, newCateId, userId, movedLands);
        }
    }
}

async function transferLandCategoryNew({ oldCateId, newCateId, userId, quadKeys }) {
    try{
        if(!oldCateId || !newCateId || !userId || !quadKeys || quadKeys.length === 0) return { status: false };
        const lands = await db.Land23.find({ quadKey: { $in: quadKeys }, "user._id": ObjectId(userId), categoryId: ObjectId(oldCateId) });
        if(lands.length !== quadKeys.length) return { status: false };
        const updateCate = await db.Land23.updateMany({ quadKey: { $in: quadKeys }, "user._id": ObjectId(userId), categoryId: ObjectId(oldCateId) }, { $set: { categoryId: ObjectId(newCateId) } });
        if(!updateCate || updateCate.nModified !== quadKeys.length) return { status: false };
        return { status: true };
    } catch(e){
        console.log('Err', e);
        return { status: false };
    }
}

async function getLandByMultyCategory(cate_1, cate_2, userId, movedLands) {
    let results = await Promise.all(
        [
            getLandByCategory({ cateId: cate_1, userId: userId }),
            getLandByCategory({ cateId: cate_2, userId: userId }),
        ]
    );
    let oldCate = results[0];
    let newCate = results[1];

    oldCate.lands = oldCate.lands.map(land => {
        return {
            checked: false,
            land: land
        };
    });
    newCate.lands = newCate.lands.map(land => {
        return {
            checked: false,
            land: land
        };
    });

    return {
        oldCategory: oldCate,
        newCategory: newCate,
        newCategoryLands: movedLands
    }
}

async function editLand({ landId, userId, name }) {
    return await Land23.findOneAndUpdate({ _id: landId, 'user._id': userId }, { $set: { name: name } }, { new: true });
}

async function editCategory({ name, userId, cateId }) {
    return await LandCategory.findOneAndUpdate({ _id: ObjectId(cateId)}, { $set: { name: name } }, { new: true });
}

async function addCategory({ name, userId }) {
    if(!userId) return { status: false, error: 'noUserId' };
    if(!name) return { status: false, error: 'noCategoryName' };
    if(name.length <= 0 || name.length > 36) return { status: false, error: 'nameLengthInvalid' };

    const findCategory = await db.LandCategory.findOne({ userId: ObjectId(userId), name });
    if(findCategory) return { status: false, error: 'existCategory' };

    const category = await db.LandCategory.create({ name, userId: new ObjectId(userId) });
    return getAllLandCategory({ userId: ObjectId(userId) });
}

async function deleteLandCategory(param) {
    const { cateId, userId } = param;
    await Land23.updateMany({ categoryId: ObjectId(cateId) }, { $set: { categoryId: null } });

    await LandCategory.findByIdAndRemove(cateId);
    let emptyCateLands = await Land23.find({ categoryId: null, "user._id": ObjectId(userId) });
    emptyCateLands = emptyCateLands.map(land => {
        return {
            checked: false,
            land: land
        };
    });
    return { cateId, emptyCateLands };
}


async function updateLandMarksState({ token, userId, quadKeys, forSaleStatus }) {
    try {
        let user = db.User.findOne({ 'wToken': token, 'userId': ObjectId(userId) });
        if (!isNull(user)) {
            let updatedLands = await Promise.all(quadKeys.map(q => {
                return db.Land23.findOneAndUpdate({ 'quadKey': q }, { $set: { 'forSaleStatus': forSaleStatus } });
            }))
            updatedLands = updatedLands.map(uL => uL.quadKey);
            return { updates: updatedLands, forSaleStatus, success: updatedLands.length > 0 };
        }
    } catch (err) {
        return { updates: [], forSaleStatus, success: false }
    }
}