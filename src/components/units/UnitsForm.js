import React, { useState, createRef, useEffect } from "react";
import { connect } from "react-redux";
import { Form, Modal } from "react-bootstrap-v5";
import {
  getFormattedMessage,
  placeholderText,
} from "../../shared/sharedMethod";
import { editUnit } from "../../store/action/unitsAction";
import ModelFooter from "../../shared/components/modelFooter";
import ReactSelect from "../../shared/select/reactSelect";
import { fetchAllProductGroups } from "../../store/action/productGroupsAction";

const UnitsForm = (props) => {
  const {
    handleClose,
    base,
    fetchAllProductGroups,
    show,
    title,
    addProductData,
    editUnit,
    singleUnit,
    hide,
    product_unit,
    buttonText,
  } = props;
  const innerRef = createRef();
  // const newUnit = singleUnit && base.filter((da) => singleUnit.base_unit === da.attributes.name);

  const [unitValue, setUnitValue] = useState({
    unitid: singleUnit ? singleUnit.unitid : 0,
    unitName: singleUnit ? singleUnit.unitName : "",
    decimalPoint: singleUnit ? singleUnit.decimalPoint : "",
    // base_unit: ''
  });
  const [errors, setErrors] = useState({
    unitName: "",
    decimalPoint: "",
    // base_unit: ''
  });

  // useEffect(() => {
  //     fetchAllProductGroups()
  // }, [])

  // useEffect(() => {
  //     if(newUnit && newUnit?.length >= 1){
  //         setUnitValue(unitValue => ({...unitValue, base_unit: {
  //             value: newUnit[0].id,
  //             label: newUnit[0].attributes.name
  //         }}));
  //     }
  // },[])

  // useEffect(() => {
  //     if(singleUnit){
  //       const data =  base.filter((da) => Number(singleUnit.base_unit) === da.id);
  //         data.length && setUnitValue({
  //             name: singleUnit ? singleUnit.name : '',
  //             decimalPoint: singleUnit ? singleUnit.decimalPoint : '',
  //             base_unit: {label: data[0]?.attributes?.name, value: singleUnit?.base_unit}
  //         })
  //     }
  // },[singleUnit])

  const disabled = false;
  // const [selectedProductGroup] = useState( newUnit ? ([{label: newUnit[0]?.attributes?.name, value: newUnit[0]?.id}]) : null);

  useEffect(() => {
    if (singleUnit) {
      setUnitValue({
        unitid: singleUnit?.unitid,
        unitName: singleUnit?.unitName,
        decimalPoint: singleUnit?.decimalPoint,
        // image: singleUnit.image
      });
    }
  }, [singleUnit]);

  const handleValidation = () => {
    let errorss = {};
    let isValid = false;
    if (!unitValue["unitName"].trim()) {
      errorss["unitName"] = getFormattedMessage(
        "globally.input.name.validate.label"
      );
    }
    // else if (!unitValue['decimal_points'].trim()) {
    //     errorss['decimal_points'] = getFormattedMessage("unit.modal.input.decimal-point.validate.label");
    // }
    // else if ((unitValue['decimalPoint'] && unitValue['decimalPoint'].length > 50)) {
    //     errorss['decimalPoint'] = getFormattedMessage("unit.modal.input.short-name.valid.validate.label");
    // }
    // else if (!unitValue['base_unit']) {
    //     errorss['base_unit'] = getFormattedMessage("unit.modal.input.product-group.validate.label");
    // }
    else {
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

  // const onProductGroupChange = (obj) => {
  //     setUnitValue(unitValue => ({...unitValue, base_unit: obj}));
  // };

  const prepareFormData = (data) => {
    // const params = new URLSearchParams();
    // params.append('name', data.name);
    // params.append('decimalPoint', data.decimalPoint);
    // if (data.base_unit[0]) {
    //     params.append('base_unit', data.base_unit[0].value);
    // } else {
    //     params.append('base_unit', data.base_unit.value);
    // }
    // return params;
    let formData = {
      unitid: data.unitid,
      unitName: data.unitName,
      decimalPoint: data.decimalPoint ? data.decimalPoint : 0,
    };
    return formData;
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const valid = handleValidation();
    if (singleUnit && valid) {
      if (!disabled) {
        editUnit(singleUnit.unitid, prepareFormData(unitValue), handleClose);
        clearField(false);
      }
    } else {
      if (valid) {
        setUnitValue(unitValue);
        addProductData(prepareFormData(unitValue));
        clearField(false);
      }
    }
  };

  const clearField = () => {
    setUnitValue({
      unitName: "",
      decimalPoint: "",
      // base_unit: ''
    });
    setErrors("");
    // handleClose(false);
    handleClose ? handleClose(false) : hide(false);
  };

  return (
    <Modal
      show={show}
      onHide={clearField}
      keyboard={true}
      onShow={() =>
        setTimeout(() => {
        console.log(document.getElementById("name").focus());
          // innerRef.current.focus();
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
                {getFormattedMessage("globally.input.unit.name")}:{" "}
              </label>
              <span className="required" />
              <input
                type="text"
                name="unitName"
                id="name"
                value={unitValue.unitName}
                placeholder={placeholderText(
                  "globally.input.name.placeholder.label"
                )}
                className="form-control"
                ref={innerRef}
                autoComplete="off"
                onChange={(e) => onChangeInput(e)}
              />
              <span className="text-danger d-block fw-400 fs-small mt-2">
                {errors["unitName"] ? errors["unitName"] : null}
              </span>
            </div>
            <div className="col-md-12 mb-3">
              <label className="form-label">
                {getFormattedMessage("unit.modal.input.decimal-point.label")}:{" "}
              </label>
              <span className="required" />
              <select
                name="decimalPoint"
                className="form-control"
                placeholder={placeholderText(
                  "unit.modal.input.decimal-point.placeholder.label"
                )}
                onChange={(e) => onChangeInput(e)}
                value={unitValue?.decimalPoint}
              >
                {[0, 1, 2, 3].map((e, index) => {
                  return (
                    <option value={e} key={index}>
                      {e}
                    </option>
                  );
                })}
              </select>
              {/* <input
                type="text"
                name="decimalPoint"
                className="form-control"
                value={unitValue.decimalPoint}
                placeholder={placeholderText(
                  "unit.modal.input.decimal-point.placeholder.label"
                )}
                onChange={(e) => onChangeInput(e)}
              /> */}
              <span className="text-danger d-block fw-400 fs-small mt-2">
                {errors["decimalPoint"] ? errors["decimalPoint"] : null}
              </span>
            </div>
            {/* <div className='col-md-12 mb-3'>
                            <ReactSelect title={getFormattedMessage("unit.modal.input.product-group.label")}
                                         placeholder={placeholderText("unit.modal.input.product-group.placeholder.label")}
                                         // defaultValue={selectedProductGroup}
                                         defaultValue={unitValue.base_unit}
                                         value={unitValue.base_unit}
                                         data={base}
                                         onChange={onProductGroupChange} errors={errors['base_unit']}/>
                        </div> */}
          </div>
        </Modal.Body>
      </Form>
      <ModelFooter
        onEditRecord={singleUnit}
        onSubmit={onSubmit}
        editDisabled={disabled}
        clearField={clearField}
        addDisabled={!unitValue?.unitName?.trim()}
      />
    </Modal>
  );
};

const mapStateToProps = (state) => {
  const { base } = state;
  return { base };
};

export default connect(mapStateToProps, { fetchAllProductGroups, editUnit })(
  UnitsForm
);
