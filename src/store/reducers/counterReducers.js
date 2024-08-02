import { counterList } from "../../constants";

export default (state = [], action) => {
    switch (action.type) {
        case counterList.GET_ALL_COUNTER:
            return action.payload;
        default:
            return state;
    }
};