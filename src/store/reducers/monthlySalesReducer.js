import {MonthlySalesActionType} from '../../constants';

export default (state = [], action) => {
    switch (action.type) {
        case MonthlySalesActionType.FETCH_MONTHLY_SALES:
            return action.payload;
        
        default:
            return state;
    }
};
