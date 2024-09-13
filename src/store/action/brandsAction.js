import apiConfig from "../../config/apiConfig";
import {
  apiBaseURL,
  brandsActionType,
  toastType,
  brandFormActionType,
} from "../../constants";
import requestParam from "../../shared/requestParam";
import { addToast } from "./toastAction";
import {
  addInToTotalRecord,
  setTotalRecord,
  removeFromTotalRecord,
} from "./totalRecordAction";
import { setLoading } from "./loadingAction";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { callUpdateBrandApi } from "./updateBrand";
import { setSavingButton } from "./saveButtonAction";

export const fetchBrands =
  (filter = {}, isLoading = true, isFilterModal = false) =>
    async (dispatch) => {
      if (isLoading) {
        dispatch(setLoading(true));
      }
      let url = apiBaseURL.BRANDS;
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
          console.log("JUST CHECK:::result_got", result_got);
          const adding_all = {
            type: "Product-Group",
            category1Id: 0,
            attributes: {
              name: "ALL",
            },
          };
          const result_modified = [adding_all, ...result_got];
          console.log("JUST CHECK:::result_modified", result_modified);
          const result_final = isFilterModal ? result_modified : result_got;
          dispatch({
            type: brandsActionType.FETCH_BRANDS,
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
              text: response.data.message,
              type: toastType.ERROR,
            })
          );
        });
    };

export const fetchBrand = (brandsId, singleUser) => async (dispatch) => {
  apiConfig
    .get(apiBaseURL.BRANDS + "/" + brandsId, singleUser)
    .then((response) => {
      dispatch({
        type: brandsActionType.FETCH_BRAND,
        payload: response.data.data,
      });
    })
    .catch(({ response }) => {
      dispatch(
        addToast({ text: response.data.message, type: toastType.ERROR })
      );
    });
};

export const addBrand = (brands, handleClose, handleBrandClose) => async (dispatch) => {
  await apiConfig
    .post(apiBaseURL.BRANDS, brands)
    .then((response) => {
      dispatch({
        type: brandsActionType.ADD_BRANDS,
        payload: response?.data?.data,
      });
      debugger
      if (response?.data?.success == true) {
        dispatch(
          addToast({ text: response?.data?.message, type: toastType.SUCCESS })
        );
        handleClose && handleClose(false);
        handleBrandClose && handleBrandClose(false);
        dispatch(fetchBrands());

      } else {
        dispatch(
          addToast({ text: response?.data?.message, type: toastType.ERROR })
        );
      }
      dispatch(addInToTotalRecord(1));
    })
    .catch(({ response }) => {
      // dispatch(
      //   addToast({ text: response?.data?.message, type: toastType.ERROR })
      // );
    });
};

export const editBrand =
  (brandsId, brands, handleClose) => async (dispatch) => {
    apiConfig
      .post(apiBaseURL.BRANDS, brands)
      .then((response) => {
        // dispatch(callUpdateBrandApi(true));
        // dispatch({type: productActionType.ADD_IMPORT_PRODUCT, payload: response.data.data});
        //// handleClose(false);
        // dispatch({
        //   type: brandsActionType.EDIT_BRANDS,
        //   payload: response?.data?.data,
        // });
        if (response?.data?.success == true) {
          dispatch(
            addToast({
              text: response?.data?.message,
              type: toastType.SUCCESS,
            })
          )
          handleClose(false)
          dispatch({
            type: brandFormActionType.FORM_CLOSE,
            payload: false,
          });
          dispatch(fetchBrands());
        } else {
          dispatch(
            addToast({
              text: response?.data?.message,
              type: toastType.ERROR,
            })
          ); dispatch({
            type: brandFormActionType.FORM_CLOSE,
            payload: false,
          });
        }
        dispatch(addInToTotalRecord(1));
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

export const deleteBrand = (brandsId) => async (dispatch) => {
  debugger
  apiConfig
    .delete(apiBaseURL.BRANDS + "?categoryId=" + brandsId)
    .then((response) => {
      dispatch(removeFromTotalRecord(1));
      console.log(response);
      dispatch({
        type: brandsActionType.DELETE_BRANDS,
        payload: brandsId,
      });
      if (response.data.success == true) {
        dispatch(
          addToast({
            text: response?.data?.message,
            type: toastType.SUCCESS,
          })
        )
        dispatch(fetchBrands());
      } else {
        dispatch(
          addToast({
            text: response?.data?.message,
            type: toastType.ERROR,
          })
        );
      }

      dispatch(fetchBrands());
    })
    .catch(({ response }) => {
      // dispatch(
      //   addToast({ text: response?.data?.message, type: toastType.ERROR })
      // );
    });
};

export const fetchAllBrands = () => async (dispatch) => {
  apiConfig
    .get(apiBaseURL.BRANDS)
    .then((response) => {
      dispatch({
        type: brandsActionType.FETCH_ALL_BRANDS,
        payload: response?.data?.data,
      });
    })
    .catch(({ response }) => {
      dispatch(
        addToast({ text: response?.data?.message, type: toastType.ERROR })
      );
    });
};

export const brandDropdown = (base_unit_value) => async (dispatch) => {
  apiConfig
    .get(apiBaseURL.BRANDS)
    .then((response) => {
      dispatch({
        type: brandsActionType.FETCH_BRANDS,
        payload: response?.data?.data,
      });
    })
    .catch(({ response }) => {
      dispatch(
        addToast({ text: response.data.message, type: toastType.ERROR })
      );
    });
};
