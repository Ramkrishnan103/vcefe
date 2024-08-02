import apiConfig from "../../config/apiConfig";
import {
    apiBaseURL,
    dailySalesActionType,
    toastType,
    Filters,
    dateFormat,
    
    
   
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
import { date } from "faker/lib/locales/az";
import { DATETIME_MS } from "ag-charts-community/dist/esm/es6/module-support";
import { month } from "faker/lib/locales/az/date";
import FilterComponent from "../../shared/components/FilterComponent";

export const fetchDailySales =
    (values,filter = {}, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
     //    let url = apiBaseURL.DAILY_SALES + "?fromDate=" +"'"+ new Date().getFullYear() +"-" + (new Date().getMonth()) + "-" + new Date().getDate() +"'" +"&toDate="+"'"+new Date().getFullYear()+"-" + (new Date().getMonth()) + "-" + new Date().getDate() +"'&counterId=0";
       //let url=apiBaseURL.DAILY_SALES;
       //    var todaysDate=new Date();

    //    function convertDate(date){
    //     var yyyy=date.getFullYear().toString();
    //     var mm=(date.getFullMonth()+1).toString();
    //     var dd=date.getDate().toString();
        
    //     var mmChars=mm.split("");
    //     var ddChars=dd.split("");

    //     return yyyy + "-" + (mmChars[1]?mm:"0"+mmChars[0]) + "-" +(ddChars[1]?dd:"0"+ddChars[0]);
    //    }
    //    let url=apiBaseURL.DAILY_SALES+convertDate(todaysDate)

    // let url=apiBaseURL.DAILY_SALES + "?fromDate=" +"'"+ new Date().toLocaleDateString("fr-CA",{year:"numeric",month:"2-digit",day:"2-digit" })+"'" + 
    // "&toDate="+"'"+ new Date().toLocaleDateString("fr-CA",{year:"numeric",month:"2-digit",day:"2-digit" })+"'"+ "&counterId=0&paymentType=&particular=#C013/2024";
   
    let url=apiBaseURL.DAILY_SALES+values;
    console.log(url)


    //let url=apiBaseURL.DAILY_SALES+"?fromDate=2024-03-07&toDate=2024-05-31&counterId=0&paymentType=&particular=#C013/2024";
       
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
                    type: dailySalesActionType.FETCH_DALIY_SALES,
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


// export const fetchDailySales =
//     (loadReport.fromDate1,loadReport.tooDate1,Filter, isLoading = true) =>
//     async (dispatch) => {
//         if (isLoading) {
//             dispatch(setLoading(true));
//         }
//         apiConfig
//             .get(apiBaseURL.DAILY_SALES + "?fromDate=" +"'"+ fromDate1 +"'" + "&toDate=" +"'"+ tooDate1 +"'"
//     + "&counterId=0&paymentType&particular=#C013/2024" )
            
//             // console.log(apiBaseURL.CUSTOMERS + "?customerId=" + customerId)
//             .then((response) => {
//                 console.log(response)
//                 dispatch({
//                     type: dailySalesActionType.FETCH_DALIY_SALES,
//                     payload: response.data.data,
//                 });
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
