import React, { useState, createRef } from "react";
import { connect } from "react-redux";
import { Form, Modal } from "react-bootstrap-v5";
import {
  getFormattedMessage,
  placeholderText,
} from "../../shared/sharedMethod";
import {
  editProductGroup,
  fetchProductGroups,
  fetchProductGroup,
  addProductGroup,
} from "../../store/action/productGroupsAction";
import ModelFooter from "../../shared/components/modelFooter";

const ProductGroupsForm = (props) => {
  const {
    handleClose,
    show,
    title,
    addProductGroup,
    editProductGroup,
    singleUnit,
    hide,
  } = props;
  const innerRef = createRef();

  const [unitValue, setUnitValue] = useState({
    category3id: singleUnit ? singleUnit.category3id : 0,
    name: singleUnit ? singleUnit.name : "",
  });
  const [errors, setErrors] = useState({
    name: "",
  });

  const disabled = singleUnit && singleUnit.name === unitValue.name.trim();

  const handleValidation = () => {
    let errorss = {};
    let isValid = false;
    if (!unitValue["name"].trim()) {
      errorss["name"] = getFormattedMessage(
        "globally.input.name.validate.label"
      );
    } else {
      isValid = true;
    }
    setErrors(errorss);
    return isValid;
  };

  const onChangeInput = (e) => {
    e.preventDefault();
    setUnitValue((inputs) => ({ ...inputs, [e.target.name]: e.target.value }));
    setErrors("");
  };

  const prepareFormData = (data) => {
    // const params = new URLSearchParams();
    // params.append( 'name', data.name );
    // return params;

    let formData = {
      category3id: data.category3id,
      name: data.name,
    };

    return formData;
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const valid = handleValidation();
    if (singleUnit && valid) {
      if (!disabled) {
        editProductGroup(
          singleUnit.category3id,
          prepareFormData(unitValue),
          handleClose
        );
        clearField(false);
      }
    } else {
      if (valid) {
        setUnitValue(unitValue);
        addProductGroup(prepareFormData(unitValue));
        clearField(false);
      }
    }
  };

  const clearField = () => {
    setUnitValue({
      category3id: 0,
      name: "",
    });
    setErrors("");
    handleClose ? handleClose(false) : hide(false);
  };

  return (
    <Modal
      show={show}
      onHide={clearField}
      keyboard={true}
      onShow={() =>
        setTimeout(() => {
          innerRef.current.focus();
        }, 1)
      }
    >
      <Form
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            onSubmit(e);
          }
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-12 mb-3">
              <label className="form-label">
                {getFormattedMessage("globally.input.pg.label")}:{" "}
              </label>
              <span className="required" />
              <input
                type="text"
                name="name"
                value={unitValue.name}
                placeholder={placeholderText(
                  "globally.input.name.placeholder.label"
                )}
                className="form-control"
                ref={innerRef}
                autoComplete="off"
                onChange={(e) => onChangeInput(e)}
              />
              <span className="text-danger d-block fw-400 fs-small mt-2">
                {errors["name"] ? errors["name"] : null}
              </span>
            </div>
          </div>
        </Modal.Body>
      </Form>
      <ModelFooter
        onEditRecord={singleUnit}
        onSubmit={onSubmit}
        editDisabled={disabled}
        clearField={clearField}
        addDisabled={!unitValue.name.trim()}
      />
    </Modal>
  );
};

export default connect(null, {
  fetchProductGroup,
  editProductGroup,
  fetchProductGroups,
  addProductGroup,
})(ProductGroupsForm);
