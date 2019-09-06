export const CheckAmountForAllTreeUpdateSimulateFunction = (param) => {
    const {
        allTreesClone , normalCount,whiteCount,
        greenCount,blueCount,bronzeCount,
        silverCount,goldCount,platinumCount,diamondCount
    } = param;
    return allTreesClone.map(t => {
        if (normalCount && t.tree.itemId === 'T01') {
            t.usingAmount = normalCount;
            t.remainAmount = t.maxAmount - t.usingAmount
        } else if (whiteCount && t.tree.itemId === 'T02') {
            t.usingAmount = whiteCount;
            t.remainAmount = t.maxAmount - t.usingAmount
        } else if (greenCount && t.tree.itemId === 'T03') {
            t.usingAmount = greenCount;
            t.remainAmount = t.maxAmount - t.usingAmount
        } else if (blueCount && t.tree.itemId === 'T04') {
            t.usingAmount = blueCount;
            t.remainAmount = t.maxAmount - t.usingAmount
        } else if (bronzeCount && t.tree.itemId === 'T05') {
            t.usingAmount = bronzeCount;
            t.remainAmount = t.maxAmount - t.usingAmount
        } else if (silverCount && t.tree.itemId === 'T06') {
            t.usingAmount = silverCount;
            t.remainAmount = t.maxAmount - t.usingAmount
        } else if (goldCount && t.tree.itemId === 'T07') {
            t.usingAmount = goldCount;
            t.remainAmount = t.maxAmount - t.usingAmount
        } else if (platinumCount && t.tree.itemId === 'T08') {
            t.usingAmount = platinumCount;
            t.remainAmount = t.maxAmount - t.usingAmount
        } else if (diamondCount && t.tree.itemId === 'T09') {
            t.usingAmount = diamondCount;
            t.remainAmount = t.maxAmount - t.usingAmount
        } else {
            t.usingAmount = 0;
            t.remainAmount = t.maxAmount - t.usingAmount
        }
        return t
    })

};

//counting amount of tree => new All Trees
export const CheckAmountForAllTreeUpdateComponentDidUpdate = (param) => {
    const {allTrees, normalCount, whiteCount,
        greenCount, blueCount, bronzeCount, silverCount, goldCount, platinumCount, diamondCount
    } = param;

    return  allTrees.map(object => {
        if (object.tree.itemId === 'T01' ) {
            object.usingAmount = normalCount ? normalCount : 0;
            object.remainAmount = object.maxAmount - object.usingAmount
        } else if (object.tree.itemId === 'T02' ) {
            object.usingAmount = whiteCount ? whiteCount : 0;
            object.remainAmount = object.maxAmount - object.usingAmount
        } else if (object.tree.itemId === 'T03') {
            object.usingAmount = greenCount ? greenCount : 0;
            object.remainAmount = object.maxAmount - object.usingAmount
        } else if (object.tree.itemId === 'T04' ) {
            object.usingAmount = blueCount ? blueCount : 0;
            object.remainAmount = object.maxAmount - object.usingAmount
        } else if (object.tree.itemId === 'T05' ) {
            object.usingAmount = bronzeCount ? bronzeCount : 0;
            object.remainAmount = object.maxAmount - object.usingAmount
        } else if (object.tree.itemId === 'T06') {
            object.usingAmount = silverCount ? silverCount : 0;
            object.remainAmount = object.maxAmount - object.usingAmount
        } else if (object.tree.itemId === 'T07') {
            object.usingAmount = goldCount ? goldCount : 0;
            object.remainAmount = object.maxAmount - object.usingAmount
        } else if (object.tree.itemId === 'T08' ) {
            object.usingAmount = platinumCount ? platinumCount : 0;
            object.remainAmount = object.maxAmount - object.usingAmount
        } else if (object.tree.itemId === 'T09' ) {
            object.usingAmount = diamondCount ? diamondCount : 0;
            object.remainAmount = object.maxAmount - object.usingAmount
        } else {
            object.remainAmount = object.maxAmount - object.usingAmount
        }
        return object
    })
};