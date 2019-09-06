// Store Game Objects - Tree - Character
import * as t from '../../actionTypes/gameActionTypes/objectActionTypes'
import _ from 'lodash'
const initSate = {
    selectedLandMyLand: [],
    selectedCategoryMyLand: [],
    selectedLandToPlantTree: []
}
const objectsReducer = (state = initSate, action) => {
    switch (action.type) {
        case t.MOVE_TREE_TO_MAP_SUCCESS:
            if (state.objects && action.res.plantedTrees) {
                state.objects = [...state.objects].concat(action.res.plantedTrees);
            }
            return {
                ...state,
                plantStatus: action.res.status,
            };
        case t.MOVE_TREE_TO_MAP_FAILURE:
            return {
                ...state,
                ...action
            };
        case t.CLEAR_MOVE_TREE_TO_MAP:
            if (state.plantStatus) delete state.plantStatus;
            return {
                ...state,
            };

        case t.GET_OBJS_SUCCESS:
            //console.log('action.objects', action.objects);
            return {
                ...state,
                objects: action.objects
            };
        case t.GET_OBJS_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case t.GET_OBJS_AREA_SUCCESS:
            //console.log('action.objects', action.objects);
            return {
                ...state,
                objectArea: action.objectArea
            };
        case t.GET_OBJS_AREA_FAILURE:
            return {
                ...state,
                error: action.error
            };

        case t.GET_MY_OBJS_SUCCESS:
            return {
                ...state,
                myObjects: action.myObjects,
                allBigTreeQuadKey: action.myObjects && Array.isArray(action.myObjects) ? action.myObjects.reduce((totalQK, object) => object.bigTreeQuadKeys ? totalQK.concat(object.bigTreeQuadKeys) : totalQK, []) : []
            };
        case t.GET_MY_OBJS_FAILURE:
            return {
                ...state,
                error: action.error
            };

        case t.GET_DETAIL_OBJ_SUCCESS:
            return {
                ...state,
                detailObj: action.detail,
                objectId: action.objectId
            };

        case t.GET_DETAIL_OBJ_FAILURE:
            return {
                ...state,
                error: action.error
            };

        case t.GET_ONLAND_OBJS_BY_USERID_SUCCESS:
            return {
                ...state,
                onLands: action.onLands
            };

        case t.GET_ONLAND_OBJS_BY_USERID_FAILURE:
            return {
                ...state,
                error: action.error
            };

        case t.REMOVE_OBJS:
            let treeObjects = [];
            if (state.objects) {
                treeObjects = state.objects.filter(tree => !action.deletedTrees.includes(tree._id.toString()));
            }
            return {
                ...state,
                objects: treeObjects
            };

        case t.UPDATE_OBJS:
            let updateTreeObjects = [];
            if (typeof state.objects !== 'undefined' && state.objects) {
                updateTreeObjects = state.objects.map(tree => {
                    let index = action.objects.findIndex(t => t._id.toString() === tree._id.toString());
                    if (index !== -1) {
                        return action.objects[index];
                    }
                    return tree;
                })
            }
            return {
                ...state,
                objects: (!updateTreeObjects || typeof updateTreeObjects) ? state.objects : updateTreeObjects
            };

        case t.SET_TREE_DIES:
            return {...state};
        case t.GET_OBJECT_BY_QUADKEY_SUCCESS:
            return {
                ...state,
                objectList: action.objectList.landWithTree
            };
        case t.GET_LAND_SELECTED_MY_LAND:
            const {param: {landSelected }} = action;
            let selectedLandMyLandClone = _.cloneDeep(state.selectedLandMyLand);

            if (!selectedLandMyLandClone.some(l => l._id === landSelected._id) && action.param.status) {
                selectedLandMyLandClone.push(landSelected)
            }
            if (selectedLandMyLandClone.some(l => l._id === landSelected._id) && !action.param.status) {
                selectedLandMyLandClone.splice(selectedLandMyLandClone.findIndex(l => l._id === landSelected._id), 1)
            }
            // console.log('selectedLandMyLandClone', selectedLandMyLandClone)

            return {
                ...state,
                selectedLandMyLand: _.uniqBy(selectedLandMyLandClone, 'quadKey')
            };

        case t.GET_CATEGORY_SELECTED_MY_LAND:
            const {param: {categorySelected }} = action;
            let selectedCategoryMyLandClone = _.cloneDeep(state.selectedCategoryMyLand);
            if (!selectedCategoryMyLandClone.some(c => c._id === categorySelected._id) && action.param.status) {
                selectedCategoryMyLandClone.push(categorySelected)
            }
            if (selectedCategoryMyLandClone.some(c => c._id === categorySelected._id) && !action.param.status) {
                selectedCategoryMyLandClone.splice(selectedCategoryMyLandClone.findIndex(l => l._id === categorySelected._id), 1)
            }
            return {
                ...state,
                selectedCategoryMyLand: _.uniqBy(selectedCategoryMyLandClone, '_id')
            };

        case t.GET_LAND_TREES_SUCCESS:
            return {
                ...state,
                resultGetLandTrees: action.result
            };
        case t.GET_LAND_PLANT_TREE:
            let selectedLandToPlantTreeClone = _.cloneDeep(state.selectedLandToPlantTree);
            if(!action.param){
                return {
                    ...state,
                    selectedLandToPlantTree: []
                }
            }else{
                if(action.param.status){
                    selectedLandToPlantTreeClone.push(action.param.value)
                }else{
                    selectedLandToPlantTreeClone.splice(selectedLandToPlantTreeClone.findIndex(l => l._id === action.param.value._id) , 1)
                }
                return {
                    ...state,
                    selectedLandToPlantTree: selectedLandToPlantTreeClone
                }
            }
        case t.GET_LAND_REMOVE_TREE:{
            return {
                ...state,
                selectedLandToRemove: action.param
            }
        }
        case t.GET_CURRENT_CATEGORY_ID: {
            return {
                ...state,
                currentCategoryId: action.id
            }
        }
        default:
            return state
    }
};

export default objectsReducer;