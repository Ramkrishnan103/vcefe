import apiConfig from '../../config/apiConfig';
import {apiBaseURL,  toastType, usersImageActionType} from '../../constants';
import {removeFromTotalRecord} from './totalRecordAction';
import {addToast} from './toastAction';
import {getFormattedMessage} from '../../shared/sharedMethod';

export const deleteUserImage = (imageId) => async (dispatch) => {s
    apiConfig.delete(apiBaseURL.USERS_IMAGE_DELETE + '/' + imageId)
        .then((response) => {
            dispatch(removeFromTotalRecord(1));
            dispatch({type: usersImageActionType.DELETE_USERS_IMAGE, payload: imageId});
            dispatch(addToast({text: getFormattedMessage('users.success.delete.message')}));
        })
        .catch(({response}) => {
            dispatch(addToast(
                {text: response.data.message, type: toastType.ERROR}));
        });
};
