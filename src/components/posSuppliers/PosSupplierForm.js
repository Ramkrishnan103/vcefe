import { Form } from "react-bootstrap-v5"
import TopProgressBar from "../../shared/components/loaders/TopProgressBar"
import ModelFooter from "../../shared/components/modelFooter"
import MasterLayout from "../MasterLayout"
import { getFormattedMessage, placeholderText } from "../../shared/sharedMethod"
import { useState } from "react"
import ReactSelect from "../../shared/select/reactSelect"
import { useNavigate } from "react-router"
import { connect, useDispatch } from "react-redux"
import { editSuppliers } from "../../store/action/PosSupplierAction"
import { Link } from "react-router-dom"
import * as EmailValidator from "email-validator";
import { addToast } from "../../store/action/toastAction"

const PosSupplierForm = (props) => {

    const {id,singleSupplier,editSuppliers,handleClose,addSuppliersData, to, editLink,title} =props

    console.log("Single Supplier =>" ,singleSupplier);
    console.log("Id => ", id)

    const navigate =useNavigate();

const [supplierValue,setSupplierValue] = useState ( 
    {
        ledgerName :singleSupplier ? singleSupplier[0]?.supplierName:"",
        ledgerCode :singleSupplier ? singleSupplier[0]?.supplierCode:"",
        address: singleSupplier ? singleSupplier[0]?.address : "",
        area: singleSupplier ? singleSupplier[0]?.area : "",
        city: singleSupplier ? singleSupplier[0]?.city : "",
        state: singleSupplier ? singleSupplier[0]?.state : "Tamil Nadu",
        location: singleSupplier ? singleSupplier[0]?.location : "Local State",
        regNo: singleSupplier ? singleSupplier[0]?.gstNo : "",
        email: singleSupplier ? singleSupplier[0]?.email : "",
        mobileNo1: singleSupplier ? singleSupplier[0]?.mobileNo  : "",
        mobileNo2: singleSupplier ? singleSupplier[0]?.mobileNo2 : "",
        isActive :singleSupplier ? singleSupplier[0]?.isActive :true,
       
    }
)

const [errors, setErrors] = useState({
    isActive: "",
    ledgerName: "",
    ledgerCode: "",
    address: "",
    area: "",
    city: "",
    state: "",
    location: "",
    regNo: "",
    email: "",
    mobileNo1: "",
    id: ''
  });


  const onChangeInput = (e) => {
    e.preventDefault();
    setSupplierValue((inputs) => ({
      ...inputs,
      [e.target.name]: e.target.value,
    }));
    // setLedgerValue(dropDownChange)

    setErrors("");
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSupplierValue((prev) => ({
      ...prev,

      [name]: type === 'checkbox' ? checked : value
    }
    ));
  };

  
  const options = [
    { value: 'localstate', label: 'Local State' },
    { value: 'otherstate', label: 'Other State' },
    { value: 'othercountry', label: 'Other Country' },
  ];

  const locationChange = (selectedOption) => {
    setSupplierValue((prev) => ({ ...prev, location: selectedOption.label }));
  };

  console.log("Location",supplierValue.location)


  const disabled = false;

  const handleValidation = () => {
    let errors = {};
    let isValid = false;
   
    if (!supplierValue["ledgerName"]) {
      errors["ledgerName"] = getFormattedMessage("supplierName.input.name.validate.label");
    }
    else if (!supplierValue["state"]) {
      errors["state"] = getFormattedMessage("state.input.validate.label");
    }
    else if (!supplierValue["location"]) {
      errors["location"] = getFormattedMessage("location.input.validate.label");
    }
    
    else if (supplierValue["email"] && !EmailValidator.validate(supplierValue["email"])) {
      errors["email"] = getFormattedMessage("globally.input.email.valid.validate.label");
      isValid = false;
    }  
   
    else {
      isValid = true;
    }
    setErrors(errors);
    return isValid;
  };

  const prepareFormData = (data) => {
console.log("Data =>" ,data)
    let formData = {
      "ledgerName": data.ledgerName,
      "altlanguage":"",
      "underGroup": "SUPPLIERS",
      "dob": "",
      "mobileno1": data.mobileNo1,
      "mobileno2": "",
      "regno": data.regNo,
      "email": data.email,
      "address": data.address,
      "area":data.area,
      "city": data.city,
      "state": data.state,
      "country": "",
       "location":data.location,
      "isactive": data.isActive,
      "remarks": "",
      "entryfrom": "",
      "forSales": false,
      "id": id

    }
    return formData;
  }

  const dispatch =useDispatch();

  const onSubmit = (event) => {
    event.preventDefault();
    const valid = handleValidation();
    if (singleSupplier) {
      if (!disabled && valid) {
        console.log("Hiii")
        editSuppliers(id, prepareFormData(supplierValue), navigate);
        // handleClose
        // clearField(false);
      }
    }
    else {
      if (valid) {
        // setLedgerValue( ledgerValue );
        addSuppliersData(prepareFormData(supplierValue));
        // clearField(false);
      }
    }
  };


  const mobileNo1handleChange = (e) => {
    const value = e.target.value;
    
    // Allow only digits and limit the length to 15 characters
    if (/^\d*$/.test(value) && value.length <= 15) {
      setSupplierValue({ ...supplierValue, [e.target.name]: value });
    }
  };

  const mobileNo1handleKeyDown = (e) => {
    if (e.target.name === 'mobileNo1' && (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-')) {
      e.preventDefault();
    }
  };



    return(
<div>
            {/* <div className="row">
                <div className="col-md-9"></div>
                <div className="col-md-2">
                 <button class="btn btn-primary me-3 save-btn" type="submit" 
                 onClick={onSubmit} 
                 style={{width:"120px",marginTop:"-104px",marginLeft:"50px"}}>
                  {singleSupplier ? "UPDATE" :"SAVE" }
                </button>
                </div>
            </div> */}

<div className="d-md-flex align-items-center justify-content-between mb-5">
      {title ? <h1 className="mb-0 create-title">{title}</h1> : ""}
      <div className="text-end mt-4 mt-md-0">
        {singleSupplier ? (
          <Link to={singleSupplier} className="btn btn-primary me-3 save-btn"
           style={{width:"120px"}} onClick={onSubmit}>
            {getFormattedMessage("globally.UPDATE-btn")}
          </Link>
        ) : 
        <Link to={""} className="btn btn-primary me-3 save-btn"
        style={{width:"120px"}} onClick={onSubmit}>
         {getFormattedMessage("globally.SAVE-btn")}
       </Link>
        }
        {to ? (
          <Link to={to} className="btn btn-outline-primary back-btn" 
          style={{width:"120px"}}>
            {getFormattedMessage("globally.back-btn")}
          </Link>
        ) : null}
      </div>
</div>
      
        <div className="card">
      <div className="card-body">
        <Form>

        <div className="row" >
            <div className="col-md-10"></div>
             <div className="col-md-2">
              <input
                type="checkbox"
                name="isActive"
              className="me-3 form-check-input cursor-pointer mt-1 "
                style={{ marginLeft: "10px" }}
                checked={supplierValue.isActive}
                // placeholder={placeholderText(
                //   "globally.input.remarks.placeholder.label"
                // )}
                 onChange={(e) => handleInputChange(e)}
                 
              />
              <label className="form-label mt-1">
                {getFormattedMessage("globally.input.isActive.?.label")}
              </label>

              <span className="text-danger d-block fw-400 fs-small mt-2"></span>
             </div>
        </div>
        
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">
                {getFormattedMessage("globally.input.supplierName.label")}
              </label>
              <span className="required" />
              <input
                type="text"
                name="ledgerName"
                value={supplierValue.ledgerName }
                maxLength={100}
                // placeholder={placeholderText(
                //   "globally.input.ledgerName.placeholder.label"
                // )}
                autoComplete="off"
                className="form-control"
                onChange={(e) => onChangeInput(e)}
                autoFocus
              />
              <span className="text-danger d-block fw-400 fs-small mt-2">
                {errors["ledgerName"] ? errors["ledgerName"] : null}
              </span>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">
                {getFormattedMessage("globally.input.supplierCode.label")}
              </label>
             
              <input
                type="text"
                name="supplierCode"
                value={supplierValue.supplierCode}
                maxLength={50}
                // placeholder={placeholderText(
                //   "globally.input.supplierCode.placeholder.label"
                // )}
                autoComplete="off"
                className="form-control"
                onChange={(e) => onChangeInput(e)}
              />
              <span className="text-danger d-block fw-400 fs-small mt-2">
                {errors["supplierCode"] ? errors["supplierCode"] : null}
              </span>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">
                {getFormattedMessage("globally.input.address.label")}
              </label>
             
              <input
                type="text"
                name="address"
                value={supplierValue.address}
                maxLength={100}
                // placeholder={placeholderText(
                //   "globally.input.address.placeholder.label"
                // )}
                autoComplete="off"
                className="form-control"
                onChange={(e) => onChangeInput(e)}
              />
              <span className="text-danger d-block fw-400 fs-small mt-2">
                {errors["address"] ? errors["address"] : null}
              </span>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">
                {getFormattedMessage("globally.input.area.label")}
              </label>
              
              <input
                type="text"
                name="area"
                value={supplierValue.area}
                maxLength={50}
                // placeholder={placeholderText(
                //   "globally.input.area.placeholder.label"
                // )}
                autoComplete="off"
                className="form-control"
                onChange={(e) => onChangeInput(e)}
              />
              <span className="text-danger d-block fw-400 fs-small mt-2">
                {errors["area"] ? errors["area"] : null}
              </span>
            </div>


            <div className="col-md-6 mb-3">
              <label className="form-label">
                {getFormattedMessage("globally.input.city.label")}
              </label>
           
              <input
                type="text"
                name="city"
                value={supplierValue.city}
                maxLength={50}
                // placeholder={placeholderText(
                //   "globally.input.city.placeholder.label"
                // )}
                autoComplete="off"
                className="form-control"
                onChange={(e) => onChangeInput(e)}
              />
              <span className="text-danger d-block fw-400 fs-small mt-2">
                {errors["city"] ? errors["city"] : null}
              </span>
            </div>



            <div className="col-md-6 mb-3">
              <label className="form-label">
                {getFormattedMessage("globally.input.state.label")}
              </label>
              <span className="required" />
              <input
                type="text"
                name="state"
                value={supplierValue.state}
                maxLength={50}
                // placeholder={placeholderText(
                //   "globally.input.state.placeholder.label"
                // )}
                autoComplete="off"
                className="form-control"
                onChange={(e) => onChangeInput(e)}
              />
              <span className="text-danger d-block fw-400 fs-small mt-2">
                {errors["state"] ? errors["state"] : null}
              </span>
            </div>



            <div className="col-md-6 mb-3">
              <label className="form-label">
                {getFormattedMessage("globally.input.location.label")}
              </label>
              <span className="required" />
              <ReactSelect
                className="position-relative"
                maxLength={50}
                // placeholder={placeholderText(
                //   "globally.input.location.placeholder.label"
                // )}

                value={options.find(option => option.label === supplierValue.location)}
                data={options}
                onChange={locationChange}
              />
              <span className="text-danger d-block fw-400 fs-small mt-2">
                {errors["location"] ? errors["location"] : null}
              </span>
            </div>


            <div className="col-md-6 mb-3">
              <label className="form-label">
                {getFormattedMessage("globally.input.GSTNO.label")}
              </label>
            
              <input
                type="text"
                name="regNo"
                value={supplierValue.regNo}
                maxLength={15}
                // placeholder={placeholderText(
                //   "globally.input.GSTNO.placeholder.label"
                // )}
                autoComplete="off"
                className="form-control"
                onChange={(e) => onChangeInput(e)}
              />
              <span className="text-danger d-block fw-400 fs-small mt-2">
                {errors["regNo"] ? errors["regNo"] : null}
              </span>
            </div>



            <div className="col-md-6 mb-3">
              <label className="form-label">
                {getFormattedMessage("globally.input.email.label")}
              </label>
             
              <input
                type="text"
                name="email"
                value={supplierValue.email}
                maxLength={100}
                // placeholder={placeholderText(
                //   "globally.input.email.placeholder.label"
                // )}
                autoComplete="off"
                className="form-control"
                onChange={(e) => onChangeInput(e)}
              />
              <span className="text-danger d-block fw-400 fs-small mt-2">
                {errors["email"] ? errors["email"] : null}
              </span>
            </div>



            <div className="col-md-6 mb-3">
              <label className="form-label">
                {getFormattedMessage("globally.input.mobileno.label")}
              </label>
              
              <input
                type="number"
                name="mobileNo1"
                autoComplete="off"
                className="form-control"
                pattern="[0-9]*"
                value={supplierValue.mobileNo1}
              //  maxLength={15}
              htmlSize={15}
                // placeholder={placeholderText("globally.input.phone-number1.placeholder.label")}
                onChange={(e) => mobileNo1handleChange(e)}
                onKeyDown={mobileNo1handleKeyDown}
              />
              <span className="text-danger d-block fw-400 fs-small mt-2">
                {errors["mobileNo1"] ? errors["mobileNo1"] : null}
              </span>
            </div>

           
            <div className="row">
              <div className="col-md-12">
                {/* <ModelFooter
                  onEditRecord={singleSupplier}
                  onSubmit={onSubmit}
                  // editDisabled={false}
                //   addDisabled={!sin.ledgerName}
                  // to="/app/ledger"
                  clearField={clearField}
                /> */}
              </div>
            </div>

          </div>
        </Form>
      </div>
    </div>
</div>
    )
}

export default connect(null,{editSuppliers}) (PosSupplierForm)