import React, { useCallback, useEffect, useState } from 'react';
import SweetAlert from 'react-bootstrap-sweetalert';
import remove from "../../../assets/images/reset.png"
import { getFormattedMessage } from "../../../shared/sharedMethod";

let btn1 = null;
const ResetCartConfirmationModal = (props) => {
    const { onCancel, onConfirm, itemName } = props;
    const [btn, setBtn] = useState();

    const escFunction = useCallback((event) => {
        if (event.key == "Enter") {
            if (btn1 === "confirm-button" || btn1 == null) {
                onConfirm();
            } else if (btn1 === "cancel-button") {
                onCancel();
            }
            setBtn(null);
            btn1 = null;
        } else if (event.key === 'ArrowRight') {
            // User for Close the model on Escape
            // onCancel(false);
            document.getElementById('cancel-button')?.focus();
            setBtn(document.activeElement.id);
            btn1 = document.activeElement.id;
        } else if (event.key === 'ArrowLeft') {
            document.getElementById('confirm-button')?.focus();
            setBtn(document.activeElement.id);
            btn1 = document.activeElement.id;
        } else if (event.key === 'Escape') {
            onCancel();
        }
    }, [onConfirm]);

    useEffect(() => {
        document.addEventListener('keydown', escFunction, false);
        document.getElementById('confirm-button')?.focus();
        // setBtn(document.activeElement.id);
        return () => {
            document.removeEventListener('keydown', escFunction, false);
        };
    }, [escFunction]);

    return (
        <SweetAlert
            custom
            confirmBtnBsStyle='danger mb-3 fs-5 rounded'
            cancelBtnBsStyle='secondary mb-3 fs-5 rounded text-white'
            confirmBtnText={getFormattedMessage("reset.yes.title")}
            cancelBtnText={getFormattedMessage('delete-modal.no-btn')}
            title={getFormattedMessage("reset.title")}
            onConfirm={onConfirm}
            onCancel={onCancel}
            showCancel
            focusCancelBtn
            customButtons={
                <React.Fragment>
                    <button id="cancel-button" onClick={onCancel} className="btn btn-secondary">
                        Cancel
                    </button>

                    <button id="confirm-button" onClick={onConfirm} className="btn btn-danger" style={{ marginRight: "5%" }} autoFocus={true}>
                        {getFormattedMessage("reset.yes.title")}
                    </button>

                </React.Fragment>
            }
            customIcon={remove}
        >
            <span className='sweet-text'>{getFormattedMessage("reset.modal.msg")} {itemName} ?</span>
        </SweetAlert>
    )
};
export default ResetCartConfirmationModal;
