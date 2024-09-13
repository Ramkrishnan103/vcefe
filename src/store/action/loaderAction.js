import {constants} from '../../constants';

export const setLoader = (isLoad) => {
    return {type: constants.LOADER, payload: isLoad};
};
