import apiConfig from "../../config/apiConfig";
import { apiBaseURL, posCustomerActionType, toastType } from "../../constants";
import { setLoading } from "./loadingAction";
import { setSavingButton } from "./saveButtonAction";
import { addToast } from "./toastAction";
import { addInToTotalRecord, removeFromTotalRecord } from "./totalRecordAction";
import { getFormattedMessage } from "../../shared/sharedMethod";

export const fetchCustomers=(filter={},isLoading=true)=>async(dispatch)=>{
  if(isLoading){
    dispatch(setLoading(true))
  }
  let url=apiBaseURL.LEDGER;
  console.log(url)
  apiConfig.get(url)
  .then((response)=>{
    console.log("response",response)
    dispatch({
      type:posCustomerActionType.FETCH_CUSTOMERS,
      payload:response?.data?.data,
    })
    if(isLoading) {
      dispatch(setLoading(false));
  }
 } )
 .catch(({ response }) => {
  dispatch(
      addToast({
          text: response?.data?.message,
          type: toastType.ERROR,
      })
  );
});

}
export const fetchCustomer =
(customerId, isLoading = true) =>
async (dispatch) => {
    if (isLoading) {
        dispatch(setLoading(true));
    }
    apiConfig
        .get(apiBaseURL.LEDGER + "?ledgerId=" + customerId )
        
        // console.log(apiBaseURL.CUSTOMERS + "?customerId=" + customerId)
        .then((response) => {
            console.log(response)
            dispatch({
                type: posCustomerActionType.FETCH_CUSTOMER,
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

export const addCustomer = (customer,navigate) => async (dispatch) => {
 
  console.log(customer)
      dispatch(setSavingButton(true));
      // console.log(data)
 
      await apiConfig
          .post(apiBaseURL.LEDGER,customer)
          .then((response) => {
            console.log(response)

            if(response?.data?.success == true){
              dispatch(
                  addToast({
                      text: getFormattedMessage(
                          "sale.success.create.message"
                      ),
                  })
              );
              navigate("/app/posCustomer");
            }
            else{
              dispatch(
                  addToast({
                      text: response.data.message,
                      type: toastType?.ERROR,
                  })
              );
              navigate("/app/posCustomer/create")
            }

              dispatch({
                  type: posCustomerActionType.ADD_CUSTOMER,
                  payload: response?.data?.data,
              });
            
              
              dispatch(fetchCustomers());
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


  export const editCustomer =
  (customerId, customer, navigate) => async (dispatch) => {
  
      console.log("Customer Id  => ",customer)
      console.log(customer)
      dispatch(setSavingButton(true));
     
    apiConfig
          .post(apiBaseURL.LEDGER,customer)
         
         //console.log(apiBaseURL.CUSTOMERS + "?customerId=" + customerId )
          .then((response) => {
              console.log(apiBaseURL.LEDGER,customer)
              console.log(response)
  
              if(response?.data?.success == false){
                  dispatch(
                      addToast({
                          text: response?.data?.message,
                          type: toastType.ERROR,
                      })

                  );
                  navigate("/app/posCustomer/edit/:",customerId);
              }
              else{
                  dispatch(
                      addToast({
                          text: getFormattedMessage(
                               "sale.success.edit.message"
                          ),
                      })
                    
                  );
                  navigate("/app/posCustomer");
              }
              
            //   dispatch({
            //       type: posCustomerActionType.EDIT_CUSTOMER,
            //       payload: response?.data?.data,
            //   });      
             
             
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
     
  export const deleteCustomer = (customerId) => async (dispatch) => {
    apiConfig
        .delete(apiBaseURL.LEDGER + "?ledgerId=" + customerId)
        .then((response) => {
            console.log("URL => ",apiBaseURL.LEDGER + "?ledgerId=" + customerId)
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
                             "sale.success.delete.message"
                        ),
                    })
                );
                dispatch(removeFromTotalRecord(1));
            }

            dispatch(fetchCustomers());
            
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
