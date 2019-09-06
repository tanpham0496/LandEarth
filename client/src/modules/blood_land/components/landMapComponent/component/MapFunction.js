const MAX_TILE_LEVEL = 24;

export {
    validatePrice,
    convertFloatToLocalString,
    checkInCountry,
    calculatorLand,
    splitLand,
    landCanBuy, //land Info use
}

function validatePrice(price) {
    const MIN_PRICE = 0;
    const MAX_PRICE = 999999999;
    let pPrice = parseFloat(price);
    if (pPrice.toString().indexOf('.') !== -1) return false;
    return pPrice === 0 || (pPrice && pPrice >= MIN_PRICE && pPrice <= MAX_PRICE && pPrice.toString().length <= 12)
}

function convertFloatToLocalString(number) {
    return parseFloat(parseFloat(number).toFixed(2)).toLocaleString();
}

function checkInCountry({ latlng, openCountries }) {
    if(!openCountries || openCountries.length === 0) return false;
    return openCountries.some(limitMap => {
        if (latlng.lat >= limitMap.minLat && latlng.lat <= limitMap.maxLat && latlng.lng >= limitMap.minLng && latlng.lng <= limitMap.maxLng) {
            if (!limitMap.ranges) {
                return false;
            } else {
                return limitMap.ranges.some(range => latlng.lat >= range.lat[0] && latlng.lat <= range.lat[1] && latlng.lng >= range.lng[0] && latlng.lng <= range.lng[1]);
            }

        }
        return false;
    });
}

// function calculatorLand(level) {
//     return Math.pow(4, MAX_TILE_LEVEL - level);
// }

function splitLand(arr, quadKey) {
    while (arr[arr.length - 1].length < quadKey.length) {
        //remove
        let fIndex = arr.findIndex(qk => quadKey.indexOf(qk) === 0);
        let changeTile = arr.splice(fIndex, 1)[0];

        //split to 4
        let child = [changeTile + '0', changeTile + '1', changeTile + '2', changeTile + '3'];
        let iChild = child.findIndex(c => c === quadKey);
        if (iChild !== -1) {
            child.splice(iChild, 1);
        }
        arr = [...arr, ...child];
    }
    return arr;
}

// function splitLandLevel24(lands, defaultSellPrice, level = 24) {
//     let splitLand = [...lands];
//     while (splitLand.some(land => land.quadKey.length < level)) {
//         let fIndex = splitLand.findIndex(land => land.quadKey.length < level);
//         let changeLand = splitLand.splice(fIndex, 1)[0];
//         //let changeLand = splitLand.shift();
//         let allChild = [0, 1, 2, 3].map(number => {
//             let newChild = { ...changeLand };
//             newChild.quadKey = newChild.quadKey + number;
//             newChild.landCount = 1;
//             newChild.totalCount = 1;
//             newChild.sellPrice = newChild.sellPrice ? newChild.sellPrice : defaultSellPrice;
//             return newChild;
//         });
//         splitLand = splitLand.concat(allChild);
//     }
//     return splitLand;
// }

function calculatorLand(level) {
    return Math.pow(4, MAX_TILE_LEVEL - level);
}

function isLandCanBuy(land, myId) {
    if (land.waiting) {
        return false;
    }
    if (land.user) {
        if (land.user._id === myId) {
            return false;
        } else {
            if (land.forSaleStatus === false) {
                return false;
            }
        }
    } else if (land.purchased) {
        return false;
    }
    return true;
}

function arrLandCannotBuySome(arrLandCannotBuy, cLand) {
    return arrLandCannotBuy.some(cnb => cnb.quadKey.indexOf(cLand.quadKey) === 0)
}

function landCanBuy(selected, user, defaultSellPrice) {
    return selected && selected.reduce((arrBuyable, slTile) => {
        const arrLandCannotBuy = slTile && slTile.lands && slTile.lands.filter(land => {
            return !isLandCanBuy(land, user._id);
        }).sort((a, b) => {
            return b.quadKey.length - a.quadKey.length;
        });
        const [highLandCannotBuy] = arrLandCannotBuy.slice(-1);
        if (highLandCannotBuy && slTile.quadKey.indexOf(highLandCannotBuy.quadKey) === 0) { //cannot buy: slTile is child of highLandCannotBuy
        } else {
            const deepLandCannotBuy = arrLandCannotBuy[0];
            if (deepLandCannotBuy) {
                const childLand = splitLand([slTile.quadKey], deepLandCannotBuy.quadKey);
                //if(childLand){
                let arrChildLand = childLand.map(cLandQK => {
                    const landCount = calculatorLand(cLandQK.length);
                    let newChildLand = {
                        empty: true,
                        forbid: false,
                        user: null,
                        forSaleStatus: null,
                        sellPrice: defaultSellPrice,
                        landCount: landCount,
                        totalCount: landCount,
                        quadKey: cLandQK,
                    };
                    let fLand = slTile.lands ? slTile.lands.find(slLand => slLand.quadKey.indexOf(cLandQK) === 0) : false;
                    if (fLand) {
                        newChildLand = { ...fLand };
                        newChildLand.quadKey = cLandQK
                        newChildLand.landCount = landCount;
                        newChildLand.totalCount = landCount;
                        newChildLand.sellPrice = newChildLand.sellPrice ? landCount * newChildLand.sellPrice : landCount * defaultSellPrice;

                    }
                    return newChildLand;
                });
                const buyable = arrChildLand.filter(cLand => !arrLandCannotBuySome(arrLandCannotBuy, cLand));
                arrBuyable = arrBuyable.concat(buyable);
            } else {
                let lanCanBuy = slTile.lands.reduce((landCanBuy, land) => {
                    if (!arrLandCannotBuy.some(cnb => cnb.quadKey === land.quadKey)) {
                        landCanBuy.push(land);
                    }
                    return landCanBuy;
                }, []);

                arrBuyable = arrBuyable.concat(lanCanBuy);
            }
        }
        return arrBuyable;
    }, []);
}