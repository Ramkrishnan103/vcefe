import { payrollReportDetails } from "../../constants";

export default (state = [], action) => {
    switch (action.type) {
       
        case payrollReportDetails.FETCH_PAYROLL_DETAILS:
            return action.payload;
        
        default:
            return state;
    }};