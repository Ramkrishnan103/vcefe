import apiConfig from "../../config/apiConfig";
import { apiBaseURL, posPurchaseListingActionType, toastType } from "../../constants";
import { setLoading } from "./loadingAction";
import { addToast } from "./toastAction";

export const fetchPosPurchaseListing =
    (filter = {}, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        let url = apiBaseURL.PURCHASES;
        console.log(url)
       
        apiConfig
            .get(url)
            .then((response) => {
                console.log("Response => ",response)
                dispatch({  
                    type: posPurchaseListingActionType.FETCH_PURCHASE_LISTING,
                    payload: response?.data?.data,
                });
               
                if (isLoading) {
                    dispatch(setLoading(false));
                }
            })
            .catch(({ response }) => {
                dispatch(
                    addToast({
                        text: response?.data?.message,
                        type: toastType.ERROR,
                    })
                );
            });
    };
