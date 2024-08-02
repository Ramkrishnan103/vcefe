import React, { useCallback, useEffect } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import { getFormattedMessage } from "../sharedMethod";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const AddPriceListConfirmationModal = (props) => {
  const {
    addPriceListModalShowing,
    name,
    addPriceListModalShow,
    addNewRow,
    selectedRowItem,
  } = props;
  console.log(
    "AddPriceListConfirmationModal ::: addPriceListModalShow Checking",
    addPriceListModalShow
  );
  console.log(
    "AddPriceListConfirmationModal ::: selectedRowItem",
    selectedRowItem
  );
  const escFunction = useCallback((event) => {
    if (event.keyCode === 27) {
      // User for Close the model on Escape
      addPriceListModalShowing(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);
    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, []);

  return (
    <SweetAlert
      custom
      confirmBtnBsStyle="danger mb-3 fs-5 rounded"
      cancelBtnBsStyle="secondary mb-3 fs-5 rounded text-white"
      confirmBtnText={getFormattedMessage("add-modal.yes-btn")}
      cancelBtnText={getFormattedMessage("add-modal.no-btn")}
      title={getFormattedMessage("add-modal.title")}
      onConfirm={() => addNewRow(selectedRowItem)}
      onCancel={addPriceListModalShowing}
      showCancel
      focusCancelBtn
      customIcon={<FontAwesomeIcon icon={faCirclePlus} size={"7x"} />}
    >
      <span className="sweet-text">{getFormattedMessage("add-modal.msg")}</span>
    </SweetAlert>
  );
};
export default AddPriceListConfirmationModal;
