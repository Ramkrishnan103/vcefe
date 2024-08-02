import apiConfig from '../../config/apiConfig';
import {apiBaseURL, toastType, recentSaleActionType} from '../../constants';
import {addToast} from './toastAction';
import {setLoading} from "./loadingAction";

// export const recentSales = () => async (dispatch) => {
//     dispatch(setLoading(true));

//     apiConfig.get(apiBaseURL.RECENT_SALES)
//         .then((response) => {
//             dispatch({type: recentSaleActionType.RECENT_SALES, payload: response.data.data})
//             dispatch(setLoading(false));
//         })
//         .catch(({response}) => {
//             dispatch(addToast(
//                 {text: response.data.message, type: toastType.ERROR}));
//             dispatch(setLoading(false));
//         });
// }

export const recentSales =
    (filter = {}, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        let url = apiBaseURL.RECENT_SALES;
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
                    type: recentSaleActionType.RECENT_SALES,
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


