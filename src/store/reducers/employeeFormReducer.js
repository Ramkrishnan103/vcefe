import { employeeFormData } from "../../constants";

export default (state = [], action) => {
    switch (action.type) {
        case employeeFormData.FORM_DATA:
            return action.payload;
        default:
            return state;
    }
};