import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPenToSquare,
  faTrash,
  faCirclePlus,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import { placeholderText } from "../sharedMethod";
import priceHistory from "../../assets/images/price-history.png";

const ActionButton = (props) => {
  const {
    goToEditProduct,
    enableEdit,
    item,
    onClickDeleteModel = true,
    isDeleteMode = true,
    isEditMode = true,
    goToDetailScreen,
    isViewIcon = false,
    addNewRow,
    isViewPriceHistory,
    isViewAddIcon,
    onSubmitEdit,
    addNewPriceItem,
    onClickPriceHistory,
    addPriceListModalShowing,
  } = props;

  return (
    <>
      <div className="border-gradient">
        {isViewIcon ? (
          <button
            title={placeholderText("globally.view.tooltip.label")}
            className="btn text-success px-2 fs-3 ps-0 border-0"
            onClick={(e) => {
              e.stopPropagation();
              goToDetailScreen(item.id);
            }}
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
        ) : null}
        {item.name === "admin" ||
        item.email === "admin@infy-pos.com" ||
        isEditMode === "save" ? (
          <button
            title={placeholderText("globally.edit.tooltip.label")}
            className="btn text-primary fs-3 border-0 px-xxl-2 px-1"
            onClick={(e) => {
              e.stopPropagation();
              onSubmitEdit();
            }}
          >
            <FontAwesomeIcon icon={faCircleCheck} />
          </button>
        ) : isEditMode === "add_new_row" ? (
          <button
            title={placeholderText("globally.edit.tooltip.label")}
            className="btn text-primary fs-3 border-0 px-xxl-2 px-1"
            onClick={(e) => {
              e.stopPropagation();
              addNewPriceItem(item);
            }}
          >
            <FontAwesomeIcon icon={faCircleCheck} />
          </button>
        ) : (
          <button
            title={placeholderText("globally.edit.tooltip.label")}
            className="btn text-primary fs-3 border-0 px-xxl-2 px-1"
            onClick={(e) => {
              e.stopPropagation();
              goToEditProduct(item);
            }}
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
        )}
        {item.name === "admin" ||
        item.email === "admin@infy-pos.com" ||
        isDeleteMode === false ? null : (
          <button
            title={placeholderText("globally.delete.tooltip.label")}
            className="btn px-2 pe-0 text-danger fs-3 border-0"
            onClick={(e) => {
              e.stopPropagation();
              onClickDeleteModel(item);
            }}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        )}
        {item.name === "admin" ||
        item.email === "admin@infy-pos.com" ||
        isViewAddIcon === true ? (
          <button
            title={placeholderText("globally.add.tooltip.label")}
            className="btn px-2 pe-0 Pricelistaddbutton fs-3 border-0"
            onClick={(e) => {
              e.stopPropagation();
              // to add new row
              // addNewRow(item);
              addPriceListModalShowing(item);
            }}
          >
            <FontAwesomeIcon icon={faCirclePlus} />
          </button>
        ) : (
          ""
        )}
        {item.name === "admin" ||
        item.email === "admin@infy-pos.com" ||
        isViewPriceHistory === true ? (
          <button
            title={placeholderText("globally.add.tooltip.label")}
            className="btn px-2 pe-0 text-danger fs-3 border-0"
            onClick={(e) => {
              e.stopPropagation();
              onClickPriceHistory(item);
            }}
          >
            <img style={{ width: "28px", height: "28px" }} src={priceHistory} />
          </button>
        ) : (
          ""
        )}
      </div>
    </>
  );
};
export default ActionButton;
