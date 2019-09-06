// cess.env.NODE_ENV = "development";
const db = require('../../../db/db');
const GameObject = db.Object;
const ObjectId = require('mongoose').Types.ObjectId;
const Inventory = db.Inventory;
const isNull = require('lodash.isnull');
const groupBy = require('lodash.groupby');
const moment = require('moment');
const _ = require('lodash')
module.exports = {
    getAreaObjects,
    getAllObjects,
    getAllObjectsByUserId,
    getDetailObject,
    getOnLandObjectsByUserId,
    getObjectByQuadKey,
    getObjectByCategories
};

//get area object by quadKeyParent1
/*
    level: level of Land
    quadKeyParent1: array quadKeys level20
    quadKeyParent2: array quadKeys level19
*/
async function getAreaObjects({ quadKeyParent1 }) {
    try {
        //kiểm tra xem có cây nào quá 30 ngày ko có nước và xóa đi (khác cây bitamin)
        db.Object.deleteMany({ "waterEndTime": { "$lte": new Date() } });
        //lấy danh sách cây có cùng quadKeyParent1
        return db.Object.find({
            deletedTree: false,
            quadKeyParent1: { $in: quadKeyParent1 },
            $or: [{"waterEndTime": { "$gte": new Date()}}, {"waterEndTime": null}], //cây chưa chết do thiếu nước hoặc là cây Bitamin
        }).select('bigTreeQuadKeys userId quadKey item itemId category waterStartTime waterEndTime createdDateWater createdDate').lean();
    } catch (e) {
        console.log('Error: ', e);
        return;
    }
}

async function getAllObjects({ quadKeyParent1 }) {
    try {
        //kiểm tra xem có cây nào quá 30 ngày ko có nước và xóa đi (khác cây bitamin)
        //console.log("before deletedTree");
        db.Object.deleteMany({ "waterEndTime": { "$lte": new Date() } });
        //console.log("after deletedTree");
        //lấy danh sách cây có cùng quadKeyParent1
        let objs = await db.Object.find({
            deletedTree: false,
            quadKeyParent1: { $in: quadKeyParent1 },
            $or: [{"waterEndTime": { "$gte": new Date()}}, {"waterEndTime": null}], //cây chưa chết do thiếu nước hoặc là cây Bitamin
        }).select('bigTreeQuadKeys userId quadKey item itemId category waterStartTime waterEndTime createdDateWater createdDate').lean();
        //console.log('objs', objs);
        return objs;
    } catch (e) {
        console.log('Error: ', e);
        return [];
    }
}



//get all object by user id
async function getAllObjectsByUserId({ userId }) {
    try {
        //kiểm tra xem có cây nào quá 30 ngày ko có nước và xóa đi
        db.Object.deleteMany({ "waterEndTime": { "$lte": new Date() } });
        const selectFields = 'bigTreeQuadKeys userId quadKey item itemId category waterStartTime waterEndTime createdDateWater createdDate profitTotal nutritionalEndTime1 nutritionalEndTime2 limitUseNutritional';
        return db.Object.find({
            deletedTree: false,
            userId: ObjectId(userId),
            $or: [{"waterEndTime": { "$gte": new Date()}}, {waterEndTime: null}],  //cây chưa chết do thiếu nước hoặc là cây Bitamin
        })
        .populate('item','name_ko itemId')
        .select('bigTreeQuadKeys userId quadKey item itemId category waterStartTime waterEndTime createdDateWater createdDate profitTotal nutritionalEndTime1 nutritionalEndTime2 limitUseNutritional')
        .lean();
    } catch (e) {
        return [];
    }
}

//get all object by user id - group
async function getOnLandObjectsByUserId({ userId }) {
    try {
        const onLandObjects = await db.Object.find({ deletedTree: false, userId: ObjectId(userId) }).populate('item').lean();
        var grpOnLandObjects = groupBy(onLandObjects, 'itemId');
        var result = [];
        for (var olObject in grpOnLandObjects) {
            var grpTrees = grpOnLandObjects[olObject];
            result.push({
                itemId: olObject,
                itemDetail : grpTrees[0].item,
                trees : grpTrees.map(t => t._id),
                quantity : grpTrees.length
            });
        }
        return result;
    }

    catch (e) {
        return [];
    }
}

async function getDetailObject({ userId, objectId }) {
    try {
        var treeDetail = await db.Object.findOne({ userId: ObjectId(userId), _id: ObjectId(objectId) }).populate('item').select('-nid').lean();

        var profit = treeDetail.profit;
        for (let i = 1; i <= 4; i++) {
            var current = new Date();
            var nutritionalEndTime = new Date(treeDetail['nutritionalEndTime' + i.toString()]);
            if (treeDetail['profitNutritional' + i.toString()] !== 0 && nutritionalEndTime >= current) {
                profit += treeDetail['profitNutritional' + i.toString()];
            }
        }
        treeDetail.profitTotal = profit;
        return treeDetail;
    } catch (e) {
        return [];
    }
}

async function getObjectByQuadKey({ userId, cateId }) {
    try {
        const lands = await db.Land23.find({ categoryId: ObjectId(cateId), "user._id": ObjectId(userId) }).select("quadKey sellPrice name forSaleStatus categoryId").lean();
        const quadKeys = await db.Land23.distinct("quadKey", { categoryId: ObjectId(cateId), "user._id": ObjectId(userId) });
        const trees = await db.Object.find({ userId: ObjectId(userId), quadKey: { $in: quadKeys } });
        const landWithTree = lands.map(land => {
            land.tree = trees.find(tree => tree.quadKey === land.quadKey || (tree.bigTreeQuadKeys && tree.bigTreeQuadKeys.some(bigTree => bigTree === land.quadKey)));
            return land;
        })
        return { status: !!trees, landWithTree };
    } catch (e){
        console.log('Err: ', e);
        return { status: false, landWithTree: null };
    }
}

// (async () => {
//     const result = await getObjectByCategories({
//         userId: "5d5233e5a1d7c72568f179c5",
//         cateIds: [
//             ObjectId("5d52342983a7c12eac8f72e1")
//         ],
//         action: 'plant'
//     });
//     //console.log('result', result);
// })()


/**
 * getObjectByCategories '/game/object/getObjectByCategories'
 * @param  {String}     options.userId
 * @param  {Array}      options.cateIds array category (Ex: ["12345", "54321"])\
 * @param  {Array}      options.quadKeys array quadkeys (Ex: ["12345", "54321"])
 * @param  {String}     options.action  (plant, water, shovel, nutrient)
<<<<<<< HEAD
 + plant: plant tree
 + water: water tree
 + shovel: shovel tree
 + nutrient: nutrient treeob
=======
                        + plant: plant tree
                        + water: water tree
                        + shovel: shovel tree
                        + nutrient: nutrient tree
>>>>>>> origin/Dev
 * @return {Object}     result = { status, landTrees }
 * @return {Boolean}    result.status
 * @return {Array}      result.landTrees
 */
async function getObjectByCategories({ userId, cateIds, quadKeys, action }) {
    //console.log('userId', typeof userId);
    //check exist
    if(!userId) return { status: false, err: 'noExistUserId' };
    if(!_.isArray(cateIds)) return { status: false, err: 'noExistCateIds' };
    if(!_.isArray(quadKeys)) return { status: false, err: 'noExistQuadKeys' };
    const actions = ["plant", "water", "shovel", "nutrient"];
    if(!actions.includes(action)) return { status: false, err: 'noExistAction' };

    try {
        if(action === "plant"){
            //find all land in categories
            const lands = await db.Land23.find({ "user._id": ObjectId(userId), $or: [{categoryId: { $in: cateIds }}, {quadKey: { $in: quadKeys }}] }).select("quadKey sellPrice name forSaleStatus categoryId");
            const allQuadKeys = lands.map(land => land.quadKey);
            const trees = await db.Object.find({ userId: ObjectId(userId), $or: [{quadKey: { $in: allQuadKeys }}, {bigTreeQuadKeys: { $elemMatch: { $in: allQuadKeys }}}] });
            //remove exist normal tree and bitamin tree
            const landWithoutTree = lands.filter(land => !trees.some(tree => tree.quadKey === land.quadKey || (tree.bigTreeQuadKeys && tree.bigTreeQuadKeys.includes(land.quadKey) )));
            if(_.isEmpty(landWithoutTree)) return { status: false, err: 'noTreeForPlant' };

            return { status: true, landTrees: landWithoutTree };
        } else if(action === "water" || action === "shovel"){
            const lands = await db.Land23.find({ "user._id": ObjectId(userId), $or: [{categoryId: { $in: cateIds }}, {quadKey: { $in: quadKeys }}] }).select("quadKey sellPrice name forSaleStatus categoryId");
            const allQuadKeys = lands.map(land => land.quadKey);
            const trees = await db.Object.find({
                userId: ObjectId(userId),
                quadKey: { $in: allQuadKeys },
                waterEndTime: { $gte: new Date() },
                bigTreeQuadKeys: null
            });

            const landWithTreeExceptBitamin = lands.reduce((total, land) => {
                const fTree = trees.find(tree => tree && tree.quadKey === land.quadKey && tree.deletedTree === false);
                if(fTree) total = total.concat(fTree);
                return total;
            }, []);
            if(_.isEmpty(landWithTreeExceptBitamin)) return { status: false, err: 'noTreeForWaterOrShovel' };

            console.log('landWithTreeExceptBitamin', landWithTreeExceptBitamin)
            //console.log('landWithTreeExceptBitamin', landWithTreeExceptBitamin.length);
            return { status: true, landTrees: landWithTreeExceptBitamin };
        } else if(action === "nutrient"){
            const lands = await db.Land23.find({ "user._id": ObjectId(userId), $or: [{categoryId: { $in: cateIds }}, {quadKey: { $in: quadKeys }}] }).select("quadKey sellPrice name forSaleStatus categoryId");
            const allQuadKeys = lands.map(land => land.quadKey);
            const trees = await db.Object.find({
                userId: ObjectId(userId),
                quadKey: { $in: allQuadKeys },
                waterEndTime: { $gte: new Date() },
                bigTreeQuadKeys : null,
                $or: [{ nutritionalEndTime1: { $lt: new Date()}}, { nutritionalEndTime2: { $lt: new Date()}}, {"nutritionalEndTime1": null }, {"nutritionalEndTime2": null }],
            });

            const landWithoutNutrient = lands.reduce((total, land) => {
                const fTree = trees.find(tree => tree && tree.quadKey === land.quadKey && tree.deletedTree === false);
                if(fTree) total = total.concat(fTree);
                return total;
            }, []);

            if(_.isEmpty(landWithoutNutrient)){
                const hasTreeExists = await db.Object.findOne({ userId: ObjectId(userId), quadKey: { $in: allQuadKeys }, waterEndTime: { $gte: new Date() }, bigTreeQuadKeys : null });
                if(hasTreeExists) return { status: false, err: 'enoughNutrient' }
                return { status: false, err: 'noTreeForNutrient' };
            }
            //console.log('landWithoutNutrient', landWithoutNutrient.length);
            return { status: true, landTrees: landWithoutNutrient };
        }
    } catch (e){
        console.log('Err: ', e);
        return { status: false, landTrees: null };
    }
}

