import React, { useCallback, useEffect } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import remove from "../../assets/images/delete.gif";
import { getFormattedMessage } from "../../shared/sharedMethod";

const ValidationModal = (props) => {
  const {  name } = props;

  const escFunction = useCallback((event) => {
    if (event.keyCode === 27) {
      // User for Close the model on Escape
    //   onClickValidationModel(false);
    }
  }, []);

//   useEffect(() => {
//     document.addEventListener("keydown", escFunction, false);
//     return () => {
//       document.removeEventListener("keydown", escFunction, false);
//     };
//   }, []);

  return (
    <SweetAlert
      custom
      confirmBtnBsStyle="danger mb-3 fs-5 rounded"
      cancelBtnBsStyle="secondary mb-3 fs-5 rounded text-white"
      confirmBtnText={getFormattedMessage("delete-modal.yes-btn")}
      cancelBtnText={getFormattedMessage("delete-modal.no-btn")}
      title={getFormattedMessage("delete-modal.title")}
    //   onConfirm={}
    //   onCancel={}
      showCancel
      focusCancelBtn
      customIcon={remove}
    >
      <span className="sweet-text">
        {getFormattedMessage("delete-modal.msg")} {name} ?
      </span>
    </SweetAlert>
  );
};
export default  ValidationModal;
