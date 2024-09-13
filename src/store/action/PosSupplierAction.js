import { setLoading } from "./loadingAction";
import apiConfig from "../../config/apiConfig";
import { apiBaseURL, posSupplierActionType, supplierActionType, toastType } from "../../constants";
import { addToast } from "./toastAction";
import { setSavingButton } from "./saveButtonAction";
import { addInToTotalRecord, removeFromTotalRecord } from "./totalRecordAction";
import { getFormattedMessage } from "../../shared/sharedMethod";
import moment from "moment";

export const fetchSupplierList =
    (filter = {}, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }

        let url = apiBaseURL.LEDGER;
        console.log(url)
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
               console.log("Resonse",response)

                dispatch({
                    type: posSupplierActionType.FETCH_POS_SUPPLIER,
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


export const fetchSuppliers =
    (supplierId, isLoading = true) =>
    async (dispatch) => {
        if (isLoading) {
            dispatch(setLoading(true));
        }
        apiConfig
            .get(apiBaseURL.LEDGER + "?ledgerId=" + supplierId )
            
            // console.log(apiBaseURL.CUSTOMERS + "?customerId=" + customerId)
            .then((response) => {
                console.log(response)
                dispatch({
                    type: posSupplierActionType.FETCH_POS_SUPPLIERS,
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


    
 export const addSuppliers = (supplier,navigate) => async (dispatch) => {
    console.log(supplier)
        dispatch(setSavingButton(true));

        await apiConfig
            .post(apiBaseURL.LEDGER, supplier)
            .then((response) => {
              console.log(response)

              if(response?.data?.success == true){
                dispatch(
                    addToast({
                        text: getFormattedMessage
                        (
                            "Data.success.create.message"
                        ),
                    })
                );
                navigate("/app/supplier");
              }
              else{
                dispatch(
                    addToast({
                        text: response?.data?.message,
                        type: toastType?.ERROR,
                    })
                );
                navigate("/app/suppliers/create")
              }

                dispatch({
                    type: posSupplierActionType.ADD_POS_SUPPLIERS,
                    payload: response?.data?.data,
                });
              
                
                dispatch(fetchSupplierList());
                dispatch(addInToTotalRecord(1));
                dispatch(setSavingButton(false));
            })
            .catch(({ response }) => {
                dispatch(setSavingButton(false));
                response &&
                    dispatch(
                        addToast({
                            text: response?.data?.message,
                            type: toastType.ERROR,
                        })
                    );
            });
    };    



    export const editSuppliers =
    (supplierId, suppliers, navigate) => async (dispatch) => {
    
        console.log("supplier Id  => ",supplierId)
        dispatch(setSavingButton(true));
       const { ledgerName, altlanguage,underGroup,dob,mobileno1,mobileno2,regno, email, address,area,city,state,country,location,isactive,remarks,entryfrom,forSales} = suppliers;
        const data = {
            ledgerName,
            altlanguage,
            underGroup,
            dob:dob === null ? null : moment(dob).format("YYYY-MM-DD"),
            mobileno1,
            mobileno2,
            regno,
            email,
            address,
             area,
            city,
            state,
            country,
             location,
            isactive,
            remarks,
            entryfrom,
            forSales,
            id:supplierId,
        };
        
        console.log(data)
      apiConfig
            .post(apiBaseURL.LEDGER,suppliers )
           
           //console.log(apiBaseURL.CUSTOMERS + "?customerId=" + customerId )
            .then((response) => {
                console.log(apiBaseURL.LEDGER,suppliers)
                console.log(response)
    
                if(response?.data?.success == false){
                    dispatch(
                        addToast({
                            text: response?.data?.message,
                            type: toastType.ERROR,
                        })
                    );
                    navigate("/app/suppliers/edit/"+supplierId);
                }
                else{
                    dispatch(
                        addToast({
                            text: getFormattedMessage(
                                "Data.success.update.message"
                            ),
                        })
                    );
                    navigate("/app/supplier");
                }
                
                // dispatch({
                //     type: posSupplierActionType.EDIT_POS_SUPPLIERS,
                //     payload: response?.data?.data,
                // });      
                
                
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

 
 
export const deleteSupplier = (supplierId) => async (dispatch) => {
    apiConfig
        .delete(apiBaseURL.LEDGER + "?ledgerId=" + supplierId)
        .then((response) => {
            console.log("URL => ",apiBaseURL.LEDGER + "?ledgerId=" + supplierId)
            console.log(response)
            // debugger
            if(response?.data?.success == false){
                dispatch(
                    addToast({
                        text: response?.data?.message,
                        type: toastType.ERROR,
                    })
                );

            }
            else{
                dispatch(
                    addToast({
                        text: getFormattedMessage(
                            "Data.success.delete.message"
                        ),
                    })
                );
                dispatch(removeFromTotalRecord(1));
            }

            dispatch(fetchSupplierList());
            
            // dispatch({
            //     type: ledgerActionType.DELETE_LEDGER,
            //     payload: ledgerId,
            // });
            
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
        
