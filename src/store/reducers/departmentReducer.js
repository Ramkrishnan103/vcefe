import { departmentActionType } from "../../constants";

export default (state = [], action) => {
    switch (action.type) {
        case departmentActionType.FETCH_DEPARTMENTS:
            return action.payload;
        case departmentActionType.ADD_DEPARTMENT:
            return action.payload;
        default:
            return state;
    }
};
