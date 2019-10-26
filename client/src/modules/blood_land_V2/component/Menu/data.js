import {loadingImage} from "../../../blood_land/components/general/System";

export const MenuList = [
    {
        name: 'myWallet',
        type: 'right',
        imageUrl: '/images/bloodLandNew/myWallet.png',
        timeDelayOpen: 0,
        timeDelayClose: 0.9
    }, {
        name: 'shop',
        type: 'right',
        imageUrl: '/images/bloodLandNew/shop.png',
        timeDelayOpen: 0.05,
        timeDelayClose: 0.8
    }, {
        name: 'wareHouse',
        type: 'right',
        imageUrl: '/images/bloodLandNew/wareHouse.png',
        timeDelayOpen: 0.1,
        timeDelayClose: 0.7
    }, {
        name: 'game',
        type: 'right',
        imageUrl: '/images/bloodLandNew/game.png',
        timeDelayOpen: 0.15,
        timeDelayClose: 0.6
    },{
        name: 'setting',
        type: 'right',
        imageUrl: '/images/bloodLandNew/setting.png',
        timeDelayOpen: 0.2,
        timeDelayClose: 0.5
    },

    {
        name: 'myAccount',
        type: 'left',
        imageUrl: '/images/bloodLandNew/character.png',
        timeDelayOpen: 0.25,
        timeDelayClose: 0.4
    }, {
        name: 'myLand',
        type: 'left',
        imageUrl: '/images/bloodLandNew/myLand.png',
        timeDelayOpen: 0.3,
        timeDelayClose: 0.3
    }, {
        name: 'advertisement',
        type: 'left',
        imageUrl: '/images/bloodLandNew/advertisement.png',
        timeDelayOpen: 0.35,
        timeDelayClose: 0.2
    }, {
        name: 'historyLand',
        type: 'left',
        imageUrl: '/images/bloodLandNew/historyLand.png',
        timeDelayOpen: 0.4,
        timeDelayClose: 0.1
    }, {
        name: 'searching',
        type: 'left',
        imageUrl: '/images/bloodLandNew/searching.png',
        timeDelayOpen: 0.45,
        timeDelayClose: 0
    }
];
export const IconTabList = [
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
