import {loadingImage} from "../../../blood_land/components/general/System";
import {TranslateLanguage} from "../../../../helpers/importModule";
import React from "react";

const MenuList = [
    {
        name: 'myWallet',
        type: 'right',
        imageUrl: '/images/bloodLandNew/myWallet.png',
        tooltip: <TranslateLanguage direct={'MenuTabLeft.myWallet'}/>,
        timeDelayOpen: 0.25,
        timeDelayClose: 0.4
    }, {
        name: 'shop',
        type: 'right',
        imageUrl: '/images/bloodLandNew/shop.png',
        tooltip: <TranslateLanguage direct={'MenuTabLeft.shop'}/>,
        timeDelayOpen: 0.3,
        timeDelayClose: 0.3
    }, {
        name: 'wareHouse',
        type: 'right',
        imageUrl: '/images/bloodLandNew/wareHouse.png',
        tooltip: <TranslateLanguage direct={'MenuTabLeft.wareHouse'}/>,
        timeDelayOpen: 0.35,
        timeDelayClose: 0.2
    }, {
        name: 'game',
        type: 'right',
        imageUrl: '/images/bloodLandNew/game.png',
        tooltip: <TranslateLanguage direct={'MenuTabLeft.game'}/>,
        timeDelayOpen: 0.4,
        timeDelayClose: 0.1
    },{
        name: 'setting',
        type: 'right',
        imageUrl: '/images/bloodLandNew/setting.png',
        tooltip: <TranslateLanguage direct={'MenuTabLeft.setting'}/>,
        timeDelayOpen: 0.45,
        timeDelayClose: 0
    },

    {
        name: 'myAccount',
        type: 'left',
        imageUrl: '/images/bloodLandNew/character.png',
        tooltip: <TranslateLanguage direct={'MenuTabLeft.myAccount'}/>,
        timeDelayOpen: 0,
        timeDelayClose: 0.9
    }, {
        name: 'myLand',
        type: 'left',
        imageUrl: '/images/bloodLandNew/myLand.png',
        tooltip: <TranslateLanguage direct={'MenuTabLeft.myLand'}/>,
        timeDelayOpen: 0.05,
        timeDelayClose: 0.8
    }, {
        name: 'advertisement',
        type: 'left',
        imageUrl: '/images/bloodLandNew/advertisement.png',
        tooltip: <TranslateLanguage direct={'MenuTabLeft.advertisement'}/>,
        timeDelayOpen: 0.1,
        timeDelayClose: 0.7
    }, {
        name: 'historyLand',
        type: 'left',
        imageUrl: '/images/bloodLandNew/historyLand.png',
        tooltip: <TranslateLanguage direct={'MenuTabLeft.historyLand'}/>,
        timeDelayOpen: 0.15,
        timeDelayClose: 0.6
    }, {
        name: 'searching',
        type: 'left',
        imageUrl: '/images/bloodLandNew/searching.png',
        tooltip: <TranslateLanguage direct={'MenuTabLeft.searching'}/>,
        timeDelayOpen: 0.2,
        timeDelayClose: 0.5
    }
];
const IconTabListMyAccount = [
    {
        name: 'information',
        imageUrl: loadingImage('/images/bloodLandNew/information.png'),
        imageUrlActive: loadingImage('/images/bloodLandNew/informationHover.png'),
        tabIndex: 1
    }, {
        name: 'friend',
        imageUrl: loadingImage('/images/bloodLandNew/friend.png'),
        imageUrlActive: loadingImage('/images/bloodLandNew/friendHover.png'),
        tabIndex: 2,
        childrenTab: [
            {
                name: 'addFriend',
                imageUrl: loadingImage('/images/bloodLandNew/addFriend.png'),
                imageUrlActive: loadingImage('/images/bloodLandNew/addFriendHover.png'),
                tabParent: 2,
            }, {
                name: 'friendList',
                imageUrl: loadingImage('/images/bloodLandNew/friendList.png'),
                imageUrlActive: loadingImage('/images/bloodLandNew/friendListHover.png'),
                tabParent: 2,
            }, {
                name: 'blockFriend',
                imageUrl: loadingImage('/images/bloodLandNew/blockFriend.png'),
                imageUrlActive: loadingImage('/images/bloodLandNew/blockFriendHover.png'),
                tabParent: 2,
            }
        ]
    }, {
        name: 'mail',
        imageUrl: loadingImage('/images/bloodLandNew/mail.png'),
        imageUrlActive: loadingImage('/images/bloodLandNew/mailHover.png'),
        tabIndex: 3,
        childrenTab: [
            {
                name: 'receiveMail',
                imageUrl: loadingImage('/images/bloodLandNew/mail/receive-mail.png'),
                imageUrlActive: loadingImage('/images/bloodLandNew/mail/receive-mail-hover.png'),
                tabParent: 3,
            }, {
                name: 'sendMail',
                imageUrl: loadingImage('/images/bloodLandNew/mail/send-mail.png'),
                imageUrlActive: loadingImage('/images/bloodLandNew/mail/send-mail-hover.png'),
                tabParent: 3,
            }
        ]
    },

];
const IconTabListMyLand = [
    {
        name: 'Reserve',
        imageUrl: loadingImage('/images/bloodLandNew/reserve.png'),
        imageUrlActive: loadingImage('/images/bloodLandNew/reserve-hover.png'),
        tabIndex: 1
    }, {
        name: 'LandForSale',
        imageUrl: loadingImage('/images/bloodLandNew/LandForSale.png'),
        imageUrlActive: loadingImage('/images/bloodLandNew/LandForSale-hover.png'),
        tabIndex: 2
    }, {
        name: 'RegisteredLand',
        imageUrl: loadingImage('/images/bloodLandNew/RegisteredLand.png'),
        imageUrlActive: loadingImage('/images/bloodLandNew/RegisteredLand-hover.png'),
        tabIndex: 3
    },

];
const btnActionMyLand = [
    {
        tab : '1',
        imageUrl : '/images/bloodLandNew/myLand/icon-folderMyLand.png',
        name: <TranslateLanguage direct={'menuTab.myLand.landOwned.addFolder'}/> ,
        lineSpace : 'line-height',
        type : 'CreateNewCategory'
    },
    {
        tab : '2',
        imageUrl : '/images/bloodLandNew/myLand/icon-sell.png',
        name: <TranslateLanguage direct={'menuTab.myLand.landOwned.sellLand'}/>,
        lineSpace : 'line-height',
        type : 'SellLand'
    },
    {
        tab : '3',
        imageUrl : '/images/bloodLandNew/myLand/icon-remove.png',
        name: <TranslateLanguage direct={'menuTab.myLand.landOwned.recycle'}/>,
        type : 'DeleteFolderMyLand'
    }
];
const btnActionLandForSale = [
    {
        tab : '1',
        imageUrl : '/images/bloodLandNew/myLand/icon-Modify.png',
        name: <TranslateLanguage direct={'menuTab.myLand.landSold.MyLandsCounter.editLandSellButton'}/>,
        lineSpace : 'line-height',
        type : 'EditLandSell'
    },
    {
        tab : '2',
        imageUrl : '/images/bloodLandNew/myLand/icon-sell.png',
        name: <TranslateLanguage direct={'menuTab.myLand.landSold.MyLandsCounter.removeSellLandButton'}/>,
        type : 'RemoveSellLand'
    }
];
export {
    MenuList,
    IconTabListMyAccount,
    IconTabListMyLand,
    btnActionMyLand,
    btnActionLandForSale
}

