import {  DailyPurchaseActionType } from "../../constants";



export default (state = [], action) => {
    switch (action.type) {
        case DailyPurchaseActionType.FETCH_DAILY_PURCHASE:
            return action.payload;
        
        default:
            return state;
    }
};