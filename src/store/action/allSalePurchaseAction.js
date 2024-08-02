import apiConfig from "../../config/apiConfig";
import { apiBaseURL, dashboardActionType, toastType } from "../../constants";
import { addToast } from "./toastAction";
import { setLoading } from "./loadingAction";
import { setTotalRecord } from "./totalRecordAction";

// export const fetchAllSalePurchaseCount = () => async (dispatch) => {
//     dispatch(setLoading(true));
//     // apiConfig
//     //     .get(apiBaseURL.ALL_SALE_PURCHASE)
//     //     .then((response) => {

//         let response = {"data": {
//             "success": true,
//             "data": {
//               "all_sales_count": 55680783086277.4,
//               "all_purchases_count": 1192422375670.5957,
//               "all_sale_return_count": 669137.8864479997,
//               "all_purchase_return_count": 602283.79,
//               "all_sales_received_count": 334081771852112.2,
//               "all_expense_count": 676770468190.12
//             },
//             "message": "All Sales Purchase and returns Count Retrieved Successfully"
//           }
//         };

//             dispatch(
//                 setTotalRecord(
//                     response.data.meta.total !== undefined &&
//                         response.data.meta.total >= 0
//                         ? response.data.meta.total
//                         : response.data.data.total
//                 )
//             );
//             dispatch({
//                 type: dashboardActionType.FETCH_ALL_SALE_PURCHASE,
//                 payload: response.data.data,
//             });
//             dispatch(setLoading(false));
//         // }
//         // )
//         // .catch(({ response }) => {
//         //     dispatch(
//         //         addToast({ text: response.data.message, type: toastType.ERROR })
//         //     );
//         //     dispatch(setLoading(false));
//         // });
// };



export const fetchAllSalePurchaseCount =
    (filter = {}, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        const admin = true;
        let url = apiBaseURL.DASHBOARD;
        console.log(url)
        // if (
        //     !_.isEmpty(filter) &&
        //     (filter.page ||
        //         filter.pageSize ||
        //         filter.search ||
        //         filter.order_By ||
        //         filter.created_at ||
        //         filter.customer_id)
        // ) {
        //     url += requestParam(filter, admin, null, null, url);
        // }
        apiConfig
            .get(url)
            .then((response) => {
                console.log(response)
                dispatch({
                    type: dashboardActionType.FETCH_ALL_SALE_PURCHASE,
                    payload: response.data.data,
                });
            //     dispatch(
            //         setTotalRecord(
            //             response.data.meta.total !== undefined &&
            //                 response.data.meta.total >= 0
            //                 ? response.data.meta.total
            //                 : response.data.data.total
            //         )
            //     );
            //    dispatch(callSaleApi(false));
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
    

