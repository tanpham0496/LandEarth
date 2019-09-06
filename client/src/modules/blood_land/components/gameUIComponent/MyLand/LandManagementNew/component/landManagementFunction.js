import intersectionBy from "lodash.intersectionby";
import {alertPopupSellLand} from "../../../../common/Components/SellLand/component/alertPopup";


import _ from 'lodash';


export const onHandleCheckLandSelected = (param) => {
    const {...p} = param;

    const {...aS} = alertPopupSellLand;

    //Not have any selected
    if (!p.landList || !p.objectList) {
        p.addPopup({name: 'NoSelectedAlert'})
    } else {
        const landSelected = p.landList.filter(l => l.checked);
        const objectSelected = intersectionBy(p.objectList, landSelected, "quadKey");

        const allBigTreeQuadKey = p.myObjects ? (p.myObjects.reduce((totalQK, object) => object.bigTreeQuadKeys ? totalQK.concat(object.bigTreeQuadKeys) : totalQK, [])) : [];
        const BigTreeQuadKeys = [];
        for(let i= 0 ; i < allBigTreeQuadKey.length ; i++){
            BigTreeQuadKeys.push({quadKey: allBigTreeQuadKey[i]})
        }
        const objectSelectedCheckBigTree = _.differenceBy(objectSelected, BigTreeQuadKeys, 'quadKey');

        if (objectSelectedCheckBigTree.length === 0) {
            p.addPopup({name: 'NoSelectedAlert'})
        } else {
            if (p.type === "cultivation") {
                //for plant tree
                const FilterLandHaveForSaleStatus = objectSelected.filter(o => !o.forSaleStatus)
                if (FilterLandHaveForSaleStatus.length === 0) {
                    // console.log('dat dang ban khong trong cay duoc')
                    p.addPopup({name: 'PlantTreeOnForSaleLandAlert'})
                } else {
                    const FilterObjectNotHaveAnyTree = objectSelected.filter(o => !o.tree);
                    if (FilterObjectNotHaveAnyTree.length === 0) {
                        p.addPopup({name: 'ExistTreeAlert'})
                    } else {
                        p.addPopup({name: p.type});
                        return FilterObjectNotHaveAnyTree
                        // console.log('FilterObjectNotHaveAnyTree', FilterObjectNotHaveAnyTree)
                    }
                }
            }

            if (p.type === 'nutrition') {
                //for nutrition
                const FilterObjectNotHaveAnyTree = objectSelected.filter(o => o.tree);
                if (FilterObjectNotHaveAnyTree.length === 0) {
                    // console.log('Plant Tree First')
                    p.addPopup({name: 'PlantTreeBeforeNutrientAlert'});
                } else {
                    const FilterObjectAllBTamin = objectSelected.filter(o => o.tree && o.tree.bigTreeQuadKeys === null);
                    if (FilterObjectAllBTamin.length === 0) {
                        // console.log('BTamin Tree')
                        p.addPopup({name: 'LandHaveBTaminAlert'})
                    } else {
                        const FilterObjectCanUseNutrient = objectSelected.filter(o => o.tree && o.tree.bigTreeQuadKeys === null && o.tree.limitUseNutritional !== 0)
                        if (FilterObjectCanUseNutrient.length === 0) {
                            // console.log('limit nutrient')
                            p.addPopup({name: 'UseLimitedItemAlert'});
                        } else {
                            p.addPopup({name: p.type});
                            return FilterObjectCanUseNutrient
                        }
                    }
                }
            }

            if (p.type === 'shovel') {
                //for shovel
                const FilterObjectNotHaveAnyTree = objectSelected.filter(o => o.tree);
                if (FilterObjectNotHaveAnyTree.length === 0) {
                    // console.log('khong co cay nao')
                    p.addPopup({name: 'PlantTreeBeforeShovelAlert'});
                } else {
                    const FilterObjectCanUseShovel = objectSelected.filter(o => o.tree && o.tree.bigTreeQuadKeys === null);
                    if (FilterObjectCanUseShovel.length === 0) {
                        // console.log('khong su dung duoc item')
                        p.addPopup({name: 'LandHaveBTaminAlert'})
                    } else {
                        p.addPopup({name: p.type});
                        return FilterObjectCanUseShovel
                    }
                }
            }

            if (p.type === 'smallWater') {
                //For droplet
                const FilterObjectNotHaveAnyTree = objectSelected.filter(o => o.tree);
                if (FilterObjectNotHaveAnyTree.length === 0) {
                    // console.log('khong co cay nao')
                    p.addPopup({name: 'PlantTreeBeforeDropletAlert'});
                } else {
                    const FilterObjectCanUseWater = objectSelected.filter(o => o.tree && o.tree.bigTreeQuadKeys === null);
                    if (FilterObjectCanUseWater.length === 0) {
                        p.addPopup({name: 'LandHaveBTaminAlert'})
                    } else {
                        p.addPopup({name: p.type});
                        return FilterObjectCanUseWater
                    }

                }
            }

            if (p.type === 'sellLand') {

                const FilterLandHaveForSaleStatus = objectSelected.filter(o => !o.forSaleStatus)
                if (FilterLandHaveForSaleStatus.length === 0) {
                    p.onHandleShowPopup(aS.landAlreadySell)
                } else {

                    const FilterObjectCanSell = objectSelected.filter(o => !o.forSaleStatus && (!o.tree || (o.tree && o.tree.bigTreeQuadKeys === null)));
                    if (FilterObjectCanSell.length === 0) {
                        p.onHandleShowPopup(aS.getCannotSellLandAlertPopup)
                    } else {
                        p.addPopup({name: p.type});
                        // console.log('FilterObjectCanSell', FilterObjectCanSell)
                        return FilterObjectCanSell;
                    }
                }
            }

            if (p.type === 'moveLand') {
                p.addPopup({name: p.type});
                return objectSelected;
            }
        }
    }
};




export const checkMoveLand = (landSelectedMove, categories, categorySelected, categoryId, addPopup) => {

    if (landSelectedMove.length === 0) {
        // console.log('Chon dat')
            addPopup({name: 'NoSelectedAlert'})
    } else {
        if (!categorySelected || categorySelected === '') {
            addPopup({name: 'NotCategorySelectedAlert'})
        } else {
            if (categoryId === categorySelected._id) {

            } else {
                if (landSelectedMove.length + categorySelected.landCount > 500) {
                    // console.log('qua so luong')
                    addPopup({name: 'MaxAmountLandAlert'})
                } else {
                    addPopup({name: 'MoveLandConfirmAlert'})
                    return landSelectedMove;
                }
            }
        }
    }
    // }
};
