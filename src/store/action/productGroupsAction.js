import apiConfig from "../../config/apiConfig";
import {
  apiBaseURL,
  toastType,
  productGroupsActionType,
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

export const fetchProductGroups =
  (filter = {}, isLoading = true, isFilterModal = false) =>
  async (dispatch) => {
    if (isLoading) {
      dispatch(setLoading(true));
    }
    let url = apiBaseURL.PRODUCT_GROUPS;
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
        const result_got = response?.data?.data;
        const adding_all = {
          type: "Product-Group",
          category3Id: 0,
          attributes: {
            name: "ALL",
          },
        };
        const result_modified = [adding_all, ...result_got];
        const result_final = isFilterModal ? result_modified : result_got;
        dispatch({
          type: productGroupsActionType.FETCH_PRODUCT_GROUPS,
          payload: result_final,
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
            text: response?.data?.message,
            type: toastType.ERROR,
          })
        );
      });
  };

export const fetchProductGroup = (unitId, singleUnit) => async (dispatch) => {
  apiConfig
    .get(apiBaseURL.PRODUCT_GROUPS + "/" + unitId, singleUnit)
    .then((response) => {
      dispatch({
        type: productGroupsActionType.FETCH_PRODUCT_GROUP,
        payload: response.data.data,
      });
    })
    .catch(({ response }) => {
      dispatch(
        addToast({ text: response.data.message, type: toastType.ERROR })
      );
    });
};

export const addProductGroup = (product_groups,handleClose) => async (dispatch) => {
  await apiConfig
    .post(apiBaseURL.PRODUCT_GROUPS, product_groups)
    .then((response) => {
      if (response?.data?.success ==  true) {
        dispatch(
          addToast({ text: response?.data?.message, type: toastType.SUCCESS })
        );
        handleClose(false)
        dispatch(fetchAllProductGroups());
      }else {
        dispatch(
          addToast({ text: response?.data?.message, type: toastType.ERROR })
        );
      }
    })
    .catch(({ response }) => {
      dispatch(
        addToast({ text: response.data.message, type: toastType.ERROR })
      );
    
    })
    
};

export const editProductGroup =
  (unitId, units, handleClose) => async (dispatch) => {
    apiConfig
      .post(apiBaseURL.PRODUCT_GROUPS, units)
      .then((response) => {
        //dispatch(fetchProductGroups());
        // dispatch({
        //   type: productGroupsActionType.EDIT_PRODUCT_GROUP,
        //   payload: response.data.data,
        // });
       // handleClose(false);
        if (response?.data?.success == true) {
        dispatch(
          addToast({
            text: getFormattedMessage("product-group.success.edit.message"),
          })
        );
        handleClose(false)
        dispatch(fetchProductGroups());
      } else {
        dispatch(
          addToast({
            text: getFormattedMessage(response?.data?.message),
            type: toastType.ERROR,
          })
        );
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

export const deleteProductGroup = (unitId) => async (dispatch) => {
  apiConfig
    .delete(apiBaseURL.PRODUCT_GROUPS + "?category3Id=" + unitId)
    .then((response) => {
      dispatch(removeFromTotalRecord(1));
      dispatch({
        type: productGroupsActionType.DELETE_PRODUCT_GROUP,
        payload: unitId,
      });

      if (response?.data?.success == true) {
      dispatch(
        addToast({
          text: getFormattedMessage("product-group.success.delete.message"),
        })
      );
    } else {
      dispatch(
        addToast({
          text: getFormattedMessage(response?.data?.message),
          type: toastType.ERROR,
        })
      );
    }
      dispatch(fetchProductGroups(Filters.OBJ));
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

export const fetchAllProductGroups = () => async (dispatch) => {
  apiConfig
    .get(apiBaseURL.PRODUCT_GROUPS)
    .then((response) => {
      dispatch({
        type: productGroupsActionType.FETCH_ALL_PRODUCT_GROUPS,
        payload: response.data.data,
      });
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

export const productGroupDropdown = (base_unit_value) => async (dispatch) => {
  apiConfig
    .get(apiBaseURL.PRODUCT_GROUPS)
    .then((response) => {
      dispatch({
        type: productGroupsActionType.FETCH_PRODUCT_GROUPS,
        payload: response.data.data,
      });
    })
    .catch(({ response }) => {
      dispatch(
        addToast({ text: response.data.message, type: toastType.ERROR })
      );
    });
};
