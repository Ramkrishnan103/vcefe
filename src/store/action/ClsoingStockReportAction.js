import { apiBaseURL, closingStockReportActionType } from "../../constants";
import { setLoading } from "./loadingAction";
import apiConfig from '../../config/apiConfig';

export const fetchClosingStockReport =
    (filter = {}, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        let url = apiBaseURL.CLOSINGSTOCKREPORT;
        console.log(url)
       
        apiConfig
            .get(url)
            .then((response) => {
                console.log("REPONSE =>",response)
                dispatch({  
                    type: closingStockReportActionType.FETCH_CLOSING_STOCK_REPORT,
                    payload: response.data.data,
                });
                
                if (isLoading) {
                    dispatch(setLoading(false));
                }
            })
            .catch(({ response }) => {
                dispatch(
                    addToast({
                        text: response.data.message,
                        type: toastType.ERROR,
                    })
                );
            });
    };

    //MARK FROM RAM [20-07-2024]

    export const fetchClosingStockReportFilter =
    (values,filter = {}, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        let url = apiBaseURL.CLOSINGSTOCKREPORT+values;
        console.log(url)
       
        apiConfig
            .get(url)
            .then((response) => {
                console.log("REPONSE =>",response)
                dispatch({  
                    type: closingStockReportActionType.FETCH_CLOSING_STOCK_REPORT_FILTER,
                    payload: response.data.data,
                });
                
                if (isLoading) {
                    dispatch(setLoading(false));
                }
            })
            .catch(({ response }) => {
                dispatch(
                    addToast({
                        text: response.data.message,
                        type: toastType.ERROR,
                    })
                );
            });
    };

    //MARK TO RAM [20-07-2024]