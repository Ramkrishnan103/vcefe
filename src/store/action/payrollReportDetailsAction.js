import apiConfig from "../../config/apiConfig";
import { apiBaseURL, empDesignationActionType, payrollReportDetails, salaryDetailActionType, toastType } from "../../constants";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { setLoading } from "./loadingAction";
import { addToast } from "./toastAction";

export const fetchPayrollReportDetailsFilter=
(value,filter = {}, isLoading = true, mode) =>
async (dispatch) => {
    if (isLoading) {
        dispatch(setLoading(true));
    }

    let url = apiBaseURL.PAYROLLDETAILS+value;
    console.log(url)
   
    apiConfig
        .get(url)
        .then((response) => {
           console.log("Resonse",response)
        //    let res = response.data["mode"] = mode;
           console.log(response.data)
           if(response?.data?.success == true)
           {
            dispatch({
                type: payrollReportDetails.FETCH_PAYROLL_DETAILS,
                payload: response?.data?.data?.employeeDetails,
            });
      
        }
        else{
            dispatch(
                addToast({
                    text: response?.data?.message,
                    type: toastType.ERROR,
                })
            );
        }
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
