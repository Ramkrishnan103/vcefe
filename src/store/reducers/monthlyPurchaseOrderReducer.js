import { monthlyPurchaseOrderActionType } from "../../constants";



export default (state = [], action) => {
    switch (action.type) {
        case monthlyPurchaseOrderActionType.FETCH_MONTHLY_PURCHASE_ORDER:
            return action.payload;
        
        default:
            return state;
    }
};
