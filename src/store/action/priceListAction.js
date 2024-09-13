import apiConfig from "../../config/apiConfig";
import { setLoading } from "./loadingAction";
import {
  apiBaseURL,
  brandsActionType,
  priceListActionType,
  toastType,
} from "../../constants";
import { addToast } from "./toastAction";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { useNavigate } from "react-router";

export const fetchPriceList =
  (isLoading = true) =>
  async (dispatch) => {
    console.log("Price List Action :: fetchPriceList");
    if (isLoading) {
      dispatch(setLoading(true));
    }
    let url = apiBaseURL.GET_ALL_PRICES;
    await apiConfig
      .get(url)
      .then((response) => {
        console.log("Price List Action response ::", response);
        dispatch({
          type: priceListActionType.GET_ALL_PRICELIST,
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
export const deletePrice = (priceId, mrp, batchNo) => async (dispatch) => {
  console.log("deletePrice Action");
  apiConfig
    .delete(
      apiBaseURL.GET_ALL_PRICES +
        "?itemId=" +
        priceId +
        "&mrp=" +
        mrp +
        "&batchNo=" +
        batchNo
    )
    .then((response) => {
      console.log("res===>", response);
      console.log("res===>1", response?.data?.success);
      if (!response?.data?.success) {
        console.log("Action :: Delete Price Failed");
        dispatch(
          addToast({
            text: getFormattedMessage(response?.data?.message),
            type: toastType.ERROR,
          })
        );
      } else {
        console.log("Action :: Delete Price Success", response?.data?.message);
        // dispatch(removeFromTotalRecord(1));
        dispatch(
          addToast({
            text: getFormattedMessage("price.success.delete.message"),
          })
        );
        dispatch({
          type: priceListActionType.DELETE_PRICE,
          payload: { priceId, mrp, batchNo },
        });
      }
    })
    .catch((response) => {
      console.log("Action :: Delete Price Error", response);
      dispatch(
        addToast({ text: response?.data?.message, type: toastType.ERROR })
      );
    });
};
export const updatePriceList = (data_send) => async (dispatch) => {
  console.log("Action ::: data_send", data_send);
  let url = apiBaseURL.GET_ALL_PRICES;
  await apiConfig
    .post(url, data_send)
    .then((response) => {
      console.log("Action ::: updatePriceList response", response);
      dispatch(
        addToast({
          text: getFormattedMessage("price.success.edit.message"),
        })
      );
      dispatch({
        type: priceListActionType.EDIT_PRICE,
        payload: response?.data?.data,
      });
      dispatch(fetchPriceList(true));
    })
    .catch((response) => {
      console.log("Action ::: updatePriceList ERROR", response);
      dispatch(
        addToast({
          text: response.data.message,
          type: toastType.ERROR,
        })
      );
    });
};
export const addPriceList = (data_send) => async (dispatch) => {
  console.log("Action:::addPriceList", data_send);
  const url = apiBaseURL.GET_ALL_PRICES;
  await apiConfig
    .post(url, data_send)
    .then((response) => {
      console.log("Action ::: addPriceList SUCCESS", response);
      if (!response?.data?.success) {
        console.log("Action :: Add Price Failed");
        dispatch(
          addToast({
            text: getFormattedMessage(response?.data?.message),
            type: toastType.ERROR,
          })
        );
      } else {
        dispatch(
          addToast({
            text: getFormattedMessage("price.success.add.message"),
          })
        );
        dispatch({
          type: priceListActionType.ADD_PRICE,
          payload: response?.data?.data,
        });
      }
    })
    .catch((response) => {
      console.log("Action ::: addPriceList ERROR", response);
      dispatch(
        addToast({
          text: response?.data?.message,
          type: toastType.ERROR,
        })
      );
    });
};
export const fetchPriceListByFilter =
  (
    isLoading = true,
    filtered_brand,
    filtered_group,
    filtered_category,
    product_name,
    showFilterModal
  ) =>
  async (dispatch) => {
    console.log("Price List Action :: fetchPriceListByFilter");
    if (isLoading) {
      dispatch(setLoading(true));
    }
    const url =
      apiBaseURL.GET_ALL_PRICES +
      "?category1=" +
      filtered_brand +
      "&category2=" +
      filtered_category +
      "&category3=" +
      filtered_group +
      "&itemName=" +
      product_name;
    await apiConfig
      .get(url)
      .then((response) => {
        console.log("Price List Action response Filter ::", response);
        dispatch({
          type: priceListActionType.GET_ALL_PRICELIST,
          payload: response?.data?.data,
        });
        showFilterModal(false);
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
export const fetchPriceHistory =
  (isLoading = true, PriceListHistoryItemId) =>
  async (dispatch) => {
    debugger
    const url = `/priceListHistory?PriceListHistoryItemId=${PriceListHistoryItemId}`;
    await apiConfig
      .get(url)
      .then((response) => {
        if (!response?.data?.success) {
          dispatch(
            addToast({ text: response?.data?.message, type: toastType.ERROR })
          );
        } else {
          dispatch({
            type: priceListActionType.FETCH_PRICE_HISTRY,
            payload: response?.data?.data,
          });
          if (isLoading) {
            dispatch(setLoading(false));
          }
        }
      })
      .catch((response) => {
        dispatch(
          addToast({
            text: response?.data?.message,
            type: toastType.ERROR,
          })
        );
      });
  };

// MARK FROM RAM [26-08-2024]

export const fetchPriceListSpecific =
  (isLoading = true, PriceListHistoryItemId) =>
  async (dispatch) => {
    
    const url = `/priceList?PriceListItemId=${PriceListHistoryItemId}`;
    await apiConfig
      .get(url)
      .then((response) => {
        console.log("Response :" ,response)
        if (!response?.data?.success) {
          dispatch(
            addToast({ text: response?.data?.message, type: toastType.ERROR })
          );
         
        } else {
          dispatch({
            type: priceListActionType.FETCH_PRICE_HISTRY,
            payload: response?.data?.data,
          });
          window.location.href = "#/app/price-list";
          if (isLoading) {
            dispatch(setLoading(false));
          }
        }
      })
      .catch((response) => {
        dispatch(
          addToast({
            text: response?.data?.message,
            type: toastType.ERROR,
          })
        );
      });
  };

// MARK TO RAM [26-08-2024]