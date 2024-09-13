import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPenToSquare,
  faTrash,
  faCirclePlus,
  faCircleCheck,
  faTimesCircle,
  faFileInvoice
} from "@fortawesome/free-solid-svg-icons";
import { placeholderText } from "../sharedMethod";
import priceHistory from "../../assets/images/price-history.png";

const ActionButton = (props) => {
  const {
    goToEditProduct,
    enableEdit,
    item,
    onClickDeleteModel = true,
    onPrintModal = true,
    isDeleteMode = true,
    isEditMode = true,
    goToDetailScreen,
    isViewIcon = false,
    isEditIcon = true,
    isCancel = false,
    isPrint = false,
    addNewRow,
    isViewPriceHistory,
    isViewAddIcon,
    onSubmitEdit,
    addNewPriceItem,
    onClickPriceHistory,
    addPriceListModalShowing,
  } = props;
  const[roleName,setRoleName] = useState({
    edit: false,
    delete: false
  });

  useEffect(() => {
    debugger
    const userRole=localStorage.getItem("loginUserArray")
    const role =JSON.parse(userRole);
    const roleName =role?.role;
    if(roleName.toUpperCase() == "ADMINISTRATOR"){
      setRoleName({edit:true,delete:true})
    }
    else if (roleName.toUpperCase() == "MANAGER"){
      setRoleName({edit:true,delete:false})
    }
    else if(roleName.toUpperCase() == "USER"){
      setRoleName({edit:false,delete:false})
    }
  },[])

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
          isEditIcon && <button
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
          isEditIcon && <button
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
          isEditIcon && <button
            title={placeholderText("globally.edit.tooltip.label")}
            className={ roleName?.edit ? "btn text-primary fs-3 border-0 px-xxl-2 px-1" : "d-none" }
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
            className={roleName?.delete ? "btn px-2 pe-0 text-danger fs-3 border-0": "d-none"}
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
          isCancel === false ? null : (
          <button
            title={placeholderText("De-Activate")}
            className="btn px-2 pe-0 text-danger fs-3 border-0"
            onClick={(e) => {
              e.stopPropagation();
              onClickDeleteModel(item);
            }}
          >
            <FontAwesomeIcon icon={faTimesCircle} />
          </button>
        )}
        {item.name === "admin" ||
          item.email === "admin@infy-pos.com" ||
          isPrint === false ? null : (
          <button
            title={placeholderText("Payslip")}
            className="btn px-2 pe-0 text-success fs-3 border-0 px-2"
            onClick={(e) => {
              e.stopPropagation();
              onPrintModal(item);
            }}
          >
            <FontAwesomeIcon icon={faFileInvoice} />
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
