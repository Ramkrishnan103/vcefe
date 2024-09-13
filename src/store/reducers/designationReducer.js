import { designationActionType } from "../../constants";

export default (state = [], action) => {
    switch (action.type) {
        case designationActionType.FETCH_DESIGNATIONS:
            return action.payload;
        case designationActionType.ADD_DESIGNATION:
            return action.payload;
        default:
            return state;
    }
};
