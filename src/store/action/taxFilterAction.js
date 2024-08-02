import apiConfig from '../../config/apiConfig';
import { apiBaseURL, taxFilterActionType, toastType } from '../../constants';

export const taxFilter = (taxId) => async (dispatch) => {
    apiConfig.get(apiBaseURL.GET_ALL_TAX + '?' + "taxSetupId=" + taxId)
        .then((response) => {
            console.log('Tax Percentage');
            console.log(response.data.data);
            dispatch({ type: taxFilterActionType.TAX_FILTER, payload: response.data.data })
        })
        .catch(({ response }) => {
        //     dispatch(addToast(
        //         { text: response.data.message, type: toastType.ERROR }));
        console.log(response);
        });

};
