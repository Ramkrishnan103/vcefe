import moment from "moment";
import apiConfig from "../../config/apiConfig";
import { apiBaseURL, ledgerActionType, toastType } from "../../constants";
import { setLoading } from "./loadingAction";
import { setSavingButton } from "./saveButtonAction";
import { addToast } from "./toastAction";
import { addInToTotalRecord, removeFromTotalRecord } from "./totalRecordAction";
import { getFormattedMessage } from "../../shared/sharedMethod";

export const fetchLedger =
    (filter = {}, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        let url = apiBaseURL.LEDGER;
        console.log(url)
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
                dispatch({  
                    type: ledgerActionType.FETCH_LEDGER,
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

    export const fetchLedgers =
    (ledgerId, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        apiConfig
            .get(apiBaseURL.LEDGER + "?ledgerId=" + ledgerId )
            
            // console.log(apiBaseURL.CUSTOMERS + "?customerId=" + customerId)
            .then((response) => {
                console.log(response)
                dispatch({
                    type: ledgerActionType.FETCH_LEDGERS,
                    payload: response?.data.data,
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

    // MARK RAM FROM [12-07-2024]

 export const addLedger = (ledger,navigate) => async (dispatch) => {
    
    console.log(ledger)
        dispatch(setSavingButton(true));

      await apiConfig
            .post(apiBaseURL.LEDGER, ledger)
            .then((response) => {
              console.log(response)

              if(response?.data?.success == true){
                dispatch(
                    addToast({
                        text: getFormattedMessage(
                            "ledger.success.create.message"
                        ),
                    })
                );
                navigate("/app/ledger");
              }
              else{
                dispatch(
                    addToast({
                        text: response?.data?.message,
                        type: toastType?.ERROR,
                    })
                );
                navigate("/app/ledgers/create")
              }

                dispatch({
                    type: ledgerActionType.ADD_LEDGER,
                    payload: response?.data?.data,
                });
              
                
                dispatch(fetchLedger());
                dispatch(addInToTotalRecord(1));
                dispatch(setSavingButton(false));
            })
            .catch(({ response }) => {
                dispatch(setSavingButton(false));
                response &&
                    dispatch(
                        addToast({
                            text: response?.data?.message,
                            type: toastType.ERROR,
                        })
                    );
            });
    };    

    
export const editLedger =
(ledgerId, ledger, navigate) => async (dispatch) => {

    console.log("Ledger Id  => ",ledgerId)
    dispatch(setSavingButton(true));
   
  apiConfig
        .post(apiBaseURL.LEDGER,ledger)
       
       //console.log(apiBaseURL.CUSTOMERS + "?customerId=" + customerId )
        .then((response) => {
            console.log(apiBaseURL.LEDGER,ledger)
            console.log(response)

            if(response?.data?.success == false){
                dispatch(
                    addToast({
                        text: response?.data?.message,
                        type: toastType.ERROR,
                    })
                );
            }
            else{
                dispatch(
                    addToast({
                        text: getFormattedMessage(
                            "ledger.success.edit.message"
                        ),
                    })
                );
            }
            
            dispatch({
                type: ledgerActionType.EDIT_LEDGER,
                payload: response?.data?.data,
            });      
           
            navigate("/app/ledger");
            dispatch(setSavingButton(false));
        })
        .catch(({ response }) => {
            dispatch(setSavingButton(false));
            dispatch(
                addToast({
                    text: response?.data?.message,
                    type: toastType.ERROR,
                })
             );
        });
};
   
 

export const deleteLedger = (ledgerId) => async (dispatch) => {
    apiConfig
        .delete(apiBaseURL.LEDGER + "?ledgerId=" + ledgerId)
        .then((response) => {
            console.log("URL => ",apiBaseURL.LEDGER + "?ledgerId=" + ledgerId)
            console.log(response)
            // debugger
            if(response?.data?.success == false){
                dispatch(
                    addToast({
                        text: response?.data?.message,
                        type: toastType.ERROR,
                    })
                );

            }
            else{
                dispatch(
                    addToast({
                        text: getFormattedMessage(
                            "ledger.success.delete.message"
                        ),
                    })
                );
                dispatch(removeFromTotalRecord(1));
            }

            dispatch(fetchLedger());
            
           
        })
        .catch(({ response }) => {
            response &&
                dispatch(
                    addToast({
                        text: response.data.message,
                        type: toastType.ERROR,
                    })
                );
        });
};
  // MARK RAM TO [12-07-2024]