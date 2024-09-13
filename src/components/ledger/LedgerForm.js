import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router';
import { Form } from 'react-bootstrap-v5';
import ReactSelect from '../../shared/select/reactSelect';
import { getFormattedMessage, placeholderText } from '../../shared/sharedMethod';
import { editLedger } from '../../store/action/ledgerAction';
import { Link } from 'react-router-dom';
import moment from 'moment';

const LedgerForm = (props) => {
  const { id, editLedger, handleClose, singleLedger, addLedgerData, to, title } = props;

  const navigate = useNavigate();
  const disabled=false
  const [ledgerValue, setLedgerValue] = useState({
    ledgerCode: singleLedger ? singleLedger[0].ledgerCode : "",
    ledgerName: singleLedger ? singleLedger[0].ledgerName : "",
    alterLanguage: singleLedger ? singleLedger[0].alterLanguage : "",
    underGroup: singleLedger ? singleLedger[0].underGroup : "",
    dob: singleLedger ? singleLedger[0].dob ? moment(singleLedger[0].dob).format("YYYY-MM-DD") : null : null,
    mobileNo1: singleLedger ? singleLedger[0].mobileNo1 : "",
    mobileNo2: singleLedger ? singleLedger[0].mobileNo2 : "",
    regNo: singleLedger ? singleLedger[0].regNo : "",
    email: singleLedger ? singleLedger[0].email : "",
    address: singleLedger ? singleLedger[0].address : "",
    city: singleLedger ? singleLedger[0].city : "",
    state: singleLedger ? singleLedger[0].state : "",
    country: singleLedger ? singleLedger[0].country : "",
    remarks: singleLedger ? singleLedger[0].remarks : "",
    isActive: singleLedger ? singleLedger[0].isActive : true,
    id: singleLedger ? singleLedger[0].id : '',
    entryfrom: singleLedger ? singleLedger[0].entryfrom : '',
    forSales: singleLedger ? singleLedger[0].forSales : true
  });

  const [errors, setErrors] = useState({
    ledgerName: "",
    ledgerCode: "",
    underGroup: ""
  });

  const inputRefs = useRef([]);


  const handleKeyDown = (e, index) => {
    const { key } = e;
    if (key === 'Tab' || key === 'Enter' || key === 'ArrowDown' || key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = index + 1;
      if (inputRefs.current[nextIndex]) {
        inputRefs.current[nextIndex].focus();
      }
    }else if (key === 'ArrowUp'||key==='ArrowLeft') {
      e.preventDefault();
      const prevIndex = index - 1;
      if (inputRefs.current[prevIndex]) {
        inputRefs.current[prevIndex].focus();
      }
    }
  };

  const handleValidation = () => {
    let errors = {};
    let isValid = true;

    if (!ledgerValue.ledgerName) {
      errors.ledgerName = getFormattedMessage("LedgerName.input.name.validate.label");
      isValid = false;
    }
    if (!ledgerValue.ledgerCode) {
      errors.ledgerCode = getFormattedMessage("globally.input.LedgerCode.label");
      isValid = false;
    }
    if (!ledgerValue.underGroup) {
      errors.underGroup = getFormattedMessage("LedgerUnderGroup.input.name.validate.label");
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    let processedValue = name === 'entryfrom' ? value.toUpperCase() : value;

    if (name === "ledgerName" && value.length > 100) {
      setErrors({ ...errors, ledgerName: "Ledger Name cannot exceed 100 characters" });
      return;
    }

    if (name === "ledgerCode") {
      if (!/^[a-zA-Z0-9]*$/.test(processedValue)) {
        setErrors({ ...errors, ledgerCode: "LedgerCode should be alphanumeric" });
        return;
      }

      if (ledgerValue.ledgerCode !== processedValue && ledgerValue.ledgerCode.includes(processedValue)) {
        setErrors({ ...errors, ledgerCode: "LedgerCode already exists" });
        return;
      }
    }

    if (name === "entryfrom" && processedValue.length > 50) {
      setErrors({ ...errors, entryfrom: "EntryFrom cannot exceed more than 50 characters" });
      return;
    }

    if (name === "remarks" && processedValue.length > 250) {
      setErrors({ ...errors, remarks: "Remarks cannot exceed more than 250 characters" });
      return;
    }

    setLedgerValue((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : processedValue
     
    }));

    setErrors({ ...errors, [name]: "" });
  };

  const prepareFormData = (data) => {
  
    let formData = {
    

      "id":id,
      
      "ledgerName": data.ledgerName,
      "altlanguage": "",
      "underGroup": data.underGroup,
      "dob": "2024-05-08",
      "mobileno1": "",
      "mobileno2": "",
      "regno":"",
      "email": "",
      "address": "",
      "area":"",
      "city": "",
      "state": "",
      "country": "",
      "location":"",
      "isactive": data.isActive,
      "remarks": data.remarks,
      "entryfrom": data.entryfrom,
      "forSales": data.forSales
     

    }
    console.log("formData",formData)
    return formData;

  }


  const onSubmit = (event) => {
    
    event.preventDefault();
    const valid = handleValidation();
    if (singleLedger) {
      if (!disabled && valid) {
        editLedger(id, prepareFormData(ledgerValue), navigate);
        handleClose
        clearField(false);
      }
    }
    else {
      if (valid) {
      
        addLedgerData(prepareFormData(ledgerValue));
        clearField(false);
      }
  }
  }
  const options = [
    { value: 'bank', label: 'BANK' },
    { value: 'cash-in-hand', label: 'CASH-IN-HAND' },
    { value: 'others', label: 'OTHERS' }
  ];

  const handleUnderGroupChange = (selectedOption) => {
    setLedgerValue((prev) => ({ ...prev, underGroup: selectedOption.value }));
  };

  return (
    <div>
      <div className="d-md-flex align-items-center justify-content-between mb-5">
        {title && <h1 className="mb-0 create-title">{title}</h1>}
        <div className="text-end mt-4 mt-md-0">
          <div className="row">
            <div className="col d-flex">
              <Link
                to={singleLedger ? singleLedger : ""}
                className="btn btn-primary me-3 save-btn"
                style={{ width: "100px" }}
                onClick={onSubmit}
              >
                {singleLedger ? getFormattedMessage("globally.update-btn") : getFormattedMessage("globally.save-btn")}
              </Link>
              <Link to="/app/ledger" className="btn btn-outline-primary back-btn">
                {getFormattedMessage("globally.back-btn")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <Form>
          <div className="row">
          <div className="col-md-12 mb-3">
        <div style={{ textAlign: "-webkit-right" }} >
        <label className="form-check form-check-custom form-check-solid form-check-inline d-flex align-items-center my-4 cursor-pointer custom-label">
        <input
                type="checkbox"
                name="isActive"
                className="me-3 form-check-input cursor-pointer mt-1 "
                style={{ marginLeft: "10px", width: "22px", height: "22px" }}
                checked={ledgerValue.isActive}
                placeholder={placeholderText(
                  "globally.input.remarks.placeholder.label"
                )}
                onChange={(e) => handleInputChange(e)}
              />
             
              

              <div className="control__indicator" />{" "}
                        {getFormattedMessage("product.input.isactive.label")}
                      </label>
                    </div>

            </div>
        
        </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">{getFormattedMessage("globally.input.LedgerName.label")}</label>
                <span className="required" />
                <input
                  type="text"
                  name="ledgerName"
                  value={ledgerValue.ledgerName}
                  autoComplete="off"
                  className="form-control"
                  ref={(el) => inputRefs.current[0] = el}
                  onKeyDown={(e) => handleKeyDown(e, 0)}
                  onChange={handleInputChange}
                />
                <span className="text-danger d-block fw-400 fs-small mt-2">
                  {errors.ledgerName}
                </span>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">{getFormattedMessage("globally.input.LedgerCode.label")}</label>
                <span className="required" />
                <input
                  type="text"
                  name="ledgerCode"
                  value={ledgerValue.ledgerCode}
                  autoComplete="off"
                  className="form-control"
                  ref={(el) => inputRefs.current[1] = el}
                  onKeyDown={(e) => handleKeyDown(e, 1)}
                  onChange={handleInputChange}
                />
                <span className="text-danger d-block fw-400 fs-small mt-2">
                  {errors.ledgerCode}
                </span>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">{getFormattedMessage("globally.input.underGroup.label")}</label>
                <span className="required" />
                <ReactSelect
                  className="position-relative"
                  name="underGroup"
                  placeholder={placeholderText("globally.input.underGroup.placeholder.label")}
                  value={options.find(option => option.value === ledgerValue.underGroup)}
                  data={options}
                  onChange={handleUnderGroupChange}
                  ref={(el) => inputRefs.current[2] = el}
                  onKeyDown={(e) => handleKeyDown(e, 2)}
                />
                <span className="text-danger d-block fw-400 fs-small mt-2">
                  {errors.underGroup}
                </span>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-check form-check-custom form-check-solid form-check-inline d-flex align-items-center my-4 cursor-pointer custom-label">
                  <input
                    type="checkbox"
                    name="forSales"
                    className="form-check-input cursor-pointer"
                    style={{ width: "22px", height: "22px" }}
                    checked={ledgerValue.forSales}
                    onChange={handleInputChange}
                    disabled={ledgerValue.underGroup !== 'bank'}
                    ref={(el) => inputRefs.current[3] = el}
                  onKeyDown={(e) => handleKeyDown(e, 3)}
                  />
                  <span className="me-3">
                    {getFormattedMessage("product.input.forSales.label")}
                  </span>
                </label>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">{getFormattedMessage("globally.input.entryFrom.label")}</label>
                <input
                  type="text"
                  name="entryfrom"
                  value={ledgerValue.entryfrom}
                  ref={(el) => inputRefs.current[4] = el}
                  onKeyDown={(e) => handleKeyDown(e, 4)}
                  autoComplete="off"
                  className="form-control"
                  onChange={handleInputChange}
                />
                <span className="text-danger d-block fw-400 fs-small mt-2">
                  {errors.entryfrom}
                </span>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">{getFormattedMessage("globally.input.remarks.label")}</label>
                <input
                  type="text"
                  name="remarks"
                  value={ledgerValue.remarks}
                  autoComplete="off"
                  className="form-control"
                  ref={(el) => inputRefs.current[5] = el}
                  onKeyDown={(e) => handleKeyDown(e, 5)}
                  onChange={handleInputChange}
                />
                <span className="text-danger d-block fw-400 fs-small mt-2">
                  {errors.remarks}
                </span>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default connect(null, { editLedger })(LedgerForm);
