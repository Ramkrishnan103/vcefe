
import apiConfig from "../../config/apiConfig";
import { apiBaseURL, empDesignationActionType, salaryDetailActionType, toastType } from "../../constants";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { setLoading } from "./loadingAction";
import { addToast } from "./toastAction";
import { removeFromTotalRecord } from "./totalRecordAction";

export const fetchSalaryDetails=
    (filter = {}, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }

        let url = apiBaseURL.SALARYDETAILS;
        console.log(url)
       
        apiConfig
            .get(url)
            .then((response) => {
               console.log("Resonse",response)

                dispatch({
                    type: salaryDetailActionType.FETCH_SALARYDEATILS,
                    payload: response?.data,
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


    export const fetchSalaryDetailsFilter=
    (value,filter = {}, isLoading = true, mode) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }

        let url = apiBaseURL.SALARYDETAILS+value;
        console.log(url)
       
        apiConfig
            .get(url)
            .then((response) => {
               console.log("Resonse",response)
               let res = response.data["mode"] = mode;
               console.log(response.data)
                dispatch({
                    type: salaryDetailActionType.FETCH_SLARAYdETAILS_FILTER,
                    payload: response?.data,
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



    export const deleteSalaryDetails = (data, navigate) => async (dispatch) => {
        debugger
        await apiConfig
          .post(apiBaseURL.SALARYDETAILS, data)
          //console.log(apiBaseURL.USERS,supplier)
          .then((response) => {
            console.log("URL : ",apiBaseURL.SALARYDETAILS, data)
            console.log(response)

            // dispatch({
            //   type: salaryDetailActionType.DELETE_SALARYDETIALS,
            //   payload: response.data.data,
            // });
            if (response?.data?.success == false) {
              dispatch(
                addToast({
                  text: getFormattedMessage(
                    response?.data?.message
                  ),
                })
                
              );
            dispatch(removeFromTotalRecord(1));
            dispatch(fetchSalaryDetails());
            
            //   window.location.href = "#/app/salaryPreparationListPage";
            } else {
              dispatch(
                addToast({
                  type: toastType.ERROR,
                  text: getFormattedMessage(response?.data?.message),
                })
              );
            }
           
          })
          .catch(({ response }) => {
            response &&
              dispatch(
                addToast({
                  text: response?.data?.message,
                  type: toastType.ERROR,
                })
              );
          });
      };
