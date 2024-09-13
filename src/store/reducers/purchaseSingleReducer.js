import { purchaseSingleActionType } from '../../constants';

export default (state = {}, action) => {
    switch (action.type) {
        case purchaseSingleActionType.FETCH_PURCHASE:
            return action.payload;
        default:
            return state;
    }
};