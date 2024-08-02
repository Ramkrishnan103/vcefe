
import apiConfig from "../../config/apiConfig";
import { apiBaseURL, empDesignationActionType, salaryDetailActionType, toastType } from "../../constants";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { setLoading } from "./loadingAction";
import { addToast } from "./toastAction";

export const fetchSalaryDetails=
    (filter = {}, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }

        let url = apiBaseURL.SALARYDEATILS;
        console.log(url)
       
        apiConfig
            .get(url)
            .then((response) => {
               console.log("Resonse",response)

                dispatch({
                    type: salaryDetailActionType.FETCH_SALARYDEATILS,
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
