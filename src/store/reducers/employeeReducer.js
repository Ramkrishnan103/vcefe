import { employeeActionType } from '../../constants';

export default (state = [], action) => {
    switch (action.type) {
        case employeeActionType.FETCH_EMPLOYEES:
            return action.payload;
        // case employeeActionType.FETCH_EMPLOYEE:
        //     return [action.payload]
        case employeeActionType.ADD_EMPLOYEE:
            return action.payload;
        case employeeActionType.EDIT_EMPLOYEE:
            return action.payload;
        case employeeActionType.DELETE_EMPLOYEE:
            return state.filter(item => item.id !== action.payload);
        default:
            return state;
    }
};
