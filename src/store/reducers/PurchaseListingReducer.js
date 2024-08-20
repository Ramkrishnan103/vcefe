import {posPurchaseListingActionType} from '../../constants';

export default (state = [], action) => {
    switch (action.type) {
        case posPurchaseListingActionType.FETCH_PURCHASE_LISTING:
            return action.payload;
        default:
            return state;
    }
};