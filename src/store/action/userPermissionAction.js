import apiConfig from "../../config/apiConfig";
import { apiBaseURL,  toastType, userPermissionActionType } from "../../constants";
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
import { deleteUser } from "./userAction";

export const addUserPermission = (userPermissionArray) => async (dispatch) => {
    dispatch(setSavingButton(true));
    try {

        debugger
        const response = await apiConfig.post(apiBaseURL.USER_PERMISSION, userPermissionArray);

        // if (response?.data?.success == true) {
        //     dispatch(
        //         addToast({
        //             text: response?.data?.message,
        //             type: toastType.success,
        //         })
        //     );
        // } else {
        //     dispatch(
        //         addToast({
        //             text: response?.data?.message,
        //             type: toastType.ERROR,
        //         })
        //     );
        // }

        dispatch({
            type: userPermissionActionType.ADD_USERS_PERMISSIONS,
            payload: response?.data?.permission,
        });

        dispatch(addInToTotalRecord(1));
    } catch (error) {
        const errorMessage = error?.response?.data?.message || "An error occurred";
        dispatch(
            addToast({
                text: errorMessage,
                type: toastType.ERROR,
            })
        );
    }
};


export const fetchUserPermission =

    (userId, singleUser,isLoading = true) =>
    async (dispatch) => {
        
        if (isLoading) {
            dispatch(setLoading(true));
        }
        console.log('fetcheduser',apiBaseURL.USER_PERMISSION + "?usersPermissionId=" + userId)
       await apiConfig
            .get(apiBaseURL.USER_PERMISSION + "?usersPermissionId=" + userId)
           // console.log(usersId)
             //   console.log(apiBaseURL.USERS + "?usersId=2"   )
            .then((response) => {
                //console.log(apiBaseURL.USERS + "?usersId=" + userId)
                console.log(response)

                // if(response?.data?.data?.length>0){
                //     dispatch(
                //         addToast({
                //             text: response?.data?.message,
                //             type: toastType?.success,
                //         })
                //     );
                //   }
                //   else{
                //     dispatch(
                //         addToast({
                //             text: response?.data?.message,
                //             type: toastType?.ERROR,
                //         })
                //     );
                //   }
                debugger
                if(response?.data?.success) {
                    if(response?.data?.data[0]?.attributes?.formCode)
                    {
                        localStorage.setItem("UserFormCode",JSON.stringify(response?.data?.data))
                    }
                }
                

                dispatch({
                    type: userPermissionActionType.FETCH_USERS_PERMIISIONS,
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
