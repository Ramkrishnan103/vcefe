import { taxFilterActionType } from '../../constants';

export default (state = [], action) => {
    switch (action.type) {
        case taxFilterActionType.TAX_FILTER:
            return action.payload;
        default:
            return state;
    }
};

