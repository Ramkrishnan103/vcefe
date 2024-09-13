import {  permissionConfigActionType} from '../../constants';

export default (state = [], action) => {
    switch (action.type) {
        case permissionConfigActionType.FETCH_PERMISSION_CONFIG:
            return action.payload;
        default:
            return state;
    }
}
