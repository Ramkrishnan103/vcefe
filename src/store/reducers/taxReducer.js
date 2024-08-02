import { taxActionType } from "../../constants";

export default (state = [], action) => {
  switch (action.type) {
    case taxActionType.FETCH_TAXS:
      return action.payload;
    case taxActionType.FETCH_TAX:
      return [action.payload];
    case taxActionType.ADD_TAX:
      return [...state, action.payload];
    case taxActionType.EDIT_TAX:
      return state.map((item) =>
        item.id === +action.payload.id ? action.payload : item
      );
    case taxActionType.DELETE_TAX:
      return state.filter((item) => item.id !== action.payload);
    default:
      return state;
  }
};
