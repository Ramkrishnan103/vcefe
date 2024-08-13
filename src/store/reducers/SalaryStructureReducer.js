import { salaryDetailActionType } from "../../constants";

export default (state = [], action) => {
    switch (action.type) {
        case salaryDetailActionType.FETCH_SALARYDEATILS:
            return action.payload;
        case salaryDetailActionType.FETCH_SLARAYdETAILS_FILTER:
            return action.payload;
        case salaryDetailActionType.DELETE_SALARYDETIALS:
            return state.filter(item => item.id !== action.payload);         
       
        default:
            return state;
    }};