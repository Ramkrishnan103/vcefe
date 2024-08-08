import apiConfig from "../../config/apiConfig";
import {
    apiBaseURL,
    
    toastType,
    Filters,
    DailyPurchaseActionType,
   
} from "../../constants";
import requestParam from "../../shared/requestParam";
import { addToast } from "./toastAction";
import {
    setTotalRecord,
    addInToTotalRecord,
    removeFromTotalRecord,
} from "./totalRecordAction";
import { setLoading } from "./loadingAction";
import { getFormattedMessage } from "../../shared/sharedMethod";

export const fetchDailyPurchase =
    (values,filter = {}, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        // let url = apiBaseURL.DAILY_PURCHASE+ "?fromDate=" +"'"+ new Date().toLocaleDateString("fr-CA",{year:"numeric",month:"2-digit",day:"2-digit" })+"'" + 
        // "&toDate="+"'"+ new Date().toLocaleDateString("fr-CA",{year:"numeric",month:"2-digit",day:"2-digit" })+"'"+ "&warehouseId=0";
        let url=apiBaseURL.DAILY_PURCHASE+values;
        console.log(url)
        console.log(url);
        // if (
        //     !_.isEmpty(filter) &&
        //     (filter.page ||
        //         filter.pageSize ||
        //         filter.search ||
        //         filter.order_By ||
        //         filter.created_at)
        // ) {
        //     url += requestParam(filter, null, null, null, url);
        // }
        apiConfig
            .get(url)
            .then((response) => {
                console.log(response);
                dispatch({
                    type: DailyPurchaseActionType.FETCH_DAILY_PURCHASE,
                    payload: response?.data?.data,
                });
                // dispatch(
                //     setTotalRecord(
                //         response.data.meta.total !== undefined &&
                //             response.data.meta.total >= 0
                //             ? response.data.meta.total
                //             : response.data.data.total
                //     )
                // );
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

// export const fetchMonthlySales = () => async (dispatch) => {
//     apiConfig
//         .get(apiBaseURL.MONTHLY_SALES)
//         .then((response) => {
//             dispatch({
//                 type: MonthlySalesActionType.FETCH_MONTHLY_SALES,
//                 payload: response.data.data,
//             });
//         })
//         .catch(({ response }) => {
//             dispatch(
//                 addToast({ text: response.data.message, type: toastType.ERROR })
//             );
//         });
// };
