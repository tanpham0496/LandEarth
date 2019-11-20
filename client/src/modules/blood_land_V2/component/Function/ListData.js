const MenuListLeftMap = [
    {
        tab : '1',
        imageUrl : '/images/bloodLandNew/func/Individual-Select.png',
        name : 'Individual-Select',
        mode : 'single',
        timeDelayOpen: 0.1,
        timeDelayClose: 1.1
    },
    {
        tab : '2',
        imageUrl : '/images/bloodLandNew/func/Area-select.png',
        name : 'Area-select',
        mode : 'multiple',
        timeDelayOpen: 0.25,
        timeDelayClose: 0.95
    },
    {
        tab : '3',
        imageUrl : '/images/bloodLandNew/func/Clear-Select.png',
        imageUrlHover: '/images/bloodLandNew/func/Clear-Select-hover.png',
        name : 'Clear-Select',
        mode : 'Clear',
        timeDelayOpen: 0.45,
        timeDelayClose: 0.8
    },
    {
        tab : '4',
        imageUrl : '/images/bloodLandNew/func/Notify.png',
        imageUrlHover : '/images/bloodLandNew/func/Notify-hover.png',
        name : 'Notify',
        mode : 'Notify',
        type : 'NotificationBlood',
        timeDelayOpen: 0.65,
        timeDelayClose: 0.65
    },
    {
        tab : '5',
        imageUrl : '/images/bloodLandNew/func/icon-region-1.png',
        imageUrlHover : '/images/bloodLandNew/func/icon-region-hover-1.png',
        imageRaffle : '/images/bloodLandNew/func/icon-raffle.png',
        name : 'choose64',
        type : 'choose64',
        mode : 'choose64',
        childrenTab : [
            {
              tab : '1',
              nameChild : 1,
              imageChild : '/images/bloodLandNew/func/icon-region-1.png'
            },
            {
                tab : '2',
                nameChild : 4,
                imageChild : '/images/bloodLandNew/func/icon-region-4.png'
            },
            {
                tab : '3',
                nameChild : 16,
                imageChild : '/images/bloodLandNew/func/icon-region-16.png'
            },
            {
                tab : '4',
                nameChild : 64,
                imageChild : '/images/bloodLandNew/func/icon-region-64.png'
            },
            // {
            //     tab : '5',
            //     nameChild : 128,
            //     imageChild : '/images/bloodLandNew/func/icon-region-128.png'
            // },
            {
                tab : '6',
                nameChild : 256,
                imageChild : '/images/bloodLandNew/func/icon-region-256.png'
            }
        ],
        timeDelayOpen: 0.85,
        timeDelayClose: 0.5
    },
    {
        tab : '6',
        name : 'SPECIAL-LAND',
        type: 'SPECIAL-LAND',
        mode : 'SPECIAL-LAND',
        imageUrl : '/images/bloodLandNew/func/icon-segment.png',
        imageUrlHover : '/images/bloodLandNew/func/icon-segment-hover.png',
        imageRaffle : '/images/bloodLandNew/func/icon-raffle.png',
        childrenTab : [
            {
                tab : '1',
                nameChild : 'one',
                imageUrl : '/images/bloodLandNew/func/icon-region-child-1.png',
            },
            {
                tab : '2',
                nameChild : 'plus',
                imageUrl : '/images/bloodLandNew/func/icon-region-child-2.png',
            },
            {
                tab : '3',
                nameChild : 'three',
                imageUrl : '/images/bloodLandNew/func/icon-region-child-3.png',
            },
            {
                tab : '4',
                nameChild : 'equal',
                imageUrl : '/images/bloodLandNew/func/icon-region-child-equal.png',
            },
            {
                tab : '5',
                nameChild : 'B',
                imageUrl : '/images/bloodLandNew/func/icon-region-child-B.png',
            }
        ],
        timeDelayOpen: 1.05,
        timeDelayClose: 0.35
    },
    {
        tab : '7',
        imageUrl : '/images/bloodLandNew/func/icon-land-mode.png',
        imageUrlMode : '/images/bloodLandNew/func/Mode.svg',
        imageRaffle : '/images/bloodLandNew/func/icon-raffle.png',
        name : 'ThreeMode',
        type : 'ThreeMode',
        mode : 'ThreeMode',
        timeDelayOpen: 1.25,
        timeDelayClose: 0.15,
        childrenTab : [
            {
                tab : '1',
                nameChild : 'LAND',
                imageUrl : '/images/bloodLandNew/func/icon-land-mode.png',
            },
            {
                tab : '2',
                nameChild : 'GAME',
                imageUrl : '/images/bloodLandNew/func/icon-game-mode.png',
            },
            {
                tab : '3',
                nameChild : 'ADVERTISEMENT',
                imageUrl : '/images/bloodLandNew/func/icon-advertise-mode.png',
            }
        ],
    },
    // {
    //     tab : '7',
    //     imageUrl : '/images/bloodLandNew/func/Advertisement.png',
    //     imageUrlHover : '/images/bloodLandNew/func/Advertisement-hover.png',
    //     name : 'Advertisement',
    //     type : 'Advertisement',
    //     mode : 'advertisement',
    //     timeDelayOpen: 1.25,
    //     timeDelayClose: 0.15
    // },
    // {
    //     tab : '8',
    //     imageUrl : '/images/bloodLandNew/func/select-land.png',
    //     imageUrlHover : '/images/bloodLandNew/func/select-land-hover.png',
    //     name : 'selectLand',
    //     type : 'selectLand',
    //     mode : 'land',
    //     timeDelayOpen: 1.45,
    //     timeDelayClose: 0
    // }
];

module.exports = {
    MenuListLeftMap
}