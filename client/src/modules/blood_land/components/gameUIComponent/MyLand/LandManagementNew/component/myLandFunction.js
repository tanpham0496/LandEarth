export const onCheckDeleteCategory = (categories, addPopup) => {
    // this.onHandleShowPopup()
    if(categories.length === 0){
        addPopup({name: 'NoCategorySelectedAlert'})
    }else{
        const isCategoryEmptyLand = categories.filter(c => c.landCount === 0);
        if (isCategoryEmptyLand.length === 0) {
            addPopup({name: 'FolderNotEmptyAlert'})
        } else {
            addPopup({name: 'DeleteCategoryConfirmAlert'})
        }

    }
};