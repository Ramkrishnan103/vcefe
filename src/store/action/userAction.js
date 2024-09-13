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
import { addUserPermission } from "./userPermissionAction";

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
    (userId, singleUser,isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        console.log('fetcheduser',apiBaseURL.USERS + "?usersId=" + userId)
       await apiConfig
            .get(apiBaseURL.USERS + "?usersId=" + userId)
           // console.log(usersId)
             //   console.log(apiBaseURL.USERS + "?usersId=2"   )
            .then((response) => {
                console.log(apiBaseURL.USERS + "?usersId=" + userId)
                console.log(response)
                dispatch({
                    type: userActionType.FETCH_USER,
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


//    export const addUser = (users, navigate,userImage) => async (dispatch) => {
//     console.log('Action :: Add user',navigate)
//             dispatch(setSavingButton(true));
//             await apiConfig
//                 .post(apiBaseURL.USERS, users)
//                 //console.log(apiBaseURL.USERS,supplier)
//                 .then((response) => {
//                     console.log(response)
//                     if (!response?.data?.success) {
//                         dispatch(
//                           addToast({ text: response?.data?.message, type: toastType.ERROR })
//                         );
//                         dispatch(setSavingButton(false));
//                       } else {
//                         userImage.append("userId", response?.data?.data?.id);
//                      //   productStock.itemId = response?.data?.data?.items_id;
//                         dispatch(addUsersImage(userImage, navigate));
//                         dispatch({
//                         type: userActionType.ADD_USER,
//                         payload: response.data.data,
//                     });
//                     navigate("/app/users");
//                 }      
//             })
//                 //     dispatch(
//                 //         addToast({
//                 //             text: getFormattedMessage(
//                 //                 "user.success.create.message"
//                 //             ),
//                 //         })
//                 //     );
//                 //     navigate("/app/users");
//                 //     dispatch(addInToTotalRecord(1));
//                 //     dispatch(setSavingButton(false));
//                 // })
//                 .catch(({ response }) => {
//                     dispatch(setSavingButton(false));
//                     response &&
//                         dispatch(
//                             addToast({
//                                 text: response.data.message,
//                                 type: toastType.ERROR,
//                             })
//                         );
//                 });
//         };

        
export const addUser = (supplier, navigate,formData) => async (dispatch) => {
    console.log('my form data===>',formData)
    dispatch(setSavingButton(true));
    debugger
    await apiConfig
        .post(apiBaseURL.USERS, supplier)
       
        .then((response) => {
            console.log(apiBaseURL.USERS,supplier)
            console.log(response)
            dispatch({
                type: userActionType.ADD_USER,
                payload: response?.data?.data,
            });
            const newForDataForPermission  = formData?.permission?.map((each)=>{
                // console.log('newForDataForPermission ::: useridResponse',response);
                // console.log('newForDataForPermission ::: userid',response?.data?.id);
                return {
                    
                    ...each,
                    userId : response?.data?.data?.id,
                    createdBy:response?.data?.data?.id,
                    updatedBy:response?.data?.data?.id
                }
            });
            console.log('newForDataForPermission',newForDataForPermission);
            dispatch(addUserPermission({permission :newForDataForPermission,xMode:formData?.xMode}))
            dispatch(
                addToast({
                    text: getFormattedMessage(
                        "user.success.create.message"
                    ),
                })
            );
            navigate("/app/users");
            // dispatch(fetchUsers());
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

export const addUsersImage =
  (userImage, navigate) => async (dispatch) => {
    // dispatch(setSavingButton(true));
    await apiConfig
      .post(apiBaseURL.USERS_IMAGE, userImage)
      .then((response) => {
        console.log("image response===>",response)
        // dispatch(addProductStock(productStock, navigate));
        // navigate("/app/products");

        // dispatch(addInToTotalRecord(1));
        // dispatch(setSavingButton(false));

        dispatch(
          addToast({
            text: getFormattedMessage("Users.success.create.message"),
          })
        );

      })
      .catch(({ response }) => {
        dispatch(setSavingButton(false));
        dispatch(
          addToast({ text: response.data.message, type: toastType.ERROR })
        );
      });
  };

  export const editUser =
  (userId, users, navigate, usersImage,formData) => async (dispatch) => {
    console.log("ACTION :: EDIT USERS");
    debugger
    dispatch(setSavingButton(true));
    // const { firstName, lastName, userName, roleName, mobileNo, email, pwd,address1,address2,remarks,imageUrl } = users;
    //         const data = {
    //             firstName,
    //             lastName,
    //             userName,
    //             roleName,
    //             mobileNo,
    //             email,
    //             pwd,
    //             address1,
    //             address2,
    //             remarks,
    //             imageUrl,
                
    //             id:userId,
    //         };
     apiConfig
      .post(apiBaseURL.USERS, users)
   
      .then((response) => {
        console.log(apiBaseURL.USERS, users)
        console.log(response)
        // usersImage.append("userId", userId);
        
        // dispatch(addUsersImage(usersImage, navigate));

        const newForDataForPermission  = formData?.permission?.map((each)=>{
            // console.log('newForDataForPermission ::: useridResponse',response);
            // console.log('newForDataForPermission ::: userid',response?.data?.id);
            return {
                ...each,
                userId : response?.data?.data?.id ,
                createdBy:response?.data?.data?.id,
                updatedBy:response?.data?.data?.id
            }
        });
        console.log('newForDataForPermission',newForDataForPermission);
        dispatch(addUserPermission({permission :newForDataForPermission,xMode:formData?.xMode}))

        navigate("/app/users");
        dispatch(
          addToast({
            text: getFormattedMessage("user.success.edit.message"),
          })
        );
           
        dispatch({
          type: userActionType.EDIT_USER,
          payload: response.data.data,
        });
        dispatch(setSavingButton(false));
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


// export const editUser = 
// (userId, users, navigate,userImage) => async (dispatch) => {
//     dispatch(setSavingButton(true));
//      const { firstName, lastName, userName, roleName, mobileNo, email, pwd,address1,address2,remarks,imageUrl } = users;
//         const data = {
//             firstName,
//             lastName,
//             userName,
//             roleName,
//             mobileNo,
//             email,
//             pwd,
//             address1,
//             address2,
//             remarks,
//             imageUrl,
            
//             id:userId,
//         };
//     apiConfig
//         .post(apiBaseURL.USERS,data )
       
//         .then((response) => {
//             console.log(response)
//             userImage.append("USersID", userId);
//             dispatch(addUsersImage(userImage, navigate));
//             navigate("/app/users") 
           
//             dispatch(
//                 addToast({
//                     text: getFormattedMessage("user.success.edit.message"),
//                 })
//             );
//             dispatch({
//                 type: userActionType.EDIT_USER,
//                 payload: response.data.data,
//             });
//             // navigate("/app/users");
//             // dispatch(setSavingButton(false));
//         })
//         .catch(({ response }) => {
//             dispatch(setSavingButton(false));
//             dispatch(
//                 addToast({ text: response.data.message, type: toastType.ERROR })
//             );
//         });
// };


export const deleteUser = (userId, formData) => async (dispatch) => {
    try {
debugger
const permissionResponse = await dispatch(
    addUserPermission({
        permission: formData?.permission,
        xMode: formData?.xMode,
    })
);

        const response = await apiConfig.delete(apiBaseURL.USERS + "?usersId=" + userId);

        if (response?.data?.success === true) {
            dispatch(removeFromTotalRecord(1));

            dispatch(
                addToast({
                    text: response?.data?.message,
                    type: toastType.success,
                })
            );
        } else {
            dispatch(
                addToast({ text: response?.data?.message, type: toastType.ERROR })
            );
        }

        dispatch(fetchUsers());

    } catch (error) {
        const errorMessage = error?.response?.data?.message || "An error occurred";
        dispatch(
            addToast({ text: errorMessage, type: toastType.ERROR })
        );
    }
};
