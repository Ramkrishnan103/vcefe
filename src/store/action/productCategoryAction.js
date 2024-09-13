import apiConfig from "../../config/apiConfig";
import {
  apiBaseURL,
  productCategoriesActionType,
  toastType,
} from "../../constants";
import { addToast } from "./toastAction";
import {
  addInToTotalRecord,
  setTotalRecord,
  removeFromTotalRecord,
} from "./totalRecordAction";
import requestParam from "../../shared/requestParam";
import { setLoading } from "./loadingAction";
import { getFormattedMessage } from "../../shared/sharedMethod";

export const fetchProductCategories =
  (filter = {}, isLoading = true, isFilterModal = false) =>
  async (dispatch) => {
    if (isLoading) {
      dispatch(setLoading(true));
    }
    let url = apiBaseURL.PRODUCTS_CATEGORIES;
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
          category2Id: 0,
          attributes: {
            name: "ALL",
          },
        };
        const result_modified = [adding_all, ...result_got];
        const result_final = isFilterModal ? result_modified : result_got;
        dispatch({
          type: productCategoriesActionType.FETCH_PRODUCTS_CATEGORIES,
          payload: result_final,
        });
        // dispatch(
        //     setTotalRecord(
        //         response.data.meta.total || response.data.data.total
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

export const fetchProductCategory =
  (productId, singleProduct) => async (dispatch) => {
    apiConfig
      .get(apiBaseURL.PRODUCTS_CATEGORIES + "/" + productId, singleProduct)
      .then((response) => {
        dispatch({
          type: productCategoriesActionType.FETCH_PRODUCT_CATEGORIES,
          payload: response.data.data,
        });
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

export const addProductCategory = (products,handleClose, handleCategoryClose) => async (dispatch) => {
  debugger
  await apiConfig
    .post(apiBaseURL.PRODUCTS_CATEGORIES, products)
    .then((response) => {
      // dispatch({
      //   type: productCategoriesActionType.ADD_PRODUCT_CATEGORIES,
      //   payload: response?.data?.data,
      // });
      if (response?.data?.success) {
        dispatch(
          addToast({ text: response?.data?.message, type: toastType.SUCCESS })
        );
        handleClose && handleClose(false);
        handleCategoryClose && handleCategoryClose(false);
        dispatch(fetchProductCategories());
      }
     
      else {
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

export const editProductCategory =
  (productId, products, handleClose) => async (dispatch) => {
    apiConfig
      .post(apiBaseURL.PRODUCTS_CATEGORIES, products)
      .then((response) => {
        dispatch(fetchProductCategories());
        // dispatch(callUpdateBrandApi(true));
        // dispatch({
        //     type: productCategoriesActionType.EDIT_PRODUCT_CATEGORIES,
        //     payload: response.data.data,
        // });
      //  handleClose(false);
      debugger
        if (response?.data?.success == true) {

          dispatch(
            addToast({
              text: response?.data?.message,
              type: toastType.SUCCESS,
            })
          )
        handleClose(false)
      }else{
        dispatch(
          addToast({
            text: response?.data?.message,
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

export const deleteProductCategory = (productId) => async (dispatch) => {
  apiConfig
    .delete(apiBaseURL.PRODUCTS_CATEGORIES + "?category2id=" + productId)
    .then((response) => {
      dispatch(removeFromTotalRecord(1));
      dispatch({
        type: productCategoriesActionType.DELETE_PRODUCT_CATEGORIES,
        payload: productId,
      });
      if(response?.data?.success == true){
        dispatch(
          addToast({
            text: response?.data?.message,
            type: toastType.SUCCESS,
          })
        )
    }else{
      dispatch(
        addToast({
          text: response?.data?.message,
          type: toastType.ERROR,
        })
      );
    }
      dispatch(fetchProductCategories());
    })
    .catch(({ response }) => {
      dispatch(
        addToast({ text: response?.data?.message, type: toastType.ERROR })
      );
    });
};

export const fetchAllProductCategories = () => async (dispatch) => {
  apiConfig
    .get(apiBaseURL.PRODUCTS_CATEGORIES)
    .then((response) => {
      dispatch({
        type: productCategoriesActionType.FETCH_ALL_PRODUCTS_CATEGORIES,
        payload: response.data.data,
      });
    })
    .catch(({ response }) => {
      dispatch(
        addToast({ text: response.data.message, type: toastType.ERROR })
      );
    });
};

export const productCategoryDropdown = () => async (dispatch) => {
  apiConfig
    .get(apiBaseURL.PRODUCTS_CATEGORIES)
    .then((response) => {
      dispatch({
        type: productCategoriesActionType.FETCH_PRODUCTS_CATEGORIES,
        payload: response.data.data,
      });
    })
    .catch(({ response }) => {
      dispatch(
        addToast({ text: response.data.message, type: toastType.ERROR })
      );
    });
};
