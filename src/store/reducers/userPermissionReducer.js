import { userPermissionActionType } from '../../constants';

export default (state = [], action) => {
    switch (action.type) {
       
        case userPermissionActionType.ADD_USERS_PERMISSIONS:
            return [...state,action.payload];
        case userPermissionActionType.FETCH_USERS_PERMIISIONS:
            return [action.payload];
            
        
        default:
            return state;
    }
};
