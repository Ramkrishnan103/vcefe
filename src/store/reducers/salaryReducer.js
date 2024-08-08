import { salaryActionType } from "../../constants";
export default (state = [], action) => {
  switch (action.type) {
      case salaryActionType.FETCH_SALARY:
          return action.payload;
      
      default:
          return state;

  }
};
