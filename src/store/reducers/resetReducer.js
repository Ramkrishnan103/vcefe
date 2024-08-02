import { resetAction } from "../../constants";

export default (state = false, action) => {
    switch (action.type) {
        case resetAction.RESET:
            return action.payload;
        default:
            return state;
    }
};
