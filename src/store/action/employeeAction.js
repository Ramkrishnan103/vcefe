import apiConfig from "../../config/apiConfig";
import { apiBaseURL, employeeActionType, employeeFormData, singleEmployeeActionType, toastType } from "../../constants";
import requestParam from "../../shared/requestParam";
import { addToast } from "./toastAction";
import {
    setTotalRecord,
    addInToTotalRecord,
    removeFromTotalRecord,
} from "./totalRecordAction";
import { setLoading } from "./loadingAction";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { setSavingButton } from "./saveButtonAction";

export const fetchEmployees =
    (filter = {}, isLoading = true) =>
        async (dispatch) => {
            if (isLoading) {
                dispatch(setLoading(true));
            }
            let url = apiBaseURL.EMPLOYEES;
            if (
                !_.isEmpty(filter) &&
                (filter.page ||
                    filter.pageSize ||
                    filter.search ||
                    filter.order_By ||
                    filter.created_at)
            ) {
                url += requestParam(filter, null, null, null, url);
            }
            apiConfig
                .get(url)
                .then((response) => {
                    dispatch({
                        type: employeeActionType.FETCH_EMPLOYEES,
                        payload: response.data.data,
                    });
                    !allUser &&
                        dispatch(
                            setTotalRecord(
                                response.data.meta.total !== undefined &&
                                    response.data.meta.total >= 0
                                    ? response.data.meta.total
                                    : response.data.data.total
                            )
                        );
                    if (isLoading) {
                        dispatch(setLoading(false));
                    }
                })
                .catch(({ response }) => {
                    if (isLoading) {
                        dispatch(setLoading(false));
                    }
                    if (response) {
                        dispatch(
                            addToast({
                                type: toastType.ERROR,
                                message: getFormattedMessage(
                                    response.data.message
                                ),
                            })
                        );
                    }
                });
        }

export const addEmployee = (empData, navigate) => async (dispatch) => {
    debugger
    dispatch(setSavingButton(true));
    await apiConfig
        .post(apiBaseURL.EMPLOYEES, empData)
        //console.log(apiBaseURL.USERS,supplier)
        .then((response) => {
            console.log(response)
            dispatch({
                type: employeeActionType.ADD_EMPLOYEE,
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
                window.location.href = "#/app/employees";
                // dispatch(fetchEmployees());
                // dispatch(addInToTotalRecord(1));
                // dispatch(setSavingButton(false));
                dispatch({ type: employeeFormData.FORM_DATA, payload: [] });
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
};

export const fetchEmployee =
    (empId, singleProduct, isLoading = true) =>
        async (dispatch) => {
            debugger
            console.log("Fetch Product Action empId", empId);
            console.log("Fetch Product Action singleProduct", singleProduct);
            if (isLoading) {
                dispatch(setLoading(true));
            }
            await apiConfig
                .get(apiBaseURL.EMPLOYEES + "?empNo=" + empId)
                .then((response) => {
                    console.log("Fetch Product Action response", response);
                    if (response?.data?.success) {
                        dispatch({
                            type: singleEmployeeActionType.FETCH_EMPLOYEE,
                            payload: response?.data?.data,
                        });
                        if (isLoading) {
                            dispatch(setLoading(false));
                        }
                    } else {
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


export const editEmployee =
    (product) => async (dispatch) => {
        console.log("ACTION :: EDIT PRODUCTS");
        dispatch(setSavingButton(true));
        await apiConfig
            .post(apiBaseURL.EMPLOYEES, product)
            .then((response) => {
                //   productImage.append("itemId", productId);
                //   dispatch(addProductImage(productImage, navigate));
                //   navigate("/app/products");
                dispatch({
                    type: employeeActionType.EDIT_EMPLOYEE,
                    payload: response.data.data,
                });
                if (response?.data?.success) {
                    dispatch(
                        addToast({
                            text: getFormattedMessage(response?.data?.message),
                        })
                    );
                    window.location.href = "#/app/employees";
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
                // dispatch(
                //     addToast({
                //         text: response?.data?.message,
                //         type: toastType.ERROR,
                //     })
                // );
            });
    };

export const deleteEmp = (userId) => async (dispatch) => {
    debugger
    apiConfig
        .delete(apiBaseURL.EMPLOYEES + "?empNo=" + userId)
        .then((response) => {
            console.log(response)
            dispatch(removeFromTotalRecord(1));
            dispatch({ type: employeeActionType.DELETE_EMPLOYEE, payload: userId });
            if (response?.data?.success) {
                dispatch(
                    addToast({
                        text: getFormattedMessage(response?.data?.message),
                    })
                );
                dispatch(fetchEmployees());
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
            dispatch(
                addToast({ text: response.data.message, type: toastType.ERROR })
            );
        });
};