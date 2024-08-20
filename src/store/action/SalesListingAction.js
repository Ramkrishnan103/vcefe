import apiConfig from "../../config/apiConfig";
import { apiBaseURL, posSalesListingActionType, toastType } from "../../constants";
import { setLoading } from "./loadingAction";
import { addToast } from "./toastAction";

export const fetchPosSalesListing =
    (filter = {}, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        let url = apiBaseURL.SALES;
        console.log(url)
       
        apiConfig
            .get(url)
            .then((response) => {
                console.log("Response => ",response)
                dispatch({  
                    type: posSalesListingActionType.FETCH_SALES_LISTING,
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
