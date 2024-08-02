import { acYearActionType } from '../../constants';

export default (state = [], action) => {
    switch (action.type) {
        case acYearActionType.FETCH_ACYEAR:
             return action.payload;
        
        default:
            return state;
    }
};
