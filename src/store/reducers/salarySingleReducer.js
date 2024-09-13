import { singleSalary } from "../../constants";

export default (state = [], action) => {
    switch (action.type) {
        case singleSalary.FETCH_SINGLE_SALARY:
            return action.payload;
        case singleSalary.ADD_SALARY:
            return action.payload;
        case singleSalary.EDIT_SALARY:
            return action.payload;
        default:
            return state;
    }
};