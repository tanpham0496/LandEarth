import React, { Component,Fragment } from 'react';
import {connect} from "react-redux";
import {translate} from "react-i18next";
import {developmentalAction} from "../../../../../../../store/actions/commonActions/developActions";
import {DataTable} from 'primereact/components/datatable/DataTable';
import {Column} from 'primereact/components/column/Column';
import {Dialog} from 'primereact/dialog';
// import {Button} from "primereact/button";
import TranslateLanguage from "../../../../general/TranslateComponent";
import {Dropdown} from 'primereact/dropdown';

import {
    onHandleTranslate,
    screenActions,
} from "../../../../../../../helpers/importModule";
import DeleteDevelopPopup from "../../../Popups/commomPopups/DeleteDevelopPopup";

class ListFormDevelop extends Component {

    constructor() {
        super();
        this.state = {
            visible: false ,
            itemDev : null,
            filterGlobar : ''
        };
    }
    renderDevelopDialogContent = () => {
        if (this.state.selectedDevelop && this.props.develops) {
            const i = this.props.develops.findIndex(a => a._id === this.state.selectedDevelop._id );
            return (
                <div className="dialog-detail-notice">
                    <div className="basic-notice"> <TranslateLanguage direct={'adsNotice.notice.generalNotice'}/></div>
                    <div className="createDate">{this.state.selectedDevelop.createdDate}</div>
                    <div className={'translation-notice'}><TranslateLanguage direct={'adsNotice.noticePopup.title'}/></div>
                    <div className="title"> {this.state.selectedDevelop.title}</div>
                    <div className={'translation-notice'}><TranslateLanguage direct={'adsNotice.noticePopup.content'}/></div>
                    <div className="content"> <span dangerouslySetInnerHTML={{__html: this.state.selectedDevelop.content }} /></div>
                    {/*<div className="content"> <Editor readOnly={true} headerTemplate={()=> ( <span className="ql-formats"> </span>)}   style={{height:'320px'}} value={this.state.selectedDevelop.content}  /></div>*/}
                    <div className={'footer-detail'}>
                        <button onClick={() => { this.setState({selectedDevelop : this.props.develops[i-1] }); this.props.develops[i-1] && this.props.develops[i-1].read === false && this.props.haveReadDevelopment(this.props.develops[i-1]) } } disabled={typeof this.props.develops[i-1] === "undefined"} >
                            <TranslateLanguage direct={'adsNotice.previousBtn'}/>
                        </button>
                        <button onClick={() => this.setState({visible: false, selectedDevelop : ''})}>
                            <TranslateLanguage direct={'adsNotice.closeBtn'}/>
                        </button>
                        <button onClick={() => { this.setState({selectedDevelop : this.props.develops[i+1] }); this.props.develops[i+1] && this.props.develops[i+1].read === false &&  this.props.haveReadDevelopment(this.props.develops[i+1]) }}  disabled={typeof this.props.develops[i+1] === "undefined"} >
                            <TranslateLanguage direct={'adsNotice.nextBtn'}/>
                        </button>
                        {this.props.user.role === 'editor' &&
                        <button className={'btn-delelte-notice'} onClick={(e) => this.props.addPopup({name : "DeleteDevelopPopup", data : {idDevelop : this.state.selectedDevelop.idDevelop,id : this.state.selectedDevelop.id, userId : this.state.selectedDevelop.userId} })}>
                            <TranslateLanguage direct={'adsNotice.recycle'}/>
                        </button>
                        }

                    </div>
                </div>
            );
        }
        else {
            return null;
        }
    };

    // actionTemplate = (develops) =>{
    //     return (
    //         <div key={develops._id}>
    //             {/*<Button className={'btn-edit-notice'} icon="pi  pi-pencil"  onClick={(e) => this.setState({ selectedDevelop: develops, edit: true })}  >  </Button>*/}
    //             <Button className={'btn-delelte-notice'} icon="pi pi-times-circle"  onClick={(e) => this.props.addPopup({name : "DeleteDevelopPopup", data : {idDevelop : develops.idDevelop,id : develops._id,userId : develops.userId}})} >  </Button>
    //         </div>
    //     );
    // };
    onHandleDeleteDevelop = () => {
        const {screens} = this.props;
        if(screens['DeleteDevelopPopup'] ){
            this.setState({visible: false, selectedDevelop : ''})
            this.props.onHandleDeleteDevelop(screens['DeleteDevelopPopup']);
            this.state.filterGlobar && this.state.filterGlobar.splice(this.state.filterGlobar.findIndex(ft=> ft._id === screens['DeleteDevelopPopup'].id),1)
        }
    };
    brandTemplate = (rowData, column) => {
        return column.rowIndex + 1;
    };
    handleOnChangeCategory = (e) => {
        if( e.value.type !== 'All')  {
            const {develops} =this.props;
            const selectedCategory = develops && develops.filter(nt => nt.category === e.value.type);
            this.setState({ itemDev : e.value, filterGlobar : selectedCategory });
            this.props.addPopup({name : 'filterGlobar'})
        }
        else {
            this.setState({  itemDev : e.value });
            this.props.removePopup({name : 'filterGlobar'}) ;
        }
        //set pagination -> 0
        this.setState({firstPagination : 0})
    };
    handleClickViewDetailDevelop = (itemDev) => {
        this.setState({ selectedDevelop: itemDev.data, visible: true });
        itemDev.data && itemDev.data.read === false &&this.props.haveReadDevelopment(itemDev.data);
    };
    customCategory =  (rowData) => {
        const {t , lng , settingReducer:{language}} = this.props;
        switch (rowData.category) {
            case 'Develop' :
                return onHandleTranslate(t, 'adsNotice.development.develop', language, lng);
            case 'Fix Bug' :
                return onHandleTranslate(t, 'adsNotice.development.bug', language, lng);
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
        const {develops,screens , t , lng , settingReducer:{language}} = this.props;
        const ItemListDev = [
            {
                name:  onHandleTranslate(t, 'adsNotice.development.all', language, lng),
                type: 'All'
            },
            {
                name:  onHandleTranslate(t, 'adsNotice.development.develop', language, lng),
                type: 'Develop'
            },{
                name:  onHandleTranslate(t, 'adsNotice.development.bug', language, lng),
                type: 'Fix Bug'
            }
        ];
        const header = (<div className={'header-notice'}>
            <div className={"number-post"}>
                {develops && <span> {develops.length}  <TranslateLanguage direct={'adsNotice.development.totalDevelop'}/></span> }
            </div>
            <div style={{'textAlign':'right'}}>
                <Dropdown value={this.state.itemDev} options={ItemListDev} onChange={this.handleOnChangeCategory} placeholder={onHandleTranslate(t, 'adsNotice.development.all', language, lng)} optionLabel="name" />
            </div>
        </div >);

        return (
            <Fragment>
                 <div className="content-section implementation">
                     <DataTable value={screens['filterGlobar'] ? this.state.filterGlobar : (develops ||[]) } paginator={true} rows={5} header={header} onRowClick={this.handleClickViewDetailDevelop} first={this.state.firstPagination} onPage={(e) => {this.setState({firstPagination: e.first}) }} rowClassName={this.rowClassName} >
                         <Column field="" header={ <TranslateLanguage direct={'adsNotice.table.number'}/>} body={this.brandTemplate} style={{width: '52px', 'textAlign': 'center'}} />
                         <Column body={this.customCategory} header={ <TranslateLanguage direct={'adsNotice.classification'}/>}/>
                         <Column field="title"  header={ <TranslateLanguage direct={'adsNotice.table.title'}/>} style={{width: '230px' }}/>
                         <Column field="nameAdmin" header={ <TranslateLanguage direct={'adsNotice.table.Operator'}/>} />
                         <Column field="createdDate" header={ <TranslateLanguage direct={'adsNotice.table.createdDate'}/>} />
                         {/*<Column body={(e)=> this.actionTemplate(e)}  header={ <TranslateLanguage direct={'adsNotice.table.action'}/>} style={{display: `${this.props.user.role === 'user' ? 'none' : 'table-cell'}`}} />*/}
                     </DataTable>
                     <Dialog className={'dialog-modal-notice'} header={<TranslateLanguage direct={'adsNotice.notice'}/>} visible={this.state.visible} modal={true} onHide={() => this.setState({visible: false, selectedDevelop : ''}) }>
                        {this.renderDevelopDialogContent()}
                     </Dialog>
                </div>

                {screens['DeleteDevelopPopup'] &&  <DeleteDevelopPopup onHandleDeleteDevelop={this.onHandleDeleteDevelop} /> }
            </Fragment>
        );
    }

}

function mapStateToProps(state) {
    const { authentication: {user}, develop : {develops} , screens , settingReducer} = state;
    return {
        user,
        develops,
        screens,
        settingReducer
    };
}
const mapDispatchToProps = (dispatch) => ({
    addPopup: (screen) => dispatch(screenActions.addPopup(screen)),
    removePopup: (screen) => dispatch(screenActions.removePopup(screen)),
    getDevelopment: (id) => dispatch(developmentalAction.getById(id)),
    // updateDevelopment: (data) => dispatch(developmentalAction.update(data)),
    onHandleDeleteDevelop: (param) => dispatch(developmentalAction._delete(param)),
    haveReadDevelopment:(param) => dispatch(developmentalAction.haveReadDevelop(param))
});
export default connect(mapStateToProps,mapDispatchToProps)(translate('common')(ListFormDevelop));