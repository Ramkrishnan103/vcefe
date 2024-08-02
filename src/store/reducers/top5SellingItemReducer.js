import {top5SeliingItemsActionType} from '../../constants';

export default (state = [], action) => {
    switch (action.type) {
        
             case top5SeliingItemsActionType.FETCH_TOP5SELLINGITEMS:
            return action.payload;
        default:
            return state;
    }
};
