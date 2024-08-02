import apiConfig from "../../config/apiConfig";
import { apiBaseURL, toastType, companyConfigActionType } from "../../constants";
import requestParam from "../../shared/requestParam";
import { addToast } from "./toastAction";
import {
    addInToTotalRecord,
    removeFromTotalRecord,
    setTotalRecord,
} from "./totalRecordAction";
import { setLoading } from "./loadingAction";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { setSavingButton } from "./saveButtonAction";
import { callImportProductApi } from "./importProductApiAction";
import moment from "moment";

export const fetchCompanyConfig =
    (filter = {}, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        let url = apiBaseURL.COMPANY_CONFIG;
        console.log(url)
        await apiConfig
            .get(url)
            .then((response) => {
                console.log('config company response',response)
                dispatch({
                    type: companyConfigActionType.FETCH_COMPANY_CONFIG,
                    payload: response?.data?.data,
                  
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
    
// export const fetchCustomer =
//     (customerId, isLoading = true) =>
//     async (dispatch) => {
//         if (isLoading) {
//             dispatch(setLoading(true));
//         }
//         apiConfig
//             .get(apiBaseURL.CUSTOMERS + "/" + customerId)
//             .then((response) => {
//                 dispatch({
//                     type: customerActionType.FETCH_CUSTOMER,
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

// export const addCustomer = (supplier, navigate) => async (dispatch) => {
//     dispatch(setSavingButton(true));
//     await apiConfig
//         .post(apiBaseURL.CUSTOMERS, supplier)
//         .then((response) => {
//             dispatch({
//                 type: customerActionType.ADD_CUSTOMER,
//                 payload: response.data.data,
//             });
//             dispatch(
//                 addToast({
//                     text: getFormattedMessage(
//                         "customer.success.create.message"
//                     ),
//                 })
//             );
//             navigate("/app/customers");
//             dispatch(addInToTotalRecord(1));
//             dispatch(setSavingButton(false));
//         })
//         .catch(({ response }) => {
//             dispatch(setSavingButton(false));
//             response &&
//                 dispatch(
//                     addToast({
//                         text: response.data.message,
//                         type: toastType.ERROR,
//                     })
//                 );
//         });
// };


// export const editCompanyConfig =
//   (companyName,  handleClose) => async (dispatch) => {
//     apiConfig
//       .post(apiBaseURL.COMPANY_CONFIG, companyName)
//       .then((response) => {
//         console.log(apiBaseURL.COMPANY_CONFIG, companyName);
//         dispatch(fetchCompanyConfig());
//         // dispatch({
//         //     type: taxSetupActionType.EDIT_TAXSETUP,
//         //     payload: response.data.data,
//         // });

//         handleClose(false);
//         dispatch(
//           addToast({
//             text: getFormattedMessage("taxSetup.success.edit.message"),
//           })
//         );
//       })
//       .catch(({ response }) => {
//         dispatch(
//           addToast({ text: response.data.message, type: toastType.ERROR })
//         );
//       });
//   };

  export const editCompanyConfig =
  (data) => async (dispatch) => {
    
      console.log('ACTION :: EDIT COMPANYCONFIG',data)
      dispatch(setSavingButton(true));
      await apiConfig
          .post(apiBaseURL.COMPANY_CONFIG,data)
          .then((response) => {
            // companyImage.append("itemId",companyId)
            // console.log(apiBaseURL.COMPANY_CONFIG,data)
                  console.log(response)
           
            dispatch(
                addToast({
                    text: getFormattedMessage(
                        "companyconfig.success.edit.message"
                    ),
                })
            );
                //   dispatch({
                //     type: companyConfigActionType.EDIT_COMPANY_CONFIG,
                //     payload: response.data.data,
                // });
             
               dispatch(setSavingButton(false));
      
          })
          .catch(({ response }) => {
              dispatch(setSavingButton(false));
              dispatch(
                  addToast({
                      text: response.data.message,
                      type: toastType.ERROR,
                  })
              );
          });
  };