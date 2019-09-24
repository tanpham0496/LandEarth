import React, { PureComponent , Fragment} from 'react';
import has from "lodash.has";
import connect from "react-redux/es/connect/connect";
import {
    landActions, mapActions,
    loadingImage,
    TranslateLanguage, screenActions,
} from '../../../../../helpers/importModule'
import {toggleLandIcon} from "../component/asset";
import {getCertificateAlertPopup, landCertificationPopup} from "../component/LandMapAlert";
import { newVersionUI } from '../../../../../helpers/config';

const MIN_ZOOM_SELECTED_TILE = 18;
class TileComponent extends PureComponent {
    state = {};

    constructor(props) {
        super(props);
        this.state = {
            toolTipDisplay: false,
            top: 0
        }
    }

    createClassLandLower22 = (props) => {
        let cls = "";
        if (props.tile && props.tile.forbid) {
            cls += ' forbid';
        }
        const {tile: {canBuy, canNotBuy, totalCount, landmarkCount = 0, selected}, mainMap} = props;
        if (landmarkCount * 2 >= totalCount) {
            cls += ' landmark';
        } else {
            if (!has(props.tile, 'canBuy') || canBuy === totalCount) {
                cls += '';
            } else if (canNotBuy === totalCount) {
                cls += ' noSell';
            } else {
                cls += ' partial';
            }
        }
        //console.log('mainMap', mainMap);
        if(newVersionUI && mainMap.zoom >= MIN_ZOOM_SELECTED_TILE) cls += selected ? " selected" : "";

        return cls;
    }

    createClassLand = (props, {canBuy}) => {
        const {tile, tile: {lands, selected}, user} = props;
        let clsName = "";
        clsName += lands.reduce((clsName, land) => {
            if (land.user) {
                if (land.forbid) { //forbid by Admin
                    if (land.landmark) {
                        if (clsName.indexOf(' landmark') === -1) clsName += ' landmark';
                    } else {
                        if (clsName.indexOf(' forbid') === -1) clsName += ' forbid';
                    }
                } else {
                    if (land.user._id === user._id) { //is MyLand
                        if (land.forSaleStatus === true) {
                            if (clsName.indexOf(' myLand myForSell') === -1) clsName += ' myLand myForSell';
                        } else {
                            if (clsName.indexOf(' myLand') === -1) clsName += ' myLand';
                        }
                    } else { //is other user
                        if (land.landmark) {
                            if (clsName.indexOf(' landmark') === -1) clsName += ' landmark';
                        }

                        if (land.forSaleStatus === true) {
                            if (clsName.indexOf(' forSell') === -1) clsName += ' forSell';
                        } else {
                            if (clsName.indexOf(' noSell') === -1) clsName += ' noSell';
                        }
                    }
                }
            } else { //forbid Area
                if (land.forbid) {
                    if (clsName.indexOf(' forbid') === -1) clsName += ' forbid';
                }
            }
            return clsName;
        }, '');

        if (canBuy > 0) {
            clsName = clsName.replace(/ myLand| noSell| forbid| partial/g, ' partial');
        }

        if (tile.waiting) {
            clsName += ' waiting';
        } else {
            if (clsName.indexOf(' forbid') !== -1) { //when has forbid land => disable selected
                clsName = clsName.replace(' selected', '');
            } else {
                clsName += selected ? " selected" : "";
            }
        }
        clsName += tile.isCenter ? ' center' : "";
        return clsName;
    };

    // tren tang 18
    createInfoLandLowerLv23(props) {
        const {tile: {totalCount, canBuy, canNotBuy, landmarkCount = 0}, settings} = props;
        let infoHtml = '';
        const {land} = settings;
        if (land && land.showInfo) {
            infoHtml = has(props.tile, 'canBuy') ? (
                <div className='cell'>
                    <div>
                        <div className='cell-info' onMouseOver={() => this.setState({toolTipDisplay: true})}
                             onMouseLeave={() => this.setState({toolTipDisplay: false})}>
                            <span className='can-buy'>{canNotBuy > totalCount ? totalCount : canNotBuy} /&nbsp; </span>
                            <span className='total-count'>{totalCount}</span>
                            {
                                // this.state.toolTipDisplay
                                // &&
                                // <span className="tooltiptext">
                                //     <div>
                                //         <div><TranslateLanguage direct={'land.tooltip.total'}/>: {totalCount}</div>
                                //         <div><TranslateLanguage direct={'land.tooltip.landmarkCount'}/>: {landmarkCount > totalCount ? totalCount : landmarkCount}</div>
                                //         <div><TranslateLanguage direct={'land.tooltip.canBuy'}/>: {canBuy < 0 ? 0 : canBuy} </div>
                                //         <div><TranslateLanguage direct={'land.tooltip.canNotBuy'}/>: {canNotBuy > totalCount ? totalCount : canNotBuy} </div>
                                //     </div>
                                // </span>
                            }
                        </div>
                    </div>
                </div>
            ) : ''
        }
        return infoHtml;
    }


    onHandleShowLandCertificate = () => {
        //console.log('onHandleShowLandCertificate')
        const {tile: {quadKey}} = this.props;
        this.props.getLandInfo(quadKey);
        this.props.removePopup({name : "ContextMenu"});
        this.setState({
            isOpenLandCertificate: true
        });
    };
    onHandleHideLandCertificate = () => {
        this.onHandleMouseLeave();
        this.props.setMultiSelectStart();
        this.setState({
            isOpenLandCertificate: false

        });
    };

    onHandleShowCertificateImage = () => {
        this.setState({
            isOpenCertificateImage: true
        })
    };
    onHandleHideCertificateImage = () => {
        this.setState({
            isOpenCertificateImage: false,
            toggleCertification: false
        })
    };
    onHandleMouseOver = (tile) => {
        const {lands} = tile;
        if (lands && lands[0] && lands[0].user !== null ) {
            if (lands[0].forbid === false && lands[0].landmark === false) {
                this.setState({
                    toggleCertification: true
                });

            }
        }
        //  add popup Totalselected and totalBlood
        if(newVersionUI && tile && tile.selected ){
            this.props.addPopup({name : "showTotalBlood"});
        }

    };
    onHandleMouseLeave = (tile) => {
        this.setState({toggleCertification: false})
        if(newVersionUI && tile && tile.selected) {
            this.props.removePopup( {name: "showTotalBlood"} )
        }
    };

    tileRightMouseClick = (e) => {
        const {selected} = this.props.map;
        if(selected && selected.some(sl => sl.quadKey === this.props.tile.quadKey && this.props.tile) ) {
            this.props.addPopup({ name: "ContextMenu" });
        }
        else{
            this.props.removePopup({ name: "ContextMenu" });
        }
    }

    tileLeftMouseClick(e, tile){
        this.props.tileClick(tile);
    }

    createClassAndInfo(){
        const { mainMap/*, map: { zoom }*/, lands, user, tile: { totalCount } } = this.props;
        let clsName = '';
        let infoHtml = '';
        if (mainMap.zoom !== 22) {
            infoHtml = this.createInfoLandLowerLv23(this.props);
            clsName = this.createClassLandLower22(this.props);
        } else {
            let otherLand = lands && lands.length > 0 && lands.reduce((otherLand, land) => {
                if (land.user) {
                    if (land.user._id === user._id)
                        otherLand.myLand += land.landCount;
                    else {
                        if (land.forSaleStatus === true)
                            otherLand.forSale += land.landCount;
                        else
                            otherLand.noSell += land.landCount;
                    }
                } else if (land.forbid) {
                    otherLand.forbid += land.landCount;
                }
                return otherLand;
            }, {noSell: 0, forSale: 0, forbid: 0, myLand: 0});

            // làm lại chỗ này no sell === ko có tại zoom khác 22
            const {noSell, forSale, forbid, myLand} = otherLand;
            const empty = totalCount - (noSell + forSale + forbid + myLand);
            const canBuy = forSale + empty ? forSale + empty : '';
            const canNotBuy = myLand + noSell ? myLand + noSell : '';
            clsName = this.createClassLand(this.props, {canBuy, canNotBuy})
        }
        return { clsName, infoHtml };
    }

    render() {

        const { tile: {lat, lng, quadKey}, tile, tileMouseEnter, user, syncCenterMap, landInfo} = this.props;
        const {toggleCertification, isOpenLandCertificate, isOpenCertificateImage} = this.state;
        const { clsName, infoHtml } = this.createClassAndInfo();

        let bdStyle = {
            borderTop: '0.1px solid rgba(0, 0, 0, 0.1)',
            borderLeft: '0.1px solid rgba(0, 0, 0, 0.1)',
            borderBottom: '0.1px solid rgba(0, 0, 0, 0.1)',
            borderRight: '0.1px solid rgba(0, 0, 0, 0.1)',
        };

        const extClass = quadKey.substring(quadKey.length - 1);
        const generalStyle = `${'1px'} ${'solid'} ${'rgba(0, 0, 0, 0.22'}`;
        if(Number(extClass) === 0){
            bdStyle.borderTop = generalStyle;
            bdStyle.borderLeft = generalStyle;
        } else if(Number(extClass) === 1){
            bdStyle.borderTop = generalStyle;
            bdStyle.borderRight = generalStyle;
        } else if(Number(extClass) === 2){
            bdStyle.borderLeft = generalStyle;
            bdStyle.borderBottom = generalStyle;
        } else if(Number(extClass) === 3){
            bdStyle.borderRight = generalStyle;
            bdStyle.borderBottom = generalStyle;
        }

        // const extClass2 = quadKey.substring(quadKey.length - 2, quadKey.length - 1);
        // console.log('extClass2', extClass2)
        // const styleLv16 = `${'1px'} ${'solid'} ${'rgba(0, 0, 0, 0.7'}`;
        // switch (extClass2) {
        //     case 0:
        //         bdStyle.borderTop = styleLv16;
        //         //bdStyle.borderLeft = styleLv16;
        //         break;
        //     case 1:
        //         //bdStyle.borderTop = styleLv16;
        //         bdStyle.borderRight = styleLv16;
        //         // statements_1
        //         break;
        //     case 2:
        //         bdStyle.borderLeft = styleLv16;
        //         //bdStyle.borderBottom = styleLv16;
        //         // statements_1
        //         break;
        //     case 3:
        //         bdStyle.borderRight = styleLv16;
        //         bdStyle.borderBottom = styleLv16;
        //         // statements_1
        //         break;
        // }
        

        const { onHandleHideLandCertificate, onHandleShowCertificateImage } = this;
        return (
            // /style={bdStyle}
            <Fragment>
                {isOpenLandCertificate && landCertificationPopup({isOpenLandCertificate,landInfo,user,syncCenterMap, onHandleHideLandCertificate, onHandleShowCertificateImage})}
                {isOpenCertificateImage && getCertificateAlertPopup(isOpenCertificateImage, tile, this.onHandleHideCertificateImage, user, landInfo)}
                <div id={quadKey} style={bdStyle} className={'tile-n' + clsName} onClick={e => this.tileLeftMouseClick(e, tile)}  onContextMenu={e => this.tileRightMouseClick(e)}
                     onMouseOver={() => this.onHandleMouseOver(tile)}
                     onMouseLeave={() => this.onHandleMouseLeave(tile)}
                     onMouseEnter={(e) => tileMouseEnter(e)} data-lat={lat} data-lng={lng}>
                    {toggleCertification && <div className="toggle-land-button-container">
                        <div className='toggle-land-button' onClick={() => this.onHandleShowLandCertificate()}>
                            <img src={toggleLandIcon} alt=''/>
                        </div>

                    </div>}

                    {/*show info land when other user sell 4 cell below*/}
                    {infoHtml}
                    {clsName.indexOf('center') !== -1 ? <div className='centick'/> : null}
                    {(clsName.indexOf('myForSell') !== -1 && clsName.indexOf('myLand') === -1) || clsName.indexOf('forSell') !== -1 ?
                        <div className='fs-cont'>
                            {<img src={loadingImage('/images/bloodland-ui/forsale1.svg')} alt='' style={{width: '45px'}}/>}
                            {/* <div className="fs-img"/>
                        <div className='fs-title'> for sale</div> */}
                        </div>
                        : ''
                    }
                    {clsName.indexOf('myLand') !== -1 && clsName.indexOf('myForSell') === -1 ?
                        <div className='ml-cont'>
                            {<img src={loadingImage('/images/bloodland-ui/myland1.svg')} alt='' style={{width: '45px'}}/>}
                            {/* <div className="ml-img"/> */}
                            {/* <div className='ml-title'> my land</div> */}
                        </div>
                        : ''
                    }
                    {clsName.indexOf('myLand') !== -1 && clsName.indexOf('myForSell') !== -1 ?
                        <div className='fl-cont' style={{marginTop: '22px'}}>
                            <div className='fs-cont'>
                                {<img src={loadingImage('/images/bloodland-ui/forsale1.svg')} alt=''
                                      style={{width: '45px'}}/>}
                            </div>
                            <div className='ml-cont'>
                                {<img src={loadingImage('/images/bloodland-ui/myland1.svg')} alt=''
                                      style={{width: '45px'}}/>}
                            </div>
                        </div> : ''
                    }
                </div>
            </Fragment>

        )
    }
}

const mapStateToProps = (state) => {
    const {lands, authentication: {user}, map, alert, users, settings, lands: {areaLand,landInfo}} = state;
    return {
        user, alert, lands, map, users, settings , areaLand, landInfo
    };
};

const mapDispatchToProps = (dispatch) => ({
    getAllLandById: (userId) => dispatch(landActions.getAllLandById(userId)),
    syncCenterMap: (center, zoom, centerQuadkey) => dispatch(mapActions.syncCenterMap(center, zoom, centerQuadkey)),
    addSelected: (multiSelectSave) => dispatch(mapActions.addSelected(multiSelectSave)),
    selectMode: (mode) => dispatch(mapActions.selectMode(mode)),
    getAreaLand: (param) => dispatch(landActions.getAreaLand(param)),
    getLandInfo: (quadKey) => dispatch(landActions.getLandInfo({quadKey})),
    addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
    removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TileComponent);