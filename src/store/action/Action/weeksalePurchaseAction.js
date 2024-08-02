import apiConfig from '../../config/apiConfig';
import {apiBaseURL, toastType, weekSalePurchasesActionType} from '../../constants';
import {addToast} from './toastAction';
import {setLoading} from "./loadingAction";

//  export const weekSalePurchases = () => async (dispatch) => {
//     dispatch(setLoading(true));

//     // apiConfig.get(apiBaseURL.WEEK_SALE_PURCHASES_API)
//     //     .then((response) => {
//         let response = {
//             "data": {
//                 "success": true,
//                 "data": {
//                   "dates": [
//                     "2024-05-14",
//                     "2024-05-15",
//                     "2024-05-16",
//                     "2024-05-17",
//                     "2024-05-18",
//                     "2024-05-19",
//                     "2024-05-10"
//                   ],
//                   "sales": [
//                     213789.97398399998,
//                     167440.09758,
//                     298251.82090800005,
//                     129550.79880000002,
//                     179675.53999999998,
//                     51515.4544,
//                     35172.97
//                   ],
//                   "purchases": [
//                     288870,
//                     28822.5,
//                     159030,
//                     9338.1,
//                     2321311.4579999996,
//                     2750,
//                     0
//                   ]
//                 },
//                 "message": "Week of Sales Purchase Retrieved Successfully"
//               }
//         };
//             dispatch({type: weekSalePurchasesActionType.WEEK_SALE_PURCHASES, payload: response.data.data})
//             dispatch(setLoading(false));
//         // })
//         // .catch(({response}) => {
//         //     dispatch(addToast(
//         //         {text: response.data.message, type: toastType.ERROR}));
//         //     dispatch(setLoading(false));
//         // });
//  }


export const weekSalePurchases =
    (filter = {}, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        let url=apiBaseURL.WEEK_SALE_PURCHASES;
        console.log(url)
       
       apiConfig
            .get(url)
            .then((response) => {
              console.log(response)
                dispatch({
                    type: weekSalePurchasesActionType.WEEK_SALE_PURCHASES,
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



// export const top5SellingItems =
//     (filter = {}, isLoading = true) =>
//     async (dispatch) => {
//         if (isLoading) {
//             dispatch(setLoading(true));
//         }
//         let url = apiBaseURL.TOP5SELLINGITEMS;
//         console.log(url)
//         // if (
//         //     !_.isEmpty(filter) &&
//         //     (filter.page ||
//         //         filter.pageSize ||
//         //         filter.search ||
//         //         filter.order_By ||
//         //         filter.created_at ||
//         //         filter.customer_id)
//         // ) {
//         //     url += requestParam(filter, admin, null, null, url);
//         // }
//        apiConfig
//             .get(url)
//             .then((response) => {
//               console.log(response)
//                 dispatch({
//                     type: top5SeliingItemsActionType.FETCH_TOP5SELLINGITEMS,
//                     payload: response.data.data,
//                 });
//                 // dispatch(
//                 //     setTotalRecord(
//                 //         response.data.meta.total !== undefined &&
//                 //             response.data.meta.total >= 0
//                 //             ? response.data.meta.total
//                 //             : response.data.data.total
//                 //     )
//                 // );
//                 // dispatch(callSaleApi(false));
//                 if (isLoading) {
//                     dispatch(setLoading(false));
//                 }
//             })
//             .catch(({ response }) => {
//                 dispatch(
//                     addToast({
//                         text: response.data.message,
//                         type: toastType.ERROR,
//                     })
//                 );
//             });
//     };