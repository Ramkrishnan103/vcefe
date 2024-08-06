import { salaryDetailActionType } from "../../constants";

export default (state = [], action) => {
    switch (action.type) {
        case salaryDetailActionType.FETCH_SALARYDEATILS:
            return action.payload;
        default:
            return state;
    }};