
import { closingStockReportActionType } from "../../constants";

export default (state =[],action) => {
    switch(action.type){
        case closingStockReportActionType.FETCH_CLOSING_STOCK_REPORT  :
            return action.payload;
//MARK FROM RAM [20-07-2024]
        case closingStockReportActionType.FETCH_CLOSING_STOCK_REPORT_FILTER  :
            return action.payload;  
//MARK TO RAM [20-07-2024]   
         default:
            return state;
    }
}