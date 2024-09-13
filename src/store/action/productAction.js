import apiConfig from "../../config/apiConfig";
import { apiBaseURL, productActionType, toastType } from "../../constants";
import { addToast } from "./toastAction";
import {
  setTotalRecord,
  addInToTotalRecord,
  removeFromTotalRecord,
} from "./totalRecordAction";
import requestParam from "../../shared/requestParam";
import { setLoading } from "./loadingAction";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { setSavingButton } from "./saveButtonAction";
import { callImportProductApi } from "./importProductApiAction";
import { setLoader } from "./loaderAction";

export const fetchProducts =
  (filter = {}, isLoading = true) =>
    async (dispatch) => {
      debugger
      dispatch(setLoader(true));
      if (isLoading) {
        dispatch(setLoading(true));
      }
      let url = apiBaseURL.PRODUCTS;
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
          dispatch({
            type: productActionType.FETCH_PRODUCTS,
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
          if(response?.data?.success) {
            dispatch(setLoader(false));
          }else{
            dispatch(setLoader(false));
          }
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

export const fetchProduct =
  (productId, singleProduct, isLoading = true) =>
    async (dispatch) => {
      console.log("Fetch Product Action productId", productId);
      console.log("Fetch Product Action singleProduct", singleProduct);
      if (isLoading) {
        dispatch(setLoading(true));
      }
      await apiConfig
        .get(apiBaseURL.PRODUCTS + "?itemid=" + productId, singleProduct)
        .then((response) => {
          console.log("Fetch Product Action response", response);
          dispatch({
            type: productActionType.FETCH_PRODUCT,
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

export const addProduct =
  (product, navigate, productImage, productStock) => async (dispatch) => {
    debugger
    dispatch(setSavingButton(true));
    await apiConfig
      .post(apiBaseURL.PRODUCTS, product)
      .then((response) => {
        if (response?.data?.success) {
          productImage.append("itemId", response?.data?.data?.items_id);
          productStock.itemId = response?.data?.data?.items_id;
          dispatch(addProductImage(productImage, navigate, productStock));
          dispatch(
            addToast({ text: response?.data?.message, type: toastType.SUCCESS })
          );
          dispatch(setSavingButton(false));
          navigate("/app/products");

          dispatch(fetchProducts());
        }
        else {
          productImage.append("itemId", response?.data?.data?.items_id);
          productStock.itemId = response?.data?.data?.items_id;
          dispatch(addProductImage(productImage, navigate, productStock));
          dispatch({
            type: productActionType.ADD_PRODUCT,
            payload: response?.data?.data,
          });
          // dispatch(
          //     addToast({
          //         text: getFormattedMessage("product.success.create.message"),
          //     })
          // );
          // navigate("/app/products");

          // dispatch(addInToTotalRecord(1));
          // dispatch(setSavingButton(false));
          dispatch(
            addToast({ text: response?.data?.message, type: toastType.ERROR })
          );
        }
      })
      .catch(({ response }) => {
        dispatch(setSavingButton(false));
        dispatch(
          addToast({ text: response.data.message, type: toastType.ERROR })
        );
      });
  };

export const addProductImage =
  (productImage, navigate, productStock) => async (dispatch) => {
    // dispatch(setSavingButton(true));
    await apiConfig
      .post(apiBaseURL.PRODUCTS_IMAGE, productImage)
      .then((response) => {
        dispatch(addProductStock(productStock, navigate));
        // navigate("/app/products");

        dispatch(addInToTotalRecord(1));
        dispatch(setSavingButton(false));

        // dispatch(
        //   addToast({
        //     text: getFormattedMessage("product.success.create.message"),
        //   })
        // );
        // navigate("/app/products");
      })
      .catch(({ response }) => {
        dispatch(setSavingButton(false));
        dispatch(
          addToast({ text: response?.data?.message, type: toastType.ERROR })
        );
      });
  };

export const addProductStock = (productStock, navigate) => async (dispatch) => {
  // dispatch(setSavingButton(true));
  await apiConfig
    .post(apiBaseURL.PRODUCTS_STOCK, productStock)
    .then((response) => {
      // dispatch({
      //     type: productActionType.ADD_PRODUCT,
      //     payload: response.data.data,
      // });
      // dispatch(
      //   addToast({
      //     text: getFormattedMessage("product.success.create.message"),
      //   })
      // );
      // navigate("/app/products");

      dispatch(addInToTotalRecord(1));
      dispatch(setSavingButton(false));
    })
    .catch(({ response }) => {
      dispatch(setSavingButton(false));
      dispatch(
        addToast({ text: response.data.message, type: toastType.ERROR })
      );
    });
};

export const editProduct =
  (productId, product, navigate, productImage) => async (dispatch) => {
    console.log("ACTION :: EDIT PRODUCTS");
    dispatch(setSavingButton(true));
     apiConfig
      .post(apiBaseURL.PRODUCTS, product)
      .then((response) => {
        if (response?.data?.success) {
          productImage.append("itemId", productId);
          dispatch(addProductImage(productImage, navigate));
          dispatch(
            addToast({ text: response?.data?.message, type: toastType.SUCCESS })
          );
          navigate("/app/products");
          dispatch({
            type: productActionType.EDIT_PRODUCT,
            payload: response.data.data,
          });
          dispatch(setSavingButton(false));
        } else {
          dispatch(
            addToast({ text: response?.data?.message, type: toastType.ERROR })
          );
        }
      })
      .catch(({ response }) => {
        dispatch(setSavingButton(false));
        dispatch(
          addToast({
            text: response?.data?.message,
            type: toastType.ERROR,
          })
        );
      });
  };

export const deleteProduct = (productId) => async (dispatch) => {
  debugger;
  apiConfig
    .delete(apiBaseURL.PRODUCTS + "?itemid=" + productId)
    .then((response) => {
      console.log("res===>", response);
      if (!response?.data?.data?.success) {
        dispatch(
          addToast({
            text: getFormattedMessage(response?.data?.message),
            type: toastType.ERROR,
          })
        );
      } else {
        dispatch(removeFromTotalRecord(1));
        dispatch({
          type: productActionType.DELETE_PRODUCT,
          payload: productId,
        });
      }
      dispatch(fetchAllProducts());
    })
    .catch(({ response }) => {
      dispatch(
        addToast({ text: response.data.message, type: toastType.ERROR })
      );
    });
};

export const fetchAllProducts = () => async (dispatch) => {
  apiConfig
    .get(apiBaseURL.PRODUCTS)
    .then((response) => {
      dispatch({
        type: productActionType.FETCH_ALL_PRODUCTS,
        payload: response?.data?.data,
      });
    })
    .catch(({ response }) => {
      dispatch(
        addToast({ text: response.data.message, type: toastType.ERROR })
      );
    });
};

export const fetchProductsByWarehouse = (id) => async (dispatch) => {
  apiConfig
    .get(`products?page[size]=0&warehouse_id=${id}`)
    .then((response) => {
      dispatch({
        type: productActionType.FETCH_PRODUCTS_BY_WAREHOUSE,
        payload: response.data.data,
      });
    })
    .catch(({ response }) => {
      dispatch(
        addToast({ text: response.data.message, type: toastType.ERROR })
      );
    });
};

export const addImportProduct = (importProduct) => async (dispatch) => {
  await apiConfig
    .post(apiBaseURL.IMPORT_PRODUCT, importProduct)
    .then((response) => {
      dispatch(setLoading(false));
      dispatch(callImportProductApi(true));
      // dispatch({type: productActionType.ADD_IMPORT_PRODUCT, payload: response.data.data});
      dispatch(addToast({ text: "Product Import Create Success " }));
      dispatch(addInToTotalRecord(1));
    })
    .catch(({ response }) => {
      dispatch(
        addToast({ text: response.data.message, type: toastType.ERROR })
      );
    });
};
