import { cartItem } from "../../constants";

export default (state = [], action) => {
    switch (action.type) {
        case cartItem.CART_ITEMS:
            return action.payload;
        default:
            return state;
    }
};