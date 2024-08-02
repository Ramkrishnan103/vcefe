import React, { useState, createRef, useEffect } from "react";
import { connect } from "react-redux";
import { Form, Modal } from "react-bootstrap-v5";
import {getFormattedMessage,placeholderText} from "../../shared/sharedMethod";
import { editUnit } from "../../store/action/unitsAction";
import ModelFooter from "../../shared/components/modelFooter";
import ReactSelect from "../../shared/select/reactSelect";
// import { fetchAllProductGroups } from "../../store/action/productGroupsAction";
import '../../assets/css/custom.css';
import { addTaxSetup, editTaxSetup } from "../../store/action/TaxSetupAction";
import { useNavigate } from "react-router";

const TaxSetupForm = (props) => {
  const {
    handleClose,
   
    base,
    fetchAllProductGroups,
    show,
    title,
    addProductData,
    editTaxSetup,
    addTaxSetup,
    editUnit,
    singleTaxSetup,
    hide,
    product_unit,

  } = props;


  const innerRef = createRef();

  console.log("single taxSetup ", singleTaxSetup)
  // const newUnit = singleUnit && base.filter((da) => singleUnit.base_unit === da.attributes.name);

  const [taxsetupValue, setTaxSetupValue] = useState({
     taxId: singleTaxSetup ? singleTaxSetup.taxId : 0,
    taxPercentage: singleTaxSetup ? singleTaxSetup.taxPercentage :"",
    taxName: singleTaxSetup ? singleTaxSetup.taxName : "",
     remarks: singleTaxSetup ? singleTaxSetup.remarks : "",
    // base_unit: ''
  });

  
  console.log("taxSetUp value => ..",taxsetupValue)
  
  const [errors, setErrors] = useState({
    taxPercentage: "",
    taxName: "",
   
  });

  
 
  const disabled = false;
  
  const handleValidation = () => {
    let errorss = {};
    let isValid = false;
    
    
    if (!taxsetupValue["taxName"].trim()) {
      errorss["taxName"] = getFormattedMessage(
        "globally.input.taxNameError.label"
       
      );
    }
    else {
      isValid = true;
    }
    setErrors(errorss);
    return isValid;
  };

  const onChangeInput = (e) => {
    const { value } = e.target;
    
    
    if (value === '' || (!isNaN(value) && parseFloat(value) <= 100)) {
        setTaxSetupValue((inputs) => ({ ...inputs, taxPercentage: value }));
        setErrors('');
    } else {
        setErrors("globally.input.nameLengthError.label");
    }
}


    
   
  const onChangeTaxName=(e)=>{
  
     setTaxSetupValue((inputs) =>({...inputs, taxName:e.target.value }))
     setErrors("");  
  }
 
 
  const prepareFormData = (data) => {
    
    console.log("data",data)
   
    let formData = {
      taxId: data.taxId,
      taxPercentage: data.taxPercentage,
      taxName: data.taxName,
      remarks: "Good",
    };
    return formData;
  };



  const onSubmit = (event) => {
    event.preventDefault();
    const valid = handleValidation();
    if (singleTaxSetup) {
      if (!disabled && valid) {
        editTaxSetup(singleTaxSetup.taxId,prepareFormData(taxsetupValue), handleClose );
        console.log("lasskanww")
        clearField(false);
      }
    } else {
      if (valid) {
         setTaxSetupValue(taxsetupValue);
         console.log(!show)

        addTaxSetup(prepareFormData(taxsetupValue),handleClose);
        clearField(false);
       
      }
    }
  };

  const clearField = () => {
    setTaxSetupValue({
      taxPercentage: "",
      taxName: "",
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
      // onShow={() =>
      //   setTimeout(() => {
      //     innerRef.current.focus();
      //   }, 1)
      // }
    >
      <Form
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            onSubmit(e);
          }
        }}
      >
        <Modal.Header  closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-12 mb-3">
              <label className="form-label">
                {getFormattedMessage("globally.input.taxpercentage.label")}:{" "}
              </label>
              <span className="required" />
              <input
                type="number"
                name="taxPercentage"
                value={taxsetupValue.taxPercentage}
                placeholder={placeholderText(
                  "globally.input.taxpercentage.placeholder.label"
                )}
                className="form-control"
                ref={innerRef}
                autoComplete="off"
                onChange={(e) => onChangeInput(e)}
               
               
              />
              <span className="text-danger d-block fw-400 fs-small mt-2">
                {errors["taxPercentage"] ? errors["taxPercentage"] : null}
              </span>
            </div>
            <div className="col-md-12 mb-3">
              <label className="form-label">
                {getFormattedMessage("globally.input.taxname.label")}:{" "}
              </label>
              <span className="required" />
              <input
                type="text"
                name="taxName"
                className="form-control"
                value={taxsetupValue.taxName}
                 autoComplete="off"
                placeholder={placeholderText(
                  "taxsetup.modal.input.taxname.placeholder.label"
                )}
               
                onChange={(e) => onChangeTaxName(e)}
              />
              <span className="text-danger d-block fw-400 fs-small mt-2">
                {errors["taxName"] ? errors["taxName"] : null}
              </span>
            </div>
           
          </div>
        </Modal.Body>
      </Form>
        <ModelFooter
          onEditRecord={singleTaxSetup}
          onSubmit={onSubmit}
          editDisabled={disabled}
          clearField={clearField}
          addDisabled={!taxsetupValue.taxPercentage} 
        />
    </Modal>
  );
};


export default connect(null, { editTaxSetup,addTaxSetup })(
  TaxSetupForm
);
