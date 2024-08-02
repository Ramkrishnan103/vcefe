import {productGroupsActionType, unitsActionType} from '../../constants';

export default (state = [], action) => {
    switch (action.type) {
        case productGroupsActionType.FETCH_PRODUCT_GROUPS:
            return action.payload;
        case productGroupsActionType.FETCH_PRODUCT_GROUP:
            return [action.payload];
        case productGroupsActionType.ADD_PRODUCT_GROUP:
            return [...state, action.payload];
        case productGroupsActionType.EDIT_PRODUCT_GROUP:
            return state.map(item => item.id === +action.payload.id ? action.payload : item);
        case productGroupsActionType.DELETE_PRODUCT_GROUP:
            return state.filter(item => item.id !== action.payload);
        case productGroupsActionType.FETCH_ALL_PRODUCT_GROUPS:
        return action.payload;
        default:
            return state;
    }
};
