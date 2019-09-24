import React, { Component,Fragment } from 'react';
import {connect} from "react-redux";
import {translate} from "react-i18next";
import {notificationAction} from "../../../../../../../store/actions/commonActions/notifyActions";
import {DataTable} from 'primereact/components/datatable/DataTable';
import {Column} from 'primereact/components/column/Column';
import {Dialog} from 'primereact/dialog';
// import {Button} from "primereact/button";
import TranslateLanguage from "../../../../general/TranslateComponent";
import DeleteNoticePopup from "../../../Popups/commomPopups/DeleteNoticePopup";
import {Dropdown} from 'primereact/dropdown';
import {onHandleTranslate} from "../../../../../../../helpers/Common";

import {
    screenActions,
} from "../../../../../../../helpers/importModule";


class ListFormNotice extends Component {
    constructor() {
        super();
        this.state = {
            visible: false ,
            item : null,
            filterGlobar : ''
        };
    }
    renderNoticeDialogContent = () => {
        const i =  this.props.notifies && this.state.selectedNotice &&  this.props.notifies.findIndex(a => a._id === this.state.selectedNotice._id );
        if ( this.props.notifies && this.state.selectedNotice) {
            return (
                <div className="dialog-detail-notice">
                    <div className="basic-notice"> <TranslateLanguage direct={'adsNotice.notice.generalNotice'}/></div>
                    <div className="createDate">{this.state.selectedNotice.createdDate}</div>
                    <div className={'translation-notice'}><TranslateLanguage direct={'adsNotice.noticePopup.title'}/></div>
                    <div className="title"> {this.state.selectedNotice.title}</div>
                    <div className={'translation-notice'}><TranslateLanguage direct={'adsNotice.noticePopup.content'}/></div>
                    <div className="content"> <span dangerouslySetInnerHTML={{__html: this.state.selectedNotice.content }} /></div>
                    <div className={'footer-detail'}>
                        <button onClick={() => {this.setState({selectedNotice : this.props.notifies[i-1] });  this.props.notifies[i-1] && this.props.notifies[i-1].read === false && this.props.haveReadNotification( this.props.notifies[i-1])} } disabled={typeof this.props.notifies[i-1] === "undefined"} >
                            <TranslateLanguage direct={'adsNotice.previousBtn'}/>
                        </button>
                        <button onClick={() => this.setState({visible: false, selectedNotice : ''})}>
                            <TranslateLanguage direct={'adsNotice.closeBtn'}/>
                        </button>
                        <button onClick={() => { this.setState({selectedNotice : this.props.notifies[i+1] }); this.props.notifies[i+1] && this.props.notifies[i+1].read === false && this.props.haveReadNotification( this.props.notifies[i+1] )} }  disabled={typeof this.props.notifies[i+1] === "undefined"} >
                            <TranslateLanguage direct={'adsNotice.nextBtn'}/>
                        </button>
                        {this.props.user.role === 'editor' &&
                        <button className={'btn-delelte-notice'} onClick={(e) => this.props.addPopup({name : "DeleteNoticePopup", data : {idNotify : this.state.selectedNotice.idNotify,id : this.state.selectedNotice.id, userId : this.state.selectedNotice.userId} })}>
                            <TranslateLanguage direct={'adsNotice.recycle'}/>
                        </button> }

                    </div>
                </div>
            );
        }
        else {
            return null;
        }
    };
    // actionTemplate = (notifies) =>{
    //     return (
    //         <div>
    //             {/*<Button className={'btn-delelte-notice'} icon="pi pi-times-circle"  onClick={(e) => this.props.addPopup({name : "DeleteNoticePopup", data : {idNotify : notifies.idNotify,id : notifies.id, userId : notifies.userId} })}>  </Button>*/}
    //         </div>
    //     );
    // };
    onHandleDeleteNotice = () => {
       const {screens} = this.props;
        if(screens['DeleteNoticePopup']){
            this.setState({visible: false, selectedNotice : ''});
            this.props.onHandleDeleteNotice(screens['DeleteNoticePopup']);
           this.state.filterGlobar && this.state.filterGlobar.splice(this.state.filterGlobar.findIndex(ft=> ft._id === screens['DeleteNoticePopup'].id),1);
       }
    };
    brandTemplate = (rowData, column) => {
        return column.rowIndex + 1;
    };
    handleOnChangeCategory = (e) => {
        if( e.value.type !== 'All')  {
            const {notifies} =this.props;
            const selectedCategory = notifies && notifies.filter(nt => nt.category === e.value.type);
            this.setState({ item : e.value, filterGlobar : selectedCategory });
            this.props.addPopup({name : 'filterGlobar'})
        }
        else {
            this.setState({  item : e.value });
            this.props.removePopup({name : 'filterGlobar'}) ;
        }
        //set pagination -> 0
        this.setState({firstPagination : 0})
    };
    handleClickViewDetailNotice = (item) => {
            this.setState({ selectedNotice: item.data, visible: true });
            item.data && item.data.read === false && this.props.haveReadNotification(item.data);

    };
    customCategory =  (rowData) => {
        const {t , lng , settingReducer:{language}} = this.props;
        switch (rowData.category) {
            case 'Normal' :
                return onHandleTranslate(t, 'adsNotice.classification.normal', language, lng);
            case 'Update' :
                return onHandleTranslate(t, 'adsNotice.classification.update', language, lng);
            case 'Event' :
                return onHandleTranslate(t, 'adsNotice.classification.event', language, lng);
            default :
                return ''
        }
    };
    rowClassName = (rowData) => {
        if(rowData.read === true) {
            return {'read-NewNotice' : true};
        }
        else {}
    }
    render() {
        const {notifies,screens , t , lng , settingReducer:{language}} = this.props;
        const ItemList = [
            {
                name:  onHandleTranslate(t, 'adsNotice.classification.all', language, lng),
                type: 'All',
                key:'1'
            },
            {
                name:  onHandleTranslate(t, 'adsNotice.classification.normal', language, lng),
                type: 'Normal' ,
                key:'2'
            },{
                name:  onHandleTranslate(t, 'adsNotice.classification.update', language, lng),
                type: 'Update' ,
                key:'3'
            },{
                name:  onHandleTranslate(t, 'adsNotice.classification.event', language, lng),
                type: 'Event',
                key:'4'
            }
        ];

        const header = (<div className={'header-notice'}>
                <div className={"number-post"}>
                    {notifies && <span> {notifies.length}  <TranslateLanguage direct={'adsNotice.totalNotice'}/></span> }
                </div>
                <div style={{'textAlign':'right'}}>
                    <Dropdown dataKey ={ItemList.key} value={this.state.item} options={ItemList} onChange={this.handleOnChangeCategory} placeholder={onHandleTranslate(t, 'adsNotice.classification.all', language, lng)} optionLabel='name' />
                </div>
        </div >);

        return (
            <Fragment>
                <div className="content-section implementation">
                    <DataTable value={screens['filterGlobar'] ? this.state.filterGlobar : (notifies || []) } paginator={true} rows={5} header={header} first={this.state.firstPagination} onPage={(e) => {this.setState({firstPagination: e.first}) }} onRowClick={this.handleClickViewDetailNotice} rowClassName={this.rowClassName}>
                        <Column field="" header={ <TranslateLanguage direct={'adsNotice.table.number'}/>} body={this.brandTemplate} style={{width: '52px', 'textAlign': 'center'}} />
                        <Column body={this.customCategory} header={ <TranslateLanguage direct={'adsNotice.classification'}/>}/>
                        <Column field="title"  header={ <TranslateLanguage direct={'adsNotice.table.title'}/>} style={{width: '230px' }}/>
                        <Column field="nameAdmin" header={ <TranslateLanguage direct={'adsNotice.table.Operator'}/>} />
                        <Column field="createdDate" header={ <TranslateLanguage direct={'adsNotice.table.createdDate'}/>} />
                        {/*<Column body={(e)=> this.actionTemplate(e)}  header={ <TranslateLanguage direct={'adsNotice.table.action'}/>} style={{display: `${this.props.user.role === 'user' ? 'none' : 'table-cell'}`}}/>*/}
                    </DataTable>
                    <Dialog className={'dialog-modal-notice'} header={<TranslateLanguage direct={'adsNotice.notice'}/>} visible={this.state.visible} modal={true} onHide={() => this.setState({visible: false, selectedNotice : ''}) }>
                        {this.renderNoticeDialogContent()}
                    </Dialog>
                </div>
                {screens['DeleteNoticePopup'] && <DeleteNoticePopup onHandleDeleteNotice={this.onHandleDeleteNotice} /> }
            </Fragment>
        );
    }

}

function mapStateToProps(state) {
    const { authentication: {user}, notify : {notifies} , screens , settingReducer} = state;
    return {
        user,
        notifies,
        screens ,settingReducer
    };
}
const mapDispatchToProps = (dispatch) => ({
    addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
    removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
    getNotification: (id) => dispatch(notificationAction.getById(id)),
    // updateNotification: (data) => dispatch(notificationAction.update(data)),
    onHandleDeleteNotice: (param) => dispatch(notificationAction._delete(param)),
    haveReadNotification:(param) => dispatch(notificationAction.haveReadNotify(param))
});
export default connect(mapStateToProps,mapDispatchToProps)(translate('common')(ListFormNotice));