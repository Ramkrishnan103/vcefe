import { cartCalculation } from "../../constants";

export default (state = [], action) => {
    switch (action.type) {
        case cartCalculation.CART_CALCULATION:
            return action.payload;
        default:
            return state;
    }
};