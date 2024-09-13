import moment from "moment";
import apiConfig from "../../config/apiConfig";
import { apiBaseURL, designationActionType, toastType } from "../../constants";
import { setLoading } from "./loadingAction";
import { setSavingButton } from "./saveButtonAction";
import { addToast } from "./toastAction";
import { addInToTotalRecord, removeFromTotalRecord } from "./totalRecordAction";
import { getFormattedMessage } from "../../shared/sharedMethod";

export const fetchDesignation =
    (filter = {}, isLoading = true) =>
        async (dispatch) => {

            let url = apiBaseURL.DESIGNATIONS;
            apiConfig
                .get(url)
                .then((response) => {
                    dispatch({
                        type: designationActionType.ADD_DESIGNATION,
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


        export const addDesignation = (data, isLoading = true) => async (dispatch) => {
            debugger
            dispatch(setSavingButton(true));
            await apiConfig
                .post(apiBaseURL.DESIGNATIONS, data)
                //console.log(apiBaseURL.USERS,supplier)
                .then((response) => {
                    console.log(response)
                    dispatch({
                        type: designationActionType.ADD_DESIGNATION,
                        payload: response.data.data,
                    });
                    if (response?.data?.success) {
                        dispatch(
                            addToast({
                                text: getFormattedMessage(
                                    response?.data?.message
                                ),
                            })
                        );
                    //    fetchDepartment();
                    } else {
                        dispatch(
                            addToast({
                                type: toastType.ERROR,
                                text: getFormattedMessage(response?.data?.message),
                            })
                        );
                    }
        
                })
                .catch(({ response }) => {
                    dispatch(setSavingButton(false));
                    response &&
                        dispatch(
                            addToast({
                                text: response.data.message,
                                type: toastType.ERROR,
                            })
                        );
                });
            }