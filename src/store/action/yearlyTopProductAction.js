import apiConfig from '../../config/apiConfig';
import {apiBaseURL, toastType, yearTopProductActionType} from '../../constants';
import {addToast} from './toastAction';
import {setLoading} from "./loadingAction";

export const yearlyTopProduct =
    (filter = {}, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        let url=apiBaseURL.TOP5SELLINGITEMS;
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
                    type: yearTopProductActionType.YEAR_TOP_PRODUCT,
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
//= () => async (dispatch) => {
//     dispatch(setLoading(true));

//     // apiConfig.get(apiBaseURL.YEAR_TOP_PRODUCT)
//     //     .then((response) => {
//         let response = {
//             "data": {
//                 "success": true,
//                 "data": {
//                   "name": [
//                     "Red Sunglass",
//                     "Orange",
//                     "Red Jacket",
//                     "Laptop",
//                     "Studs"
//                   ],
//                   "total_quantity": [
//                     10855,
//                     10109,
//                     9667,
//                     2767,
//                     1064
//                   ]
//                 },
//                 "message": "Yearly TopSelling Products Retrieved Successfully"
//               }
//         };

//             dispatch({type: yearTopProductActionType.YEAR_TOP_PRODUCT, payload: response.data.data})
//             dispatch(setLoading(false));
//         // })
//             // .catch(({response}) => {
//             //     dispatch(addToast(
//             //         {text: response.data.message, type: toastType.ERROR}));
//             //     dispatch(setLoading(false));
//             // });
// }
