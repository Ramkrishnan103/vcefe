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
import { setLoader } from "./loaderAction";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { setSavingButton } from "./saveButtonAction";

export const fetchEmployees =
    (filter = {}, isLoading = true) =>
        async (dispatch) => {
            if (isLoading) {
                dispatch(setLoading(true));
                // dispatch(setLoader(true));
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
                        dispatch(setLoader(false));
                    }
                    debugger
                    if(response?.data?.success) {
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

export const addEmployee = (empData, navigate, empImg, adhaar, pan, others) => async (dispatch) => {
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
                (empImg != '' && empImg != undefined) && empImg.append("empNo", response?.data?.data?.empNo);
                (adhaar != '' && adhaar != undefined) && adhaar.append("empNo", response?.data?.data?.empNo);
                (pan != '' && pan != undefined) && pan.append("empNo", response?.data?.data?.empNo);
                (others != '' && others != undefined) && others.append("empNo", response?.data?.data?.empNo);
                debugger
                (empImg != '' && empImg != undefined) && dispatch(addEmployeeImage(empImg));
                (adhaar != '' && adhaar != undefined) && dispatch(addEmployeeAdhaar(adhaar));
                (pan != '' && pan != undefined) && dispatch(addEmployeePan(pan));
                (others != '' && others != undefined) && dispatch(addEmployeeOther(others));
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

export const addEmployeeImage =
    (empImg, navigate) => async (dispatch) => {
        // dispatch(setSavingButton(true));
        debugger
        await apiConfig
            .post(apiBaseURL.EMPLOYEE_IMAGE, empImg)
            .then((response) => {
                // navigate("/app/products");

                // dispatch(addInToTotalRecord(1));
                // dispatch(setSavingButton(false));
                window.location.href = "#/app/employees";
            })
            .catch(({ response }) => {
                dispatch(setSavingButton(false));
                dispatch(
                    addToast({ text: response?.data?.message, type: toastType.ERROR })
                );
            });
    };

export const addEmployeeAdhaar =
    (aadhar, navigate) => async (dispatch) => {
        // dispatch(setSavingButton(true));
        debugger
        await apiConfig
            .post(apiBaseURL.EMPLOYEE_ADHAAR, aadhar)
            .then((response) => {
                // navigate("/app/products");

                // dispatch(addInToTotalRecord(1));
                // dispatch(setSavingButton(false));
                window.location.href = "#/app/employees";
            })
            .catch(({ response }) => {
                dispatch(setSavingButton(false));
                dispatch(
                    addToast({ text: response?.data?.message, type: toastType.ERROR })
                );
            });
    };

export const addEmployeePan =
    (pan, navigate) => async (dispatch) => {
        // dispatch(setSavingButton(true));
        debugger
        await apiConfig
            .post(apiBaseURL.EMPLOYEE_PAN, pan)
            .then((response) => {
                // navigate("/app/products");

                // dispatch(addInToTotalRecord(1));
                // dispatch(setSavingButton(false));
                window.location.href = "#/app/employees";
            })
            .catch(({ response }) => {
                dispatch(setSavingButton(false));
                dispatch(
                    addToast({ text: response?.data?.message, type: toastType.ERROR })
                );
            });
    };
    
export const addEmployeeOther =
    (other, navigate) => async (dispatch) => {
        // dispatch(setSavingButton(true));
        debugger
        await apiConfig
            .post(apiBaseURL.EMPLOYEE_OTHERS, other)
            .then((response) => {
                // navigate("/app/products");

                // dispatch(addInToTotalRecord(1));
                // dispatch(setSavingButton(false));
                window.location.href = "#/app/employees";

            })
            .catch(({ response }) => {
                dispatch(setSavingButton(false));
                dispatch(
                    addToast({ text: response?.data?.message, type: toastType.ERROR })
                );
            });
    };
    
export const fetchEmployee =
    (empId, singleProduct, isLoading = true) =>
        async (dispatch) => {
            debugger
            console.log("Fetch Product Action empId", empId);
            console.log("Fetch Product Action singleProduct", singleProduct);
            dispatch(setLoader(true));
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
                        dispatch(setLoader(false));
                    } else {
                        dispatch(setLoader(false));
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
                    dispatch(setLoader(false));
                });
        };


export const editEmployee =
    (product,empImg, adhaar, pan, others) => async (dispatch) => {
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
                    (empImg != '' && empImg != undefined)&& empImg.append("empNo", response?.data?.data?.empNo);
                    (adhaar != '' && adhaar != undefined )&& adhaar.append("empNo", response?.data?.data?.empNo);
                    (pan != '' && pan != undefined) && pan.append("empNo", response?.data?.data?.empNo);
                    (others != '' && others != undefined) && others.append("empNo", response?.data?.data?.empNo);
                    debugger
                    (empImg != '' && empImg != undefined) && dispatch(addEmployeeImage(empImg));
                    (adhaar != '' && adhaar != undefined) && dispatch(addEmployeeAdhaar(adhaar));
                    (pan != '' && pan != undefined) && dispatch(addEmployeePan(pan));
                    (others != '' && others != undefined) && dispatch(addEmployeeOther(others));
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