import { brandFormActionType } from "../../constants";

export default (state = "", action) => {
    switch (action.type) {
        case brandFormActionType.FORM_CLOSE:
            return action.payload;
        default:
            return state;
    }
}