import apiConfig from "../../config/apiConfig";
import { apiBaseURL, userActionType, toastType } from "../../constants";
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
import id from "faker/lib/locales/id_ID";

export const fetchUsers =
    (filter = {}, isLoading = true, allUser) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        let url = apiBaseURL.USERS;
        console.log(url)
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
        url += allUser ? allUser : "";
        apiConfig
            .get(url)

            .then((response) => {
                console.log(response)
                dispatch({
                    type: userActionType.FETCH_USERS,
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
                // dispatch(
                //     addToast({
                //         text: response.data.message,
                //         type: toastType.ERROR,
                //     })
                // );
            });
    };

export const fetchUser =
    (usersId, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        console.log('fetcheduser',apiBaseURL.USERS + "?usersId=" + usersId)
        apiConfig
            .get(apiBaseURL.USERS + "?usersId=" + usersId)
           // console.log(usersId)
             //   console.log(apiBaseURL.USERS + "?usersId=2"   )
            .then((response) => {
                console.log(response)
                dispatch({
                    type: userActionType.FETCH_USER,
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


    
export const addUser = (supplier, navigate) => async (dispatch) => {
    dispatch(setSavingButton(true));
    await apiConfig
        .post(apiBaseURL.USERS, supplier)
       
        .then((response) => {
            console.log(apiBaseURL.USERS,supplier)
            console.log(response)
            dispatch({
                type: userActionType.ADD_USER,
                payload: response.data.data,
            });
            dispatch(
                addToast({
                    text: getFormattedMessage(
                        "user.success.create.message"
                    ),
                })
            );
            navigate("/app/users");
            dispatch(addInToTotalRecord(1));
            dispatch(setSavingButton(false));
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

export const addImportUsers = (importData) => async (dispatch) => {
    await apiConfig
        .post(apiBaseURL.IMPORT_USER, importData)
        .then((response) => {
            dispatch(setLoading(false));
            dispatch(callImportProductApi(true));
            // dispatch({type: productActionType.ADD_IMPORT_PRODUCT, payload: response.data.data});
            dispatch(addToast({ text: "Users Import Create Success " }));
            dispatch(addInToTotalRecord(1));
        })
        .catch(({ response }) => {
            response &&
                dispatch(
                    addToast({
                        text: response.data.message,
                        type: toastType.ERROR,
                    })
                );
        });
};


    // export const addUser =
    // (filter = {}, isLoading = true, allUser) =>
    //     async (dispatch) => {
    //         if (isLoading) {
    //             dispatch(setLoading(true));
         //   }
    // (customerId, customer, navigate) => async (dispatch) => {

    //     dispatch(setSavingButton(true));
    //    const { name, dob, email, phone, country, city, address } = customer;
    //     const data = {
    //         name,
    //         dob: dob === null ? null : moment(dob).format("YYYY-MM-DD"),
    //         email,
    //         phone,
    //         country,
    //         city,
    //         address,
    //         id:customerId,
    //     };
     
    //   let url = apiBaseURL.USERS;

    //         console.log(url)

           // console.log(apiBaseURL.CUSTOMERS,data)
           //console.log(apiBaseURL.CUSTOMERS + "?customerId=" + customerId )
    //        apiConfig
    //         .get(url)
    //         .then((response) => {
    //             console.log(response)
    //             dispatch({
    //                 type: userActionType.ADD_USER,
    //                 payload: response.data.data,
    //             });
    //             dispatch(
    //                 addToast({
    //                     text: getFormattedMessage(
    //                         "user.success.create.message"
    //                     ),
    //                 })
    //             );
    //             navigate("/app/User");
    //             dispatch(setSavingButton(false));
    //         })
    //         .catch(({ response }) => {
    //             dispatch(setSavingButton(false));
    //             dispatch(
    //                 addToast({
    //                     text: response.data.message,
    //                     type: toastType.ERROR,
    //                 })
    //              );
    //         });
    // };

// export const addUser = (users, navigate) => async (dispatch) => {
//     // dispatch(setSavingButton(true));
//     await apiConfig
//         .post(apiBaseURL.USERS, )
//         .then((response) => {
//             dispatch({
//                 type: userActionType.ADD_USER,
//                 payload: response.data.data,
//             });
//             dispatch(
//                 addToast({
//                     text: getFormattedMessage("user.success.create.message"),
//                 })
//             );
//            // navigate("/app/users");
//             dispatch(addInToTotalRecord(1));
//            // dispatch(setSavingButton(false));
//         })
//         .catch(({ response }) => {
//           //  dispatch(setSavingButton(false));
//             dispatch(
//                 addToast({ text: response.data.message, type: toastType.ERROR })
//             );
//         });
// };

export const editUser = 
(userId, users, navigate) => async (dispatch) => {
    dispatch(setSavingButton(true));
     const { firstName, lastName, userName, roleName, mobileNo, email, pwd,address1,address2,remarks,imageUrl } = users;
        const data = {
            firstName,
            lastName,
            userName,
            roleName,
            mobileNo,
            email,
            pwd,
            address1,
            address2,
            remarks,
            imageUrl,
            
            id:userId,
        };
    apiConfig
        .post(apiBaseURL.USERS,data )
       
        .then((response) => {
            console.log(response)
            dispatch({
                type: userActionType.EDIT_USER,
                payload: response.data.data,
            });
            dispatch(
                addToast({
                    text: getFormattedMessage("user.success.edit.message"),
                })
            );
            navigate("/app/users");
            dispatch(setSavingButton(false));
        })
        .catch(({ response }) => {
            dispatch(setSavingButton(false));
            dispatch(
                addToast({ text: response.data.message, type: toastType.ERROR })
            );
        });
};

export const deleteUser = (userId) => async (dispatch) => {
    apiConfig
        .delete(apiBaseURL.USERS + "?userId=" + userId)
        .then((response) => {
            console.log(response)
            dispatch(removeFromTotalRecord(1));
            dispatch({ type: userActionType.DELETE_USER, payload: userId });
            dispatch(
                addToast({
                    text: getFormattedMessage("user.success.delete.message"),
                })
            );
        })
        .catch(({ response }) => {
            dispatch(
                addToast({ text: response.data.message, type: toastType.ERROR })
            );
        });
};
