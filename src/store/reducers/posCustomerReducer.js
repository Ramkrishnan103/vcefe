import { posCustomerActionType } from "../../constants";

export default (state = [], action) => {
    switch (action.type) {
        case posCustomerActionType.FETCH_CUSTOMERS:
            return action.payload;
        case posCustomerActionType.FETCH_CUSTOMER:
            return [action.payload];
        case posCustomerActionType.EDIT_CUSTOMER:
            return state.map(item => item.id === +action.payload.id ? action.payload : item);
      
        case posCustomerActionType.ADD_CUSTOMER:
            return [...state, action.payload];
        case posCustomerActionType.DELETE_CUSTOMER:
            return state.filter(item => item.id !== action.payload);
        
        default:
            return state;

    }
};
