import React from "react";
import {objectsActions, screenActions, TranslateLanguage} from "../../../../../../helpers/importModule";
import MessageBoxNew from '../../MessageBox'
import {useDispatch} from "react-redux";

function DeleteCategoryConfirmPopup(props) {
    const {onHandleDeleteCate} = props;
    const dispatch = useDispatch();
    const mode = "question"; //question //info //customize
    const sign = "delete"; //blood //success //error //delete //loading
    const yesBtn = () => {
        onHandleDeleteCate();
        dispatch(screenActions.removePopup({name: 'DeleteCategoryConfirmPopup'}));
        dispatch(objectsActions.resetLandSelectedMyLand())
    }
    const noBtn = () => dispatch(screenActions.removePopup({name: 'DeleteCategoryConfirmPopup'}));
    const header = <TranslateLanguage direct={'menuTab.myLand.landOwned.recycle.delete'}/>
    const body = <TranslateLanguage direct={'menuTab.myLand.landOwned.recycle.confirmDelete'}/>
    return <MessageBoxNew modal={true} mode={mode} yesBtn={yesBtn} noBtn={noBtn} header={header} body={body} sign={sign}/>;
}
export default DeleteCategoryConfirmPopup;
