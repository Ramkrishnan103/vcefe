import { empDepartmentActionType } from "../../constants";

export default (state = [], action) => {
    switch (action.type) {
        case empDepartmentActionType.FETCH_EMPDEPARTMENT:
            return action.payload;
        case empDepartmentActionType.ADD_EMPDEPARTMENT:
            return [...state, action.payload];
        case empDepartmentActionType.FETCH_EMPDEPARTMENTS:
            return [action.payload];
        case empDepartmentActionType.EDIT_EMPDEPARTMENTS:
            return state.map(item => item.id === +action.payload.id ? action.payload : item);
        case empDepartmentActionType.DELETE_EMPDEPARTMENT:
            return state.filter(item => item.id !== action.payload);
        default :
        return state;

    }};