
import apiConfig from "../../config/apiConfig";
import { apiBaseURL, empDesignationActionType, toastType } from "../../constants";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { setLoading } from "./loadingAction";
import { setSavingButton } from "./saveButtonAction";
import { addToast } from "./toastAction";
import { addInToTotalRecord, removeFromTotalRecord } from "./totalRecordAction";

export const fetchEmpDesignation =
    (filter = {}, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }

        let url = apiBaseURL.EMPDESIGNATION;
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
               console.log("Resonse",response)

                dispatch({
                    type: empDesignationActionType.FETCH_EMPDESIGNATION,
                    payload: response?.data?.data,
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


    export const addEmpDesignation= (empDesignation,handleClose) => async (dispatch) => {
        console.log(empDesignation)
            dispatch(setSavingButton(true));
    
            await apiConfig
                .post(apiBaseURL.EMPDESIGNATION, empDesignation)
                .then((response) => {
                  console.log(response)
                   
                  if(response?.data?.success === true){
                    dispatch(
                        addToast({
                          text: response?.data?.message,
                        })
                    );
                    handleClose(false)
                    // navigate("/app/emp");
                  }
                  else{
                    dispatch(
                        addToast({
                            text: response?.data?.message,
                            type: toastType?.ERROR,
                        })
                    );
                    // handleClose(true)
                   
                  }
    
                    dispatch({
                        type: empDesignationActionType.ADD_EMPDESIGNATION,
                        payload: response?.data?.data,
                    });
                  
                    
                    dispatch(fetchEmpDesignation());
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

        


  export const fetchSpecificEmpDesignations =
        (designationId, isLoading = true) =>
           
        async (dispatch) => {
            if (isLoading) {
                dispatch(setLoading(true));
            }
            console.log("Department Id =>",designationId)
            apiConfig
                .get(apiBaseURL.EMPDESIGNATION + "?empDesignationId=" + designationId )
                
                // console.log(apiBaseURL.CUSTOMERS + "?customerId=" + customerId)
                .then((response) => {
                    console.log(response)
                    dispatch({
                        type: empDesignationActionType.FETCH_EMPDESIGNATIONS,
                        payload: response?.data?.data,
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
    
    
    
    
        export const editEmpDesignation=
        (designationId, empDesignations, handleClose) => async (dispatch) => {
        //   console.log("handleClose=>",handleClose)
          apiConfig
            .post(apiBaseURL.EMPDESIGNATION,empDesignations)
            .then((response) => {
              console.log(apiBaseURL.EMPDESIGNATION,empDesignations)
              console.log("response",response);
             
              if(response?.data?.success===true){
                dispatch(
                  addToast({
                    text: response?.data?.message,
                  })
                );
                handleClose(false);
              }
              else{
                dispatch(
                  addToast({ text: response?.data?.message, type: toastType?.ERROR })
                )
               
              }
             
              // dispatch({
              //     type: empDesignationActionType.EDIT_EMPDESIGNATION,
              //     payload: response?.data?.data,
              // });
    
            
              dispatch(fetchEmpDesignation());
              dispatch(setSavingButton(false));
             dispatch(addInToTotalRecord(1));
          })
            .catch(({ response }) => {
              
              dispatch(
                addToast({text: response?.data?.message, type: toastType.ERROR})
              );
            });
        };



 export const deleteEmpDesignation = (designationId) => async (dispatch) => {
            apiConfig
              .delete(apiBaseURL.EMPDESIGNATION + "?empDesignationId=" + designationId)
              .then((response) => {
                console.log(response)
                if(response?.data?.success===true){
                  dispatch(
                    addToast({
                      text: response?.data?.message,
                    })
                  );
                }else{
                  dispatch(
                    addToast({ text: response?.data?.message, type: toastType?.ERROR })
                  );
                }
                dispatch(removeFromTotalRecord(1));
                dispatch(fetchEmpDesignation());
                dispatch({ 
                    type: empDesignationActionType.DELETE_EMPDESIGNATION, 
                    payload: designationId });
              })
              .catch(({ response }) => {
                dispatch(
                  addToast({ text: response.data.message, type: toastType.ERROR })
                );
              });
          };
          
    
    