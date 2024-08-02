import {productGroupsActionType} from '../../constants';

export default (state = [], action) => {
    switch (action.type) {
        case productGroupsActionType.FETCH_ALL_PRODUCT_GROUPS:
            return action.payload;
        default:
            return state;
    }
};
