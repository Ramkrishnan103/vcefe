import { singleEmployeeActionType } from "../../constants";

export default (state = [], action) => {
    switch (action.type) {
        case singleEmployeeActionType.FETCH_EMPLOYEE:
            return action.payload;
        default:
            return state;
    }
};