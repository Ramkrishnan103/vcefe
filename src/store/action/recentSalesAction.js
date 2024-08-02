import apiConfig from "../../config/apiConfig";
import { apiBaseURL, toastType, supplierActionType, recentSales } from "../../constants";
import requestParam from "../../shared/requestParam";
import { addToast } from "./toastAction";
import { setLoading } from "./loadingAction";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { setSavingButton } from "./saveButtonAction";

export const fetchRecentSales = (productID) => async (dispatch) => {
    apiConfig.get(`recentPurchase?itemId=${productID}`).then((response) => {
        dispatch({
            type: recentSales.FETCH_RECENT_SALES,
            payload: response.data.data,
        })
    })
    .catch(({ response }) => {
        dispatch(
            addToast({
                text: response.message,
                type: toastType.ERROR,
            })
        );
    });
}