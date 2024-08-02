import { MonthlyPurchaseActionType } from "../../constants";



export default (state = [], action) => {
    switch (action.type) {
        case MonthlyPurchaseActionType.FETCH_MONTHLY_PURCHASE:
            return action.payload;
        
        default:
            return state;
    }
};
