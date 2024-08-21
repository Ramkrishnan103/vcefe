import apiConfig from "../../config/apiConfig";
import {
  apiBaseURL,
  taxSetupActionType,
  toastType,
  Filters,
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

export const fetchTaxSetup =
  (filter = {}, isLoading = true) =>
  async (dispatch) => {
    if (isLoading) {
      dispatch(setLoading(true));
    }
    let url = apiBaseURL.GET_ALL_TAX;
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
          type: taxSetupActionType.FETCH_TAXSETUP,
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

// export const fetchAllunits = () => async (dispatch) => {
//     apiConfig
//         .get(apiBaseURL.UNITS)
//         .then((response) => {
//             dispatch({
//                 type: warehouseActionType.FETCH_UNITS,
//                 payload: response.data.data,
//             });
//         })
//         .catch(({ response }) => {
//             dispatch(
//                 addToast({ text: response.data.message, type: toastType.ERROR })
//             );
//         });
// };

export const fetchTaxSetups = (taxId, singleUnit) => async (dispatch) => {
  apiConfig
    .get(apiBaseURL.TAXSETUP + "/" + taxId, singleUnit)
    .then((response) => {
      dispatch({
        type: taxSetupActionType.FETCH_TAXSETUPS,
        payload: response?.data?.data,
      });
    })
    .catch(({ response }) => {
      dispatch(
        addToast({ text: response?.data?.message, type: toastType.ERROR })
      );
    });
};

export const addTaxSetup = (taxsetup,handleClose) => async (dispatch) => {
  
  console.log("handleClose=>",handleClose)
  await apiConfig
    .post(apiBaseURL.TAXSETUP, taxsetup)

    .then((response) => {
      console.log("response",response);

      if(response?.data?.success===true){
        dispatch(
          addToast({
            text: response?.data?.message,
          })
        );
        handleClose(false)
      }else{
        dispatch(
          addToast({ text: response?.data?.message, type: toastType?.ERROR })
        );
      }

      dispatch({
        type: taxSetupActionType.ADD_TAXSETUP,
        payload: response?.data?.data,
      });
      dispatch(fetchTaxSetup(Filters.OBJ));
     // handleClose(false);
     
      
      dispatch(addInToTotalRecord(1));
    })
    .catch(({ response }) => {
      dispatch(
        addToast({ text: response?.data?.message, type: toastType.ERROR })
      );
    });
};

export const editTaxSetup =
  (taxId, taxSetups, handleClose) => async (dispatch) => {
    console.log("handleClose=>",handleClose)
    apiConfig
      .post(apiBaseURL.TAXSETUP,taxSetups)
      .then((response) => {
        console.log(apiBaseURL.TAXSETUP,taxSetups)
        console.log("response",response);
        
        if(response?.data?.success===true){
          dispatch(
            addToast({
              text: response?.data?.message,
            })
          );
          handleClose(false)
        }else{
          dispatch(
            addToast({ text: response?.data?.message, type: toastType?.ERROR })
          )
         
        }
       // handleClose(false);
         dispatch(fetchTaxSetup());
        // dispatch({
        //     type: taxSetupActionType.EDIT_TAXSETUP,
        //     payload: response?.data?.data,
        // });
        console.log("handleClose=>",handleClose)
      
      dispatch(addInToTotalRecord(1));
    })
      .catch(({ response }) => {
        
        dispatch(
          addToast({text: response?.data?.message, type: toastType.ERROR})
        );
      });
  };

export const deleteTaxSetup = (taxId) => async (dispatch) => {
  apiConfig
    .delete(apiBaseURL.TAXSETUP + "?taxSetupId=" + taxId)
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
      dispatch(fetchTaxSetup());
      dispatch({ type: taxSetupActionType.DELETE_TAXSETUP, payload: taxId });
      
    })
    .catch(({ response }) => {
      dispatch(
        addToast({ text: response?.data?.message, type: toastType.ERROR })
      );
    });
};

// export const unitDropdown = (base_unit_value) => async (dispatch) => {
//     apiConfig.get(apiBaseURL.UNITS)
//         .then((response) => {
//             dispatch({
//                 type: unitsActionType.FETCH_UNITS,
//                 payload: response.data.data,
//             });
//         })
//         .catch(({ response }) => {
//             dispatch(addToast(
//                 { text: response.data.message, type: toastType.ERROR }));
//         });
// };
