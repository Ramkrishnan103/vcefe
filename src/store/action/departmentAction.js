import moment from "moment";
import apiConfig from "../../config/apiConfig";
import { apiBaseURL, departmentActionType, toastType } from "../../constants";
import { setLoading } from "./loadingAction";
import { setSavingButton } from "./saveButtonAction";
import { addToast } from "./toastAction";
import { addInToTotalRecord, removeFromTotalRecord } from "./totalRecordAction";
import { getFormattedMessage } from "../../shared/sharedMethod";

export const fetchDepartment =
    (filter = {}, isLoading = true) =>
        async (dispatch) => {
            if (isLoading) {
                dispatch(setLoading(true));
            }
            let url = apiBaseURL.DEPARTMENTS;
            console.log(url)
            apiConfig
                .get(url)
                .then((response) => {
                    dispatch({
                        type: departmentActionType.FETCH_DEPARTMENTS,
                        payload: response.data.data,
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


export const addDepartment = (data, isLoading = true) => async (dispatch) => {
    dispatch(setSavingButton(true));
    await apiConfig
        .post(apiBaseURL.DEPARTMENTS, data)
        //console.log(apiBaseURL.USERS,supplier)
        .then((response) => {
            console.log(response)
            dispatch({
                type: departmentActionType.ADD_DEPARTMENT,
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