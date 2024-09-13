
import apiConfig from "../../config/apiConfig";
import { apiBaseURL, empDesignationActionType, payrollReport, salaryDetailActionType, salaryListingall, toastType } from "../../constants";
import { getFormattedMessage } from "../../shared/sharedMethod";
// import { setLoader } from "./loaderAction";
// import { setLoading } from "./loadingAction";
import { addToast } from "./toastAction";

export const fetchSalaryDetails =
  (filter = {}, isLoading = true) =>
    async (dispatch) => {
      if (isLoading) {
        // dispatch(setLoading(true));
      }

      let url = apiBaseURL.SALARYDETAILS;
      console.log(url)

      apiConfig
        .get(url)
        .then((response) => {
          console.log("Resonse", response)

          dispatch({
            type: salaryDetailActionType.FETCH_SALARYDEATILS,
            payload: response?.data,
          });


          if (isLoading) {
            // dispatch(setLoading(false));
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


// export const fetchSalaryDetailsFilter =
//   (value, filter = {}, isLoading = true) =>
//     async (dispatch) => {
//       if (isLoading) {
//         dispatch(setLoading(true));
//       }

//       let url = apiBaseURL.SALARYDETAILS + value;
//       console.log(url)

//       apiConfig
//         .get(url)
//         .then((response) => {
//           console.log("Resonse", response)

//           // if (response?.data?.success == true) {
//           dispatch({
//             type: salaryListingall.FETCH_SLARAYDETAILS_FILTER,
//             payload: response?.data,
//           });
//           if (isLoading) {
//             dispatch(setLoading(false));
//           }
//           window.location.href = "#/app/salaryPreparationListPage";
//           // }
//         })
//         .catch(({ response }) => {
//           dispatch(
//             addToast({
//               text: response?.data?.message,
//               type: toastType.ERROR,
//             })
//           );
//         });
//     };

export const fetchSalaryDetailsFilter =
  (value, filter = {}, isLoading = true, mode) =>
    async (dispatch) => {
      if (isLoading) {
        // dispatch(setLoading(true));
      }

      let url = apiBaseURL.SALARYDETAILS + value;
      console.log(url)
      dispatch(setLoader(true))
      apiConfig
        .get(url)
        .then((response) => {
          console.log("Resonse", response)
          let res = response.data["mode"] = mode;
          console.log(response.data)
          dispatch({
            type: salaryListingall.FETCH_SLARAYDETAILS_FILTER,
            payload: response?.data,
          });
          if (response?.data?.success == true) {
            if (mode != 'print') {
              window.location.href = "#/app/salaryPreparationListPage";
            }
            dispatch(setLoader(false))
          } else {
            dispatch(setLoader(false))
            dispatch(
              addToast({
                text: response?.data?.message,
                type: toastType.ERROR,
              })
            )
          }
          if (isLoading) {
            dispatch(setLoading(false));
          }
          // window.location.href = "#/app/salaryPreparationListPage";
        })
        .catch(({ response }) => {
          dispatch(setLoader(false))
          dispatch(
            addToast({
              text: response?.data?.message,
              type: toastType.ERROR,
            })
          );
        });
    };

    export const addSalaryDetails = (data, navigate, lock) => async (dispatch) => {
      try {
        const response = await apiConfig.post(apiBaseURL.SALARYDETAILS, data);
    
        if (response?.data?.success) {
          dispatch({
            type: salaryDetailActionType.ADD_SALARYDEATILS,
            payload: response?.data?.data,
          });
    
          dispatch(
            addToast({
              text: getFormattedMessage(response?.data?.message),
            })
          );
    
          if (!lock) {
            window.location.href = "#/app/salaryPreparation";
          }
    
          return true; // Indicate success
        } else {
          dispatch(
            addToast({
              type: toastType.ERROR,
              text: getFormattedMessage(response?.data?.message),
            })
          );
          return false; // Indicate failure
        }
      } catch (error) {
        const { response } = error;
        if (response) {
          dispatch(
            addToast({
              text: response?.data?.message,
              type: toastType.ERROR,
            })
          );
        }
        return false; // Indicate failure due to error
      }
    };
    
    export const lockSalaryDetails = (data, navigate, details) => async (dispatch) => {
      const addSuccess = await dispatch(addSalaryDetails(details, navigate, true));
      
      if (addSuccess) {
        try {
          const response = await apiConfig.post(apiBaseURL.SALARYLOCK, data);
          
          if (response?.data?.success) {
            dispatch({
              type: salaryDetailActionType.LOCK_SALARYDEATILS,
              payload: response?.data?.data,
            });
    
            dispatch(
              addToast({
                text: getFormattedMessage(response?.data?.message),
              })
            );
    
            window.location.href = "#/app/salaryPreparation";
          } else {
            dispatch(
              addToast({
                type: toastType.ERROR,
                text: getFormattedMessage(response?.data?.message),
              })
            );
          }
        } catch (error) {
          const { response } = error;
          if (response) {
            dispatch(
              addToast({
                text: response?.data?.message,
                type: toastType.ERROR,
              })
            );
          }
        }
      } else {
        // dispatch(
        //   addToast({
        //     text: response?.data?.message,
        //     type: toastType.ERROR,
        //   })
        // );
      }
    };

export const deleteSalaryDetails = (data, navigate) => async (dispatch) => {
  debugger
  await apiConfig
    .post(apiBaseURL.SALARYDETAILS, data)
    //console.log(apiBaseURL.USERS,supplier)
    .then((response) => {
      console.log("URL : ", apiBaseURL.SALARYDETAILS, data)
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
        dispatch(fetchSalaryDetails());

        dispatch(removeFromTotalRecord(1));

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

export const fetchSalaryDetailsReportFilter =
  (value, filter = {}, isLoading = true, mode) =>
    async (dispatch) => {
      if (isLoading) {
        // dispatch(setLoading(true));
      }

      let url = apiBaseURL.PAYROLLDETAILS + value;
      console.log(url)
      dispatch(setLoader(true))
      apiConfig
        .get(url)
        .then((response) => {
          console.log("Resonse", response)
          let res = response.data["mode"] = mode;
          console.log(response.data)
          dispatch({
            type: payrollReport.FETCH_REPORT,
            payload: response?.data,
          });
          if (response?.data?.success == true) {
            // if (mode != 'print') {
            //   window.location.href = "#/app/salaryPreparationListPage";
            // }
            dispatch(setLoader(false))
          } else {
            dispatch(setLoader(false))
            dispatch(
              addToast({
                text: response?.data?.message,
                type: toastType.ERROR,
              })
            )
          }
          if (isLoading) {
            // dispatch(setLoading(false));
          }
          // window.location.href = "#/app/salaryPreparationListPage";
        })
        .catch(({ response }) => {
          dispatch(setLoader(false))
          dispatch(
            addToast({
              text: response?.data?.message,
              type: toastType.ERROR,
            })
          );
        });
    };