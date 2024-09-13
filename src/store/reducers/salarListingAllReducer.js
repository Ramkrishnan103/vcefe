import { salaryListingall } from "../../constants";

export default (state = [], action) => {
    switch (action.type) {
        case salaryListingall.FETCH_SLARAYDETAILS_FILTER:
            return action.payload;
        default:
            return state;
    }
};