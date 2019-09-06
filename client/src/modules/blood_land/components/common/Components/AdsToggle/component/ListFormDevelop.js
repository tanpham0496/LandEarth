import React, { Component,Fragment } from 'react';
import {connect} from "react-redux";
import {translate} from "react-i18next";
import {developmentalAction} from "../../../../../../../store/actions/commonActions/developActions";
import {DataTable} from 'primereact/components/datatable/DataTable';
import {Column} from 'primereact/components/column/Column';
import {Dialog} from 'primereact/dialog';
import {Button} from "primereact/button";
import TranslateLanguage from "../../../../general/TranslateComponent";
import {Editor} from "primereact/editor";
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
    renderDevelopDialogContentForUser = () => {
        const i =  this.props.develops && this.state.selectedDevelop &&  this.props.develops.findIndex(a => a._id === this.state.selectedDevelop._id );
        if (this.state.selectedDevelop) {
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
                        <button onClick={() => { typeof this.props.develops[i-1] !== "undefined" && this.setState({selectedDevelop : this.props.develops[i-1] })} } disabled={typeof this.props.develops[i-1] === "undefined"} >
                            <TranslateLanguage direct={'adsNotice.previousBtn'}/>
                        </button>
                        <button onClick={() => this.setState({visible: false, selectedDevelop : ''})}>
                            <TranslateLanguage direct={'adsNotice.closeBtn'}/>
                        </button>
                        <button onClick={() => { typeof this.props.develops[i+1] !== "undefined" && this.setState({selectedDevelop : this.props.develops[i+1] })} }  disabled={typeof this.props.develops[i+1] === "undefined"} >
                            <TranslateLanguage direct={'adsNotice.nextBtn'}/>
                        </button>
                    </div>
                </div>
            );
        }
        else {
            return null;
        }
    };
    renderDevelopEditForAdmin = () => {
        if (this.state.selectedDevelop) {
            return (
                <div className="dialog-detail-notice">
                    <div className="basic-notice"><TranslateLanguage direct={'adsNotice.notice.generalNotice'}/></div>
                    <div className="createDate">{this.state.selectedDevelop.createdDate}</div>
                    <div className={'translation-notice'}><TranslateLanguage direct={'adsNotice.noticePopup.title'}/></div>
                    <div className="title">
                        <input maxLength={35} type={'text'} value={this.state.selectedDevelop.title}
                               onChange={(e) => this.setState({selectedDevelop: {...this.state.selectedDevelop, title : e.target.value} }) }
                               placeholder={'제목을 입력하세요.(35자 이내)'} />
                    </div>
                    <div className={'translation-notice'}><TranslateLanguage direct={'adsNotice.noticePopup.content'}/></div>
                    <div className="content-edit">
                        <Editor  style={{height:'320px'}} value={this.state.selectedDevelop.content} onTextChange={(e) => this.setState({selectedDevelop: {...this.state.selectedDevelop, content : e.htmlValue} })} placeholder={'내용을 입력하세요.(1000자 이내)'}/>
                    </div>
                    <div className={'footer-detail'}>
                        <button onClick={() => this.setState({edit: false, selectedDevelop : ''})}>
                            <TranslateLanguage direct={'adsNotice.closeBtn'}/>
                        </button>
                        <button onClick={() => this.onHandleUpdateNotice(this.state.selectedDevelop)}>
                            <i className="pi pi-save"> </i>
                            <TranslateLanguage direct={'adsNotice.updateBtn'}/>
                        </button>
                    </div>
                </div>
            );
        }
    };
    onHandleUpdateNotice = (data) => {
        this.props.updateDevelopment(data);
        this.props.getDevelopment();
        setTimeout(()=> { this.props.getDevelopment() }, 0.01);
        setTimeout(()=> { this.setState({ edit: false, selectedDevelop : ''}) },0.1);
    };
    actionTemplate = (develops) =>{
        return (
            <div key={develops._id}>
                <Button className={'btn-edit-notice'} icon="pi  pi-pencil"  onClick={(e) => this.setState({ selectedDevelop: develops, edit: true })}  >  </Button>
                <Button className={'btn-delelte-notice'} icon="pi pi-times-circle"  onClick={(e) => this.props.addPopup({name : "DeleteDevelopPopup", data : [develops._id] })} >  </Button>
            </div>
        );
    };
    onHandleDeleteDevelop = () => {
        const {screens} = this.props;
        if(screens['DeleteDevelopPopup'] && screens['DeleteDevelopPopup']['0']){
            this.props.onHandleDeleteDevelop(screens['DeleteDevelopPopup']['0']);
            this.props.getDevelopment();
            this.state.filterGlobar.splice(this.state.filterGlobar.findIndex(ft=> ft._id === screens['DeleteDevelopPopup']['0']),1)
        }
    }
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
        this.setState({ selectedDevelop: itemDev.data, visible: true })
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
                     {this.props.user.role === 'manager' &&
                         <div>
                             <DataTable value={screens['filterGlobar'] ? this.state.filterGlobar : (develops ||[]) } paginator={true} rows={5} header={header} first={this.state.firstPagination} onPage={(e) => {this.setState({firstPagination: e.first}) }}  >
                                <Column field="" header={ <TranslateLanguage direct={'adsNotice.table.number'}/>} body={this.brandTemplate} style={{width: '52px', 'textAlign': 'center'}} />
                                <Column body={this.customCategory} header={ <TranslateLanguage direct={'adsNotice.classification'}/>}/>
                                <Column field="title"  header={ <TranslateLanguage direct={'adsNotice.table.title'}/>} style={{width: '230px' }}/>
                                <Column field="userName" header={ <TranslateLanguage direct={'adsNotice.table.Operator'}/>} />
                                <Column field="createdDate" header={ <TranslateLanguage direct={'adsNotice.table.createdDate'}/>} />
                                <Column body={(e)=> this.actionTemplate(e)}  header={ <TranslateLanguage direct={'adsNotice.table.action'}/>} />
                            </DataTable>
                             <Dialog className={'dialog-modal-notice'} header={<TranslateLanguage direct={'adsNotice.notice'}/>} visible={this.state.edit} modal={true} onHide={() => this.setState({edit: false, selectedDevelop : ''}) }>
                                 {this.renderDevelopEditForAdmin()}
                             </Dialog>
                         </div>
                     }

                     {this.props.user.role === 'user' &&
                         <div>
                             <DataTable value={screens['filterGlobar'] ? this.state.filterGlobar : (develops ||[]) } paginator={true} rows={5} header={header} onRowClick={this.handleClickViewDetailDevelop} first={this.state.firstPagination} onPage={(e) => {this.setState({firstPagination: e.first}) }} >
                                 <Column field="" header={ <TranslateLanguage direct={'adsNotice.table.number'}/>} body={this.brandTemplate} style={{width: '52px', 'textAlign': 'center'}} />
                                 <Column body={this.customCategory} header={ <TranslateLanguage direct={'adsNotice.classification'}/>}/>
                                 <Column field="title"  header={ <TranslateLanguage direct={'adsNotice.table.title'}/>} style={{width: '230px' }}/>
                                 <Column field="userName" header={ <TranslateLanguage direct={'adsNotice.table.Operator'}/>} />
                                 <Column field="createdDate" header={ <TranslateLanguage direct={'adsNotice.table.createdDate'}/>} />
                             </DataTable>
                             <Dialog className={'dialog-modal-notice'} header={<TranslateLanguage direct={'adsNotice.notice'}/>} visible={this.state.visible} modal={true} onHide={() => this.setState({visible: false, selectedDevelop : ''}) }>
                                {this.renderDevelopDialogContentForUser()}
                             </Dialog>
                         </div>
                     }
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
    getDevelopment: () => dispatch(developmentalAction.get()),
    updateDevelopment: (data) => dispatch(developmentalAction.update(data)),
    onHandleDeleteDevelop: (id) => dispatch(developmentalAction._delete(id))
});
export default connect(mapStateToProps,mapDispatchToProps)(translate('common')(ListFormDevelop));