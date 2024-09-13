import { payrollReport } from "../../constants";

export default (state = [], action) => {
    switch (action.type) {
        case payrollReport.FETCH_REPORT:
            return action.payload;
        default:
            return state;
    }
};