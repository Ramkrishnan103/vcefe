import { ledgerActionType } from "../../constants";

export default (state = [], action) => {
    switch (action.type) {
        case ledgerActionType.FETCH_LEDGER:
            return action.payload;
        case ledgerActionType.FETCH_LEDGERS:
            return [action.payload];
        case ledgerActionType.EDIT_LEDGER:
            return state.map(item => item.id === +action.payload.id ? action.payload : item);
        // MARK RAM FROM [12-07-2024]
        case ledgerActionType.ADD_LEDGER:
            return [...state, action.payload];
        case ledgerActionType.DELETE_LEDGER:
            return state.filter(item => item.id !== action.payload);
        // MARK RAM TO [12-07-2024]
        default:
            return state;

    }
};
