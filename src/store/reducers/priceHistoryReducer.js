import { priceListActionType } from "../../constants";

export default (state = [], action) => {
  switch (action.type) {
    case priceListActionType.FETCH_PRICE_HISTRY:
      return action.payload;
    default:
      return state;
  }
};
