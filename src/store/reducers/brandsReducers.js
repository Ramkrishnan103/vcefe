import { brandsActionType } from "../../constants";

export default (state = [], action) => {
  switch (action.type) {
    case brandsActionType.FETCH_BRANDS:
      return action.payload;
    case brandsActionType.FETCH_BRAND:
      return [action.payload];
    case brandsActionType.ADD_BRANDS:
      return [...state, action.payload];
    case brandsActionType.EDIT_BRANDS:
      const updated_brands = state.map((item) => {
        console.log("Brand Reducer ::: ITEM===>", item);
        return item.category1Id === action.payload.category1Id
          ? action.payload
          : item;
      });
      console.log("Brand Reducer ::: updated_brands", updated_brands);
      return updated_brands;
    case brandsActionType.DELETE_BRANDS:
      return state.filter((item) => item.id !== action.payload);
    case brandsActionType.FETCH_ALL_BRANDS:
      return action.payload;
    default:
      return state;
  }
};
