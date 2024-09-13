import { posSupplierActionType } from "../../constants";

export default (state = [], action) => {
    switch (action.type) {
        case posSupplierActionType.FETCH_POS_SUPPLIER:
            return action.payload;
        case posSupplierActionType.FETCH_POS_SUPPLIERS:
            return [action.payload];
        case posSupplierActionType.EDIT_POS_SUPPLIERS:
            return state.map(item => item.id === +action.payload.id ? action.payload : item);
        case posSupplierActionType.ADD_POS_SUPPLIERS:
            return [...state, action.payload];
        case posSupplierActionType.DELETE_POS_SUPPLIERS:
            return state.filter(item => item.id !== action.payload);

        default:
            return state;

    }
};