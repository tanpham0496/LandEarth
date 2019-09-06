function createPercentArray(arrPercent, percentProperty){
    return arrPercent.reduce((arrayPercent, aType, key) => arrayPercent.concat(Array(aType[percentProperty]).fill(key)), []);
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function random(min, max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

module.exports = {
    createPercentArray,
    shuffle,
    random,
};
