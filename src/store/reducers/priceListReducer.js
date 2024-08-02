import { priceListActionType } from "../../constants";

export default (state = [], action) => {
  console.log("REC:::state===>", state);
  console.log("Reducer ::: action", action);
  console.log("Reducer ::: action payload", action.payload);
  console.log("deletePrice Reducers");
  switch (action.type) {
    case priceListActionType.GET_ALL_PRICELIST:
      return action.payload;
    case priceListActionType.DELETE_PRICE:
      const filtered = state.filter((list) => {
        return (
          list?.attributes?.mrp !== action?.payload?.mrp ||
          list.itemId !== action?.payload?.priceId ||
          list?.attributes?.batchNo !== action?.payload?.batchNo
        );
      });
      console.log("REC:::filtered list===>", filtered);
      return filtered;
    case priceListActionType.EDIT_PRICE:
      console.log("edited_response action?.payload", action?.payload);
      const edited_response = state.map((list) => {
        return list?.itemId === action?.payload?.itemId &&
          list?.attributes?.mrp === action?.payload?.attributes?.mrp &&
          list?.attributes?.batchNo === action?.payload?.attributes?.batchNo
          ? action?.payload
          : list;
      });
      console.log("edited_response", edited_response);
      return edited_response;
    case priceListActionType.ADD_PRICE:
      return [...state, action.payload];
    default:
      return state;
  }
};
