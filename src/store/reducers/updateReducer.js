import { update } from "../../constants";

export default (state = [], action) => {
    switch (action.type) {
        case update.UPDATE_ITEM:
            return action.payload;
        default:
            return state;
    }
};