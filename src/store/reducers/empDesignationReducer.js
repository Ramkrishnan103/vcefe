import { empDesignationActionType } from "../../constants";

export default (state = [], action) => {
    switch (action.type) {
        case empDesignationActionType.FETCH_EMPDESIGNATION:
            return action.payload;
        case empDesignationActionType.ADD_EMPDESIGNATION:
            return [...state, action.payload];
        case empDesignationActionType.FETCH_EMPDESIGNATIONS:
            return [action.payload];
        case empDesignationActionType.EDIT_EMPDESIGNATION:
            return state.map(item => item.id === +action.payload.id ? action.payload : item);
        case empDesignationActionType.DELETE_EMPDESIGNATION:
            return state.filter(item => item.id !== action.payload);
        default :
        return state;

    }};