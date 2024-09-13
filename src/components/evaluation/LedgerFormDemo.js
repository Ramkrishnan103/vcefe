import ReactDatePicker from "react-datepicker";
import {
  getFormattedMessage,
  placeholderText,
} from "../../shared/sharedMethod";
import { Form } from "react-bootstrap-v5";
import ModelFooter from "../../shared/components/modelFooter";
import { connect } from "react-redux";
import { editLedger } from "../../store/action/ledgerAction";
import { useState } from "react";
import { useNavigate } from "react-router";
import ReactSelect from "../../shared/select/reactSelect";
import { useRef } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { width } from "@fortawesome/free-solid-svg-icons/fa0";

const LedgerFormDemo = (props) => {
  const { id, editLedger, handleClose, show, hide, singleLedger, addLedgerData,to,title} = props;

  console.log("ID => ", id)

  const navigate = useNavigate();

  console.log("single LegerDemo", singleLedger);
  // const [dropDownChange,setDropDownChange] =useState()

  const [ledgerValue, setLedgerValue] = useState({
    ledgerCode:singleLedger ? singleLedger[0].ledgerCode :"",
    ledgerName: singleLedger ? singleLedger[0].ledgerName :"",
    alterLanguage: singleLedger ? singleLedger[0].alterLanguage :"",
    underGroup: singleLedger ? singleLedger[0].underGroup :"",
    dob: singleLedger ? singleLedger[0].dob === null ? null : moment(singleLedger[0].dob).format("YYYY-MM-DD") :null,
    mobileNo1: singleLedger ? singleLedger[0].mobileNo1 : "",
    mobileNo2: singleLedger ? singleLedger[0].mobileNo2 : "",
    regNo: singleLedger ? singleLedger[0].regNo : "",
    email: singleLedger ? singleLedger[0].email :"",
    address: singleLedger ? singleLedger[0].address : "",
    city: singleLedger ? singleLedger[0].city : "",
    state: singleLedger ? singleLedger[0].state : "",
    country: singleLedger ? singleLedger[0].country : "",
    remarks: singleLedger ? singleLedger[0].remarks : "",
    isActive: singleLedger ? singleLedger[0].isActive :true,
    id: singleLedger ? singleLedger[0].id : '',
    entryfrom: singleLedger ? singleLedger[0].entryfrom : '',
    forSales: singleLedger ? singleLedger[0].forSales : true
  });

  console.log("single LegerDemo", singleLedger);

  const [errors, setErrors] = useState({
    ledgerName: "",
   ledgerCode:"",
    underGroup: "",
    dob: "",
    mobileNo1: "",
    mobileNo2: "",
    regNo: "",
    email: "",
    address: "",
    city: "",
    state: "",
    country: "",
    remarks: "",
    isActive: "",
    id: ''
  });

  const handleValidation = () => {
    let errors = {};
    let isValid = false;
    // console.log("handleValidation productValue", productValue);
    // console.log("name==>", !productValue["name"]);
    if (!ledgerValue["ledgerName"]) {
      errors["ledgerName"] = getFormattedMessage("LedgerName.input.name.validate.label");
    }
    else if (!ledgerValue["ledgerCode"]) {
      errors["ledgerCode"] = getFormattedMessage( "globally.input.LedgerCode.label");
    }
    if (!ledgerValue["underGroup"]) {
      errors["underGroup"] = getFormattedMessage("LedgerUnderGroup.input.name.validate.label");
    }
    else {
      isValid = true;
    }
    setErrors(errors);
    return isValid;
  };


  // const mobileNo1handleChange = (e) => {
  //   const { name, value } = e.target;
  //   const sanitizedValue = name === 'mobileNo1' ? value.replace(/[eE+-]/g, '') : value;
  //   setLedgerValue({ ...ledgerValue, [name]: sanitizedValue });
  // };

  // const mobileNo1handleKeyDown = (e) => {
  //   if (e.target.name === 'mobileNo1' && (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-')) {
  //     e.preventDefault();
  //   }
  // };
  // const mobileNo2handleChange = (e) => {
  //   const { name, value } = e.target;
  //   const sanitizedValue = name === 'mobileNo2' ? value.replace(/[eE+-]/g, '') : value;
  //   setLedgerValue({ ...ledgerValue, [name]: sanitizedValue });
  // };

  // const mobileNo2handleKeyDown = (e) => {
  //   if (e.target.name === 'mobileNo2' && (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-')) {
  //     e.preventDefault();
  //   }
  // };



  const onChangeInput = (e) => {
    e.preventDefault();
    setLedgerValue((inputs) => ({
      ...inputs,
      [e.target.name]: e.target.value,
    }));
   

    setErrors("");
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setLedgerValue((prev) => ({
      ...prev,

      [name]: type === 'checkbox' ? checked : value
    }
    ));
  };



  const disabled = false;

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
  };

  const clearField = () => {
    navigate("/app/ledger")
  };

  const options = [
   
    { value: 'bank', label: 'BANK' },
    { value: 'cash-in-hand', label: 'CASH-IN-HAND' },
    { value: 'others', label: 'OTHERS' }
  ];

  const underGroupChange = (selectedOption) => {
    setLedgerValue((prev) => ({ ...prev, underGroup: selectedOption.value }));
  };

  console.log(ledgerValue.underGroup)

  return (
    <div>
    <div className="d-md-flex align-items-center justify-content-between mb-5">
    {title ?<h1 className="mb-0 create-title">{title}</h1> :""}
    <div className="text-end mt-4 mt-md-0">
     


    <div className="row ">
      <div className="col d-flex"> 

            <Link
              to={singleLedger ? singleLedger : ""}
              className="btn btn-primary me-3 save-btn "
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
      
       
{/*       </div> */}
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
              <label className="form-label">
                {getFormattedMessage("globally.input.LedgerName.label")}
              </label>
              <span className="required" />
              <input
                type="text"
                name="ledgerName"
                value={ledgerValue.ledgerName}
               
                autoComplete="off"
                className="form-control"
                onChange={(e) => onChangeInput(e)}
              />
              <span className="text-danger d-block fw-400 fs-small mt-2">
                {errors["ledgerName"] ? errors["ledgerName"] : null}
              </span>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">
                {getFormattedMessage("globally.input.LedgerCode.label")}
              </label>
              <span className="required" />
              <input
                type="text"
                name="ledgerCode"
                value={ledgerValue.ledgerCode}
               
                autoComplete="off"
                className="form-control"
                onChange={(e) => onChangeInput(e)}
              />

              <span className="text-danger d-block fw-400 fs-small mt-2"> {errors["ledgerCode"] ? errors["ledgerCode"] : null}</span>
            </div>
            <div className="row">
  <div className="col-md-6 mb-3">
    <label className="form-label">
      {getFormattedMessage("globally.input.underGroup.label")}
    </label>
    <span className='required' />
    <ReactSelect
      className="position-relative"
      name="underGroup"
      placeholder={placeholderText(
        "globally.input.underGroup.placeholder.label"
      )}
      value={options.find(option => option.value === ledgerValue.underGroup )}
      data={options}
      onChange={underGroupChange}
    />
    <span className="text-danger d-block fw-400 fs-small mt-2">
      {errors["underGroup"] ? errors["underGroup"] : null}
    </span>
  </div>
  <div className="col-md-6 mb-3">
    <label className="form-check form-check-custom form-check-solid form-check-inline d-flex align-items-center my-4 cursor-pointer custom-label">
      <div className="d-flex align-items-center " style={{marginLeft:"20px",marginTop:"10px"}}>
      <input
          type="checkbox"
          name="forSales"
          className="form-check-input cursor-pointer"
          style={{ width: "22px", height: "22px" }}
          checked={ledgerValue.forSales}
          onChange={(e) => handleInputChange(e)}
        />
        <span className="me-3">
          {getFormattedMessage("product.input.forSales.label")}
        </span>
        
      </div>
    </label>
  </div>
</div>

<div className="row">
   <div className="col-md-6 mb-3">
   <label className="form-label">
                {getFormattedMessage( "globally.input.entryFrom.label")}
              </label>

              <input
                type="text"
                name="entryfrom"
                value={ledgerValue.entryfrom}
               
                autoComplete="off"
                className="form-control"
                onChange={(e) => onChangeInput(e)}
              />
              <span className="text-danger d-block fw-400 fs-small mt-2"></span>
  </div>

  <div className="col-md-6 mb-3">
   <label className="form-label">
                {getFormattedMessage(  "globally.input.remarks.label")}
              </label>

              <input
                type="text"
                name="remarks"
                value={ledgerValue.remarks}
               
                autoComplete="off"
                className="form-control"
                onChange={(e) => onChangeInput(e)}
              />
              <span className="text-danger d-block fw-400 fs-small mt-2"></span>
  </div>


</div>
<div >

</div >
           </div>
         
        </Form>
      </div>
    </div>
    </div>
  );
};

export default connect(null, { editLedger })(LedgerFormDemo);
