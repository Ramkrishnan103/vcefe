import apiConfig from "../../config/apiConfig";
import { apiBaseURL, productActionType, salaryActionType, toastType } from "../../constants";
import { addToast } from "./toastAction";
import {
  setTotalRecord,
  addInToTotalRecord,
  removeFromTotalRecord,
} from "./totalRecordAction";
import { setLoading } from "./loadingAction";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { setSavingButton } from "./saveButtonAction";

export const fetchSalary=(filter={}, isLoading=true)=>async(dispatch)=>{
 if(isLoading){
  dispatch(setLoading(true));
 }
 let url=apiBaseURL.SALARY;
 apiConfig.get(url)
 .then((response)=>{
  console.log("response",response)
  dispatch({
    type: salaryActionType.FETCH_SALARY,
    payload: response?.data?.data,
  });

  if(isLoading){
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
}