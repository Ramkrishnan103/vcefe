import { yearTopProductActionType} from '../../constants';

export default (state = [], action) => {
    switch (action.type) {
        case yearTopProductActionType.YEAR_TOP_PRODUCT:
            return action.payload;
            //  case top5SeliingItemsActionType.FETCH_TOP5SELLINGITEMS:
            // return action.payload;
        default:
            return state;
    }
};
