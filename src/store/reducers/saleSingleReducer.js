import { saleSingleActionType } from '../../constants';

export default (state = {}, action) => {
    switch (action.type) {
        case saleSingleActionType.FETCH_SALE:
            return action.payload;
        default:
            return state;
    }
};
