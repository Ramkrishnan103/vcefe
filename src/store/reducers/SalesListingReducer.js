import { posSalesListingActionType } from '../../constants';

export default (state = [], action) => {
    switch (action.type) {
        case posSalesListingActionType.FETCH_SALES_LISTING:
            return action.payload;
        default:
            return state;
    }
};