import apiConfig from "../../config/apiConfig";
import { apiBaseURL, taxActionType, toastType } from "../../constants";
import requestParam from "../../shared/requestParam";
import { addToast } from "./toastAction";
import { setLoading } from "./loadingAction";

export const fetchTax =
  (isLoading = true) =>
  async (dispatch) => {
    if (isLoading) {
      dispatch(setLoading(true));
    }
    let url = apiBaseURL.GET_ALL_TAX;
    apiConfig
      .get(url)
      .then((response) => {
        console.log(response);
        dispatch({
          type: taxActionType.FETCH_TAXS,
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
