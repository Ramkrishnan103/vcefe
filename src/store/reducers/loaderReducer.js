import {constants} from '../../constants';

export default (state = false, action) => {
    switch (action.type) {
        case constants.LOADER:
            return action.payload;
        default:
            return state;
    }
}