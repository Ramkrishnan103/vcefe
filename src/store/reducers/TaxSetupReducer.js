import {taxSetupActionType, unitsActionType} from '../../constants';

export default (state = [], action) => {
    switch (action.type) {
        case taxSetupActionType.FETCH_TAXSETUP:
             return action.payload;
        case taxSetupActionType.FETCH_TAXSETUPS:
            return [action.payload];
        case taxSetupActionType.ADD_TAXSETUP:
            return [...state, action.payload];
        case taxSetupActionType.EDIT_TAXSETUP:
            return state.map(item => item.id === +action.payload.id ? action.payload : item);
        case taxSetupActionType.DELETE_TAXSETUP:
            return state.filter(item => item.id !== action.payload);
        default:
            return state;
    }
};
