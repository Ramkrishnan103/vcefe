import {dailySalesActionType} from '../../constants';

export default (state = [], action) => {
    switch (action.type) {
        case dailySalesActionType.FETCH_DALIY_SALES:
            return action.payload;
        
        default:
            return state;
    }
};
