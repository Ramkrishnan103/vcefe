import apiConfig from "../../config/apiConfig";
import {
  apiBaseURL,
  unitsActionType,
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

export const fetchUnits =
  (filter = {}, isLoading = true) =>
    async (dispatch) => {
      if (isLoading) {
        dispatch(setLoading(true));
      }
      let url = apiBaseURL.UNITS;
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
            type: unitsActionType.FETCH_UNITS,
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

export const fetchAllunits = () => async (dispatch) => {
  apiConfig
    .get(apiBaseURL.UNITS)
    .then((response) => {
      dispatch({
        type: warehouseActionType.FETCH_UNITS,
        payload: response.data.data,
      });
    })
    .catch(({ response }) => {
      dispatch(
        addToast({ text: response.data.message, type: toastType.ERROR })
      );
    });
};

export const fetchUnit = (unitid, singleUnit) => async (dispatch) => {
  apiConfig
    .get(apiBaseURL.UNITS + "/" + unitid, singleUnit)
    .then((response) => {
      dispatch({
        type: unitsActionType.FETCH_UNIT,
        payload: response.data.data,
      });
    })
    .catch(({ response }) => {
      dispatch(
        addToast({ text: response.data.message, type: toastType.ERROR })
      );
    });
};

export const addUnit = (units,handleClose, handleUnitClose) => async (dispatch) => {
  await apiConfig
    .post(apiBaseURL.UNITS, units)
    .then((response) => {
      console.log("addUnit Response", response);
      dispatch({
        type: unitsActionType.ADD_UNIT,
        payload: response.data.data,
      });
      dispatch(fetchUnits(Filters.OBJ));
      if (response?.data?.success == false) {
        dispatch(
          addToast({
            text: getFormattedMessage(response?.data?.message),
            type: toastType.ERROR,
          })
        );
      } else {
        dispatch(
          addToast({
            text: response?.data?.message,
          })
        );
        handleClose && handleClose(false);
        handleUnitClose && handleUnitClose(false);
      }

      dispatch(addInToTotalRecord(1));
    })
    .catch(({ response }) => {
      console.log("addUnit Error Response", response);
      // dispatch(
      //   addToast({ text: response?.data?.message, type: toastType.ERROR })
      // );
    });
};

export const editUnit = (unitid, units, handleClose) => async (dispatch) => {
  apiConfig
    .post(apiBaseURL.UNITS, units)
    .then((response) => {
      // dispatch({
      //     type: unitsActionType.EDIT_UNIT,
      //     payload: response.data.data,
      // });
     // handleClose(false);
      if (response?.data?.success == true) {
        dispatch(
          addToast({
            text: response?.data?.message,
          })
        );
        handleClose(false)
      dispatch(fetchUnits());

      } else {
        dispatch(
          addToast({ text: response?.data?.message, type: toastType.ERROR })
        );
      }
    })
    .catch(({ response }) => {
      dispatch(
        addToast({ text: response?.data?.message, type: toastType.ERROR })
      );
    });
};

export const deleteUnit = (unitid) => async (dispatch) => {
  apiConfig
    .delete(apiBaseURL.UNITS + "?unitid=" + unitid)
    .then((response) => {
      dispatch(removeFromTotalRecord(1));
      dispatch({ type: unitsActionType.DELETE_UNIT, payload: unitid });
      if (response.data.success == true) {
      dispatch(
        addToast({
          text: response?.data?.message,
        })
      );
    } else {
      dispatch(
        addToast({ text: response?.data?.message, type: toastType.ERROR })
      );
    }
      dispatch(fetchUnits());
    })
    .catch(({ response }) => {
      dispatch(
        addToast({ text: response?.data?.message, type: toastType.ERROR })
      );
    });
};

export const unitDropdown = (base_unit_value) => async (dispatch) => {
  apiConfig
    .get(apiBaseURL.UNITS)
    .then((response) => {
      dispatch({
        type: unitsActionType.FETCH_UNITS,
        payload: response.data.data,
      });
    })
    .catch(({ response }) => {
      dispatch(
        addToast({ text: response.data.message, type: toastType.ERROR })
      );
    });
};
