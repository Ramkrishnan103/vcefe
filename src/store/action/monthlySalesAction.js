import apiConfig from "../../config/apiConfig";
import {
    apiBaseURL,
    MonthlySalesActionType,
    toastType,
    Filters,
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

export const fetchMonthSales =
    (filter = {}, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        let url = apiBaseURL.MONTHLY_SALES;
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
                    type: MonthlySalesActionType.FETCH_MONTHLY_SALES,
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

export const fetchMonthSalesparam =
    (values,filter = {}, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        let url = apiBaseURL.MONTHLY_SALES+values;
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
                    type: MonthlySalesActionType.FETCH_MONTHLY_SALES,
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
