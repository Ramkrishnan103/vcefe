import apiConfig from "../../config/apiConfig";
import { apiBaseURL, empDepartmentActionType, toastType } from "../../constants";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { setLoading } from "./loadingAction";
import { setSavingButton } from "./saveButtonAction";
import { addToast } from "./toastAction";
import { addInToTotalRecord, removeFromTotalRecord } from "./totalRecordAction";

export const fetchEmpDepartment =
    (filter = {}, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }

        let url = apiBaseURL.EMPDEPARTMENT;
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
                    type: empDepartmentActionType.FETCH_EMPDEPARTMENT,
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


 export const addEmpDepartment = (empDepartment,handleClose) => async (dispatch) => {
    console.log(empDepartment)
        dispatch(setSavingButton(true));

        await apiConfig
            .post(apiBaseURL.EMPDEPARTMENT, empDepartment)
            .then((response) => {
              console.log(response)
               
              if(response?.data?.success === true){
                dispatch(
                    addToast({
                        text: getFormattedMessage
                        (
                            "Data.success.create.message"
                        ),
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
                handleClose(true)
               
              }

                dispatch({
                    type: empDepartmentActionType.ADD_EMPDEPARTMENT,
                    payload: response?.data?.data,
                });
              
                
                dispatch(fetchEmpDepartment());
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




    export const fetchSpecificEmpDepartments =
    (departmentId, isLoading = true) =>
       
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        console.log("Department Id =>",departmentId)
        apiConfig
            .get(apiBaseURL.EMPDEPARTMENT + "?empDepartmentId=" + departmentId )
            
            // console.log(apiBaseURL.CUSTOMERS + "?customerId=" + customerId)
            .then((response) => {
                console.log(response)
                dispatch({
                    type: empDepartmentActionType.FETCH_EMPDEPARTMENTS,
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




    export const editEmpDepartment =
    (departmentId, empDepartments, handleClose) => async (dispatch) => {
    //   console.log("handleClose=>",handleClose)
      apiConfig
        .post(apiBaseURL.EMPDEPARTMENT,empDepartments)
        .then((response) => {
          console.log(apiBaseURL.EMPDEPARTMENT,empDepartments)
          console.log("response",response);
         
          if(response?.data?.success===true){
            dispatch(
              addToast({
                text: getFormattedMessage("Data.success.update.message"),
              })
            );
           
          }
          else{
            dispatch(
              addToast({ text: response?.data?.message, type: toastType?.ERROR })
            )
           
          }
         
        //   dispatch({
        //       type: empDepartmentActionType.EDIT_EMPDEPARTMENTS,
        //       payload: response?.data?.data,
        //   });

          handleClose(false);
          dispatch(fetchEmpDepartment());
          dispatch(setSavingButton(false));
         dispatch(addInToTotalRecord(1));
      })
        .catch(({ response }) => {
          
          dispatch(
            addToast({text: response?.data?.message, type: toastType.ERROR})
          );
        });
    };


    export const deleteEmpDepartment = (departmentId) => async (dispatch) => {
        apiConfig
          .delete(apiBaseURL.EMPDEPARTMENT + "?empDepartmentId=" + departmentId)
          .then((response) => {
            console.log(response)
            if(response?.data?.success===true){
              dispatch(
                addToast({
                  text: getFormattedMessage("Data.success.delete.message"),
                })
              );
            }else{
              dispatch(
                addToast({ text: response?.data?.message, type: toastType?.ERROR })
              );
            }
            dispatch(removeFromTotalRecord(1));
            dispatch(fetchEmpDepartment());
            dispatch({ 
                type: empDepartmentActionType.DELETE_EMPDEPARTMENT, 
                payload: departmentId });
          })
          .catch(({ response }) => {
            dispatch(
              addToast({ text: response.data.message, type: toastType.ERROR })
            );
          });
      };
      

