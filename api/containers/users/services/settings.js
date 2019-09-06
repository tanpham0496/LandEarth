const db = require('../../../db/db');
const UserSetting = db.UserSetting;
const ObjectId = require('mongoose').Types.ObjectId;
const isNull = require('lodash.isnull');
const isEmpty = require('lodash.isempty');
const ipCountry = require('ip-country');
const _ = require('lodash');

module.exports = {
    get,
    set,
    setLandShowInfo,
    setBgMusic,
    setEffMusic,
    setLanguage,
    setTodayLandInfo,
    setLandsPerCellInfo,
};

ipCountry.init({
    fallbackCountry: 'KR',
    exposeInfo: false
});

const getLanguageCode = (ipAddress) => {
    const country = ipCountry.country(ipAddress);
    // console.log("country",country);
    let langCode = "kr";
    if(country === "VN") langCode = "vi";
    if(country === "US" || country === "GB") langCode = "en";
    if(country === "CN") langCode = "cn";
    if(country === "ID") langCode = "in";
    if(country === "KR" || country === "KP") langCode = "kr";
    if(country === "TH") langCode = "th";
    return langCode;
}

async function get(param, ip) {
    const langCode = getLanguageCode(ip);
    try{
        let userId = new ObjectId(param.userId);
        const userSetting = await UserSetting.findOne({ "userId": userId }).select("-_id -__v").lean();
        // console.log("userSetting",userSetting);
        if (isNull(userSetting)) {
            const newUserSetting = await db.UserSetting.create({
                userId,
                language: langCode,
                land: { showInfo: false },
                bgMusic: { turnOn: false, volume: 30 },
                effMusic: { turnOn: false, volume: 100 }
            });

            //console.log('newUserSetting', newUserSetting);
            return newUserSetting;
        }

        if(!userSetting.language || isEmpty(userSetting.language)){
            const language = await setLanguage({ language: langCode, userId: param.userId });
            userSetting.language = language;
        }

        //fist time set new setting
        if(!_.isBoolean(userSetting.todayLandInfo)){
            const settingUpdate = await setTodayLandInfo({ userId, todayLandInfo: true  });
            userSetting.todayLandInfo = settingUpdate.status ? settingUpdate.todayLandInfo : true;
        }

        //
        if(!_.isBoolean(userSetting.landsPerCellInfo)){
            const settingUpdate = await setLandsPerCellInfo({ userId, landsPerCellInfo: true });
            userSetting.landsPerCellInfo = settingUpdate.status ? settingUpdate.landsPerCellInfo : true;
        }
        //console.log('userSetting', userSetting);
        return userSetting;
    } catch(err){
        console.log("Err: ",err)
        return {
            land: { showInfo: false },
            bgMusic: { turnOn: false, volume: 30 },
            effMusic: { turnOn: false, volume: 100 },
            language: langCode
        }
    }
}

async function set(param,ip) {
    const langCode = getLanguageCode(ip);
    try{
        const userSetting = await UserSetting.findOneAndUpdate(
            {
                userId: ObjectId(param.userId)
            },
            {
                $set: { "effMusic": param.effMusic, "bgMusic": param.bgMusic, "land": param.land, "language": param.language }
            },
            { new: true });
        let land = userSetting && (userSetting.land) ? userSetting.land : { showInfo: false };
        let bgMusic = userSetting && (userSetting.bgMusic) ? userSetting.bgMusic :  { turnOn: false, volume: 30 };
        let effMusic = userSetting && (userSetting.effMusic) ? userSetting.effMusic : { turnOn: false, volume: 100 };
        let language = userSetting.language ? userSetting.language : langCode;
        return {
            land,
            bgMusic,
            effMusic,
            language
        }
    }catch(err){
        console.log("err: ",err)
        return {
            land: { showInfo: false },
            bgMusic: { turnOn: false, volume: 30 },
            effMusic: { turnOn: false, volume: 100 },
            language: langCode
        }
    }
}

async function setLandShowInfo(param) {
    let userId = new ObjectId(param.userId);
    const userSetting = await UserSetting.findOneAndUpdate({ userId: userId }, { $set: { "land": param.land } }, { new: true });
    let land = userSetting && (userSetting.land) ? userSetting.land : [];
    return {
        land
    }
}

async function setBgMusic(param) {
    let userId = new ObjectId(param.userId);
    const userSetting = await UserSetting.findOneAndUpdate({ userId: userId }, { $set: { "bgMusic": param.bgMusic } }, { new: true });

    let bgMusic = userSetting && userSetting.bgMusic ? userSetting.bgMusic : [];
    return {
        bgMusic
    }
}

async function setEffMusic(param) {
    let userId = new ObjectId(param.userId);
    const userSetting = await UserSetting.findOneAndUpdate({ userId: userId }, { $set: { "effMusic": param.effMusic } }, { new: true });
    let effMusic = userSetting && (userSetting.effMusic) ? userSetting.effMusic : [];
    return {
        effMusic
    }
}

async function setLanguage(param) {
    let userId = new ObjectId(param.userId);
    const userSetting = await UserSetting.findOneAndUpdate({ userId: userId }, { $set: { "language": param.language } }, { new: true }).lean();
    return userSetting.language;
}

async function setTodayLandInfo({ userId, todayLandInfo }) {
    //console.log('{ userId, todayLandInfo }', { userId, todayLandInfo });
    try{
        if(!userId) return { status: false, error: "noUserId" }
        if(!_.isBoolean(todayLandInfo)) return { status: false, error: "noTodayLandInfo" }
        const userSetting = await db.UserSetting.findOneAndUpdate({ userId }, { $set: { todayLandInfo } }, { new: true });
        if(!userSetting) return { status: false, error: "cannotSetTodayLandInfo" }
        return { status: true, todayLandInfo: userSetting.todayLandInfo };
    } catch(e){
        console.log('Err', e);
    }
}

async function setLandsPerCellInfo({ userId, landsPerCellInfo }) {
    try{
        if(!userId) return { status: false, error: "noUserId" }
        if(!_.isBoolean(landsPerCellInfo)) return { status: false, error: "noLandsPerCellInfo" }
        const userSetting = await db.UserSetting.findOneAndUpdate({ userId }, { $set: { landsPerCellInfo } }, { new: true });
        if(!userSetting) return { status: false, error: "cannotSetLandsPerCellInfo" }
        return { status: true, landsPerCellInfo: userSetting.landsPerCellInfo }
    } catch(e){
        console.log('Err', e);
    }
}

