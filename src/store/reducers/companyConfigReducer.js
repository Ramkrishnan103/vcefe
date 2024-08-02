import { companyConfigActionType } from "../../constants";



export default (state = [], action) => {
    switch (action.type) {
        case companyConfigActionType.FETCH_COMPANY_CONFIG:
            return action.payload;
        case companyConfigActionType.EDIT_COMPANY_CONFIG:
                return action.payload;
        default:
            return state;
    }
};