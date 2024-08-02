import apiConfig from '../../config/apiConfig';
import {apiBaseURL, dashboardActionType, toastType, todaySalePurchaseCountActionType} from '../../constants';
import {addToast} from './toastAction';
import {setLoading} from "./loadingAction";
import { responsivePropType } from 'react-bootstrap/esm/createUtilityClasses';

// export const todaySalePurchaseCount = () => async (dispatch) => {
//     dispatch(setLoading(true));
//     apiConfig.get(apiBaseURL.DASHBOARD)
//         .then((response) => {
//         // let response = {
//         //     "data": {
//         //         "success": true,
//         //         "data": {
//         //           "today_sales": 35172.97,
//         //           "today_purchases": 0,
//         //           "today_sale_return": 0,
//         //           "today_purchase_return": 0,
//         //           "today_sales_received_count": 7640,
//         //           "today_expense_count": 2900
//         //         },
//         //         "message": "Sales Purchase Count Retrieved Successfully"
//         //       }
//         // };
//             dispatch({type: todaySalePurchaseCountActionType.TODAY_SALE_COUNT, payload: response.data.data})
//             dispatch(setLoading(false));
//         })
//         .catch(({response}) => {
//             dispatch(addToast(
//                 {text: response.data.message, type: toastType.ERROR}));
//             dispatch(setLoading(false));
//         });
// }

export const todaySalePurchaseCount =
    (filter = {}, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
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
                // dispatch(
                //     setTotalRecord(
                //         response.data.meta.total !== undefined &&
                //             response.data.meta.total >= 0
                //             ? response.data.meta.total
                //             : response.data.data.total
                //     )
                // );
                // dispatch(callSaleApi(false));
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