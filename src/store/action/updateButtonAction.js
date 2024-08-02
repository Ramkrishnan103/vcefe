import {constants} from '../../constants';

export const setUpdatingButton = (isUpdating) => {
    return {type: constants.SET_UPDATING, payload: isUpdating};
};
