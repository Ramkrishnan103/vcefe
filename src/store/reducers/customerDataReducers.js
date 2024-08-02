import { customerData } from "../../constants";

export default (state = [], action) => {
    switch (action.type) {
        case customerData.CUSTOMER_DATA:
            return action.payload;
        default:
            return state;
    }
}