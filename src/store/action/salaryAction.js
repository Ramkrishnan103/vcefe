import apiConfig from "../../config/apiConfig";
import { apiBaseURL, productActionType, salaryActionType, singleSalary, toastType } from "../../constants";
import { addToast } from "./toastAction";
import {
  setTotalRecord,
  addInToTotalRecord,
  removeFromTotalRecord,
} from "./totalRecordAction";
import { setLoading } from "./loadingAction";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { setSavingButton } from "./saveButtonAction";

export const fetchSalary = (filter = {}, isLoading = true) => async (dispatch) => {
  if (isLoading) {
    dispatch(setLoading(true));
  }
  let url = apiBaseURL.SALARY;
  apiConfig.get(url)
    .then((response) => {
      console.log("response", response)
      dispatch({
        type: salaryActionType.FETCH_SALARY,
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
}

// export const fetchSingleSalary =
//     (Id, singleProduct, isLoading = true) =>
//         async (dispatch) => {
//             debugger
//             console.log("Fetch Product Action Id", Id);
//             console.log("Fetch Product Action singleProduct", singleProduct);
//             if (isLoading) {
//                 dispatch(setLoading(true));
//             }
//             await apiConfig
//                 .get(apiBaseURL.SALARY + "?salaryConfigId=" + Id)
//                 .then((response) => {
//                     console.log("Fetch Product Action response", response);
//                     if (response?.data?.success) {
//                         dispatch({
//                             type: singleSalary.FETCH_SINGLE_SALARY,
//                             payload: response?.data?.data,
//                         });
//                         if (isLoading) {
//                             dispatch(setLoading(false));
//                         }
//                     } else {
//                         dispatch(
//                             addToast({
//                                 text: response?.data?.message,
//                                 type: toastType.ERROR,
//                             })
//                         );
//                     }

//                 })
//                 .catch(({ response }) => {
//                     dispatch(
//                         addToast({
//                             text: response?.data?.message,
//                             type: toastType.ERROR,
//                         })
//                     );
//                 });
//         };

// export const addSalary = (data, navigate) => async (dispatch) => {
//   debugger
//   dispatch(setSavingButton(true));
//   await apiConfig
//     .post(apiBaseURL.SALARY, data)
//     //console.log(apiBaseURL.USERS,supplier)
//     .then((response) => {
//       console.log(response)
//       dispatch({
//         type: singleSalary.ADD_SALARY,
//         payload: response.data.data,
//       });
//       if (response?.data?.success) {
//         dispatch(
//           addToast({
//             text: getFormattedMessage(
//               response?.data?.message
//             ),
//           })
//         );
//         window.location.href = "#/app/salary";
//       } else {
//         dispatch(
//           addToast({
//             type: toastType.ERROR,
//             text: getFormattedMessage(response?.data?.message),
//           })
//         );
//       }

//     })
//     .catch(({ response }) => {
//       dispatch(setSavingButton(false));
//       response &&
//         dispatch(
//           addToast({
//             text: response.data.message,
//             type: toastType.ERROR,
//           })
//         );
//     });
// };

// export const editSalary =
//     (data) => async (dispatch) => {
//         console.log("ACTION :: EDIT PRODUCTS");
//         dispatch(setSavingButton(true));
//         await apiConfig
//             .post(apiBaseURL.SALARY, data)
//             .then((response) => {
//                 //   productImage.append("itemId", productId);
//                 //   dispatch(addProductImage(productImage, navigate));
//                 //   navigate("/app/products");
//                 dispatch({
//                     type: singleSalary.EDIT_SALARY,
//                     payload: response.data.data,
//                 });
//                 if (response?.data?.success) {
//                     dispatch(
//                         addToast({
//                             text: getFormattedMessage(response?.data?.message),
//                         })
//                     );
//                     // window.location.href = "#/app/salary";
//                 } else {
//                     dispatch(
//                         addToast({
//                             type: toastType.ERROR,
//                             text: getFormattedMessage(response?.data?.message),
//                         })
//                     );
//                 }
//                 dispatch(fetchSalary());

//             })
//             .catch(({ response }) => {
//                 dispatch(setSavingButton(false));
//                 // dispatch(
//                 //     addToast({
//                 //         text: response?.data?.message,
//                 //         type: toastType.ERROR,
//                 //     })
//                 // );
//             });
//     };