import { recentSales } from "../../constants";

export default (state = [], action) => {
    switch (action.type) {
        case recentSales.FETCH_RECENT_SALES:
            return action.payload;
        default:
            return state;
    }
}