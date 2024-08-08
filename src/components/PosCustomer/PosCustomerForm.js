import {
  getFormattedMessage,
  placeholderText,
} from "../../shared/sharedMethod";
import { Form } from "react-bootstrap-v5";
import ModelFooter from "../../shared/components/modelFooter";
import { connect } from "react-redux";
import { useState,useRef,useEffect } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import ReactSelect from "../../shared/select/reactSelect";
import { editCustomer} from "../../store/action/PosCustomerAction";
import * as EmailValidator from 'email-validator';


const PosCustomerForm=(props)=>{
const {id,editCustomer,handleClose,singleCustomer,addCustomerData,to,title}=props
console.log("ID => ", id)


  const [CustomerValue,setCustomerValue]=useState({
    customerName: singleCustomer ? singleCustomer[0]?.customerName : "",
        customerCode: singleCustomer  ? singleCustomer [0]?.customerCode : "",
        address:  singleCustomer  ?  singleCustomer [0]?.address : "",
        area:singleCustomer  ?  singleCustomer [0]?.area : "",
        city:singleCustomer  ?  singleCustomer [0]?.city : "",
        state:singleCustomer  ?  singleCustomer [0]?.state : "",
        location:singleCustomer  ?  singleCustomer [0]?.location : "Local State",
       gstNo: singleCustomer ? singleCustomer[0]?.gstNo : "",
      email: singleCustomer ? singleCustomer[0]?.email:"",
        mobileNo: singleCustomer ? singleCustomer[0]?.mobileNo:"",
    entry: singleCustomer ? singleCustomer[0]?.entry:"",
      isActive: singleCustomer ? (singleCustomer[0]?.isActive=="yes"? true:false):true
       
})
  const [errors,setErrors]=useState({
    customerName:'',
    state:'',
    location:'',
    email:""
  })
  

  const handleValidation = () => {
    let errors = {};
    let isValid = false;
   
    if (!CustomerValue["customerName"]) {
      errors["customerName"] = getFormattedMessage("CustomerName.input.name.validate.label");
    }
    
    else if (!CustomerValue["state"]) {
      errors["state"] = getFormattedMessage("globally.input.state.validate.label");
    }
    else if(!CustomerValue['location']){
      errors["location"] = getFormattedMessage("globally.input.location.validate.label");
    }
   
    else if(CustomerValue["email"]&& !EmailValidator.validate( CustomerValue[ 'email' ] ) ){
      errors["email"]=getFormattedMessage("email.input.invalidate.label")
    }
    
    else {
      isValid = true;
    }
    setErrors(errors);
    return isValid;
  };

  const handleInputChange=(e)=>{
    const {name,value,type,checked}=e.target;
    
      setCustomerValue((prev) => ({
        ...prev,
       [name]:type==="checkbox"?checked:value
      }));
    
   
  
  }
  const locationType = [
    
    { value: "Local State", label: "Local State" },
    { value: "Other State",label: "Other State" },
    {value:"Other Country",label:"Other Country"}
  ];
  const navigate = useNavigate();

  const handleDropdownChange=(option)=>{
    setCustomerValue((prev) => ({
      ...prev,
     location: option.value
    }));
  }
const disabled=false;
const prepareFormData=(data)=>{
  // console.log("data",data)
let formData = {
   id:id,
   ledgerName:data.customerName,
   altlanguage:"",
   undergroup:"CUSTOMERS",
   dob:"",
   mobileno1:data.mobileNo,
   mobileno2:"",
   regno:data.gstNo,
   email:data.email,
   address:data.address,
   area:data.area,
   city:data.city,
   state:data.state,
   country:"",
   location:data.location,
   isactive:data.isActive,
   remarks:"",
   entryfrom:data.entry,
   forSales:false
  }
return formData;
}
  const onSubmit=(e)=>{
      e.preventDefault();
      const valid=handleValidation();
      if(singleCustomer){
        if(!disabled&&valid){
        editCustomer(id,prepareFormData(CustomerValue),navigate);
        // handleClose()
        // clearField()
      }
      }
      else{
        if(valid){
          addCustomerData(prepareFormData(CustomerValue));
          // clearField()
        }
      }
  }
  const clearField = () => {
    navigate("/app/posCustomer")
  };
 
  return(
    <div>
      <div className="d-md-flex align-items-center justify-content-between mb-5">
      {title ?<h1 className="mb-0 create-title">{title}</h1> :""}
      <div className="text-end mt-4 mt-md-0">
       

        {singleCustomer ? (
          <Link to={singleCustomer} className="btn btn-primary me-3  save-btn"
           style={{width:"100px"}} onClick={onSubmit}>
            {getFormattedMessage("globally.update-btn")}
          </Link>
        ) : 
        <Link to={""} className="btn btn-primary  me-3 save-btn"
        style={{width:"100px"}} onClick={onSubmit}>
         {getFormattedMessage("globally.save-btn")}
       </Link>
        }
         {to ? (
          <Link to={to} className="btn btn-outline-primary back-btn">
            {getFormattedMessage("globally.back-btn")}
          </Link>
        ) : null}
        </div>
        
          {/* <button className="btn btn-outline-primary back-btn">
            {getFormattedMessage("globally.back-btn")}
          </button>
         */}
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
                checked={CustomerValue.isActive}
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
              {getFormattedMessage(  "globally.input.customerName.label"
)}
            </label>
            <span className="required" />
            <input
              type="text"
              name="customerName"
              value={CustomerValue.customerName}
              // placeholder={placeholderText(
              //   "globally.input.Ledgername.placeholder.label"
              // )}
              autoComplete="off"
              className="form-control"
              onChange={handleInputChange}
            />
            <span className="text-danger d-block fw-400 fs-small mt-2">
              {errors["customerName"] ? errors["customerName"] : null}
            </span>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              {getFormattedMessage(  "customerCode.title")}
            </label>

            <input
              type="text"
              name="customerCode"
              value={CustomerValue.customerCode}
              // placeholder={placeholderText(
                // "globally.input.alterLanguage.placeholder.label"
              // )}
              autoComplete="off"
              className="form-control"
              onChange={handleInputChange}
            />
            <span className="text-danger d-block fw-400 fs-small mt-2"></span>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              {getFormattedMessage("globally.input.address.label")}
            </label>

            <input
              type="text"
              name="address"
              autoComplete="off"
              className="form-control"
              value={CustomerValue.address}
              // placeholder={placeholderText(
                // "globally.input.address.placeholder.label"
              // )}
              onChange={handleInputChange}
            />
            <span className="text-danger d-block fw-400 fs-small mt-2"></span>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              {getFormattedMessage("globally.input.area.label")}
            </label>
            <div className="position-relative">
              <input
                type="text"
                name="area"
                autoComplete="off"
                className="form-control"
                value={CustomerValue.area}
                onChange={handleInputChange}
              />
            </div>
            <span className="text-danger d-block fw-400 fs-small mt-2"></span>
          </div>


          <div className="col-md-6 mb-3">
            <label className="form-label">
              {getFormattedMessage("globally.input.city.label")}
            </label>

            <input
              type="text"
              name="city"
              autoComplete="off"
              className="form-control"
              value={CustomerValue.city}
              // placeholder={placeholderText(
              //   "globally.input.city.placeholder.label"
              // )}
              onChange={handleInputChange}
            />
            <span className="text-danger d-block fw-400 fs-small mt-2"></span>
          </div>


          <div className="col-md-6 mb-3">
            <label className="form-label">
              {getFormattedMessage("globally.input.state.label")}
            </label>
            <span className="required" />
            <input
              type="text"
              name="state"
              autoComplete="off"
              className="form-control"
              value={CustomerValue.state}
             
              onChange={handleInputChange}
            />
            <span className="text-danger d-block fw-400 fs-small mt-2">
              {errors["state"] ? errors["state"] : null}
            </span>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              {getFormattedMessage("globally.input.location-label")}
            </label>
            <span className="required" />
            <ReactSelect
                        name='location'
                        value={locationType.find(option => option.value === CustomerValue.location)} 
                        
                        data={locationType} 
                        onChange={handleDropdownChange} 
                      />
           <span className="text-danger d-block fw-400 fs-small mt-2">
              {errors["location"] ? errors["location"] : null}
            </span>
          </div>


          <div className="col-md-6 mb-3">
            <label className="form-label">
              {getFormattedMessage("globally.input.gstNo.label")}
            </label>

            <input
              type="text"
              name="gstNo"
              className="form-control"
              autoComplete="off"
              value={CustomerValue.gstNo}
              // placeholder={placeholderText(
              //   "globally.input.gstNo.placeholder.label"
              // )}
              onChange={handleInputChange}
            />
            <span className="text-danger d-block fw-400 fs-small mt-2"></span>
          </div>


          <div className="col-md-6 mb-3">
            <label className="form-label">
              {getFormattedMessage("globally.input.email.label")}
            </label>

            <input
              type="text"
              name="email"
              autoComplete="off"
              className="form-control"
              value={CustomerValue.email}
              // placeholder={placeholderText(
              //   "globally.input.email.placeholder.label"
              // )}
              onChange={handleInputChange}
            />
            <span className="text-danger d-block fw-400 fs-small mt-2">
              {errors["email"] ? errors["email"] : null}
            </span>
          </div>


          <div className="col-md-6 mb-3">
            <label className="form-label">
              {getFormattedMessage("globally.input.Mobileno.label")}
            </label>

            <input
              type="number"
              name="mobileNo"
              autoComplete="off"
              className="form-control"
              pattern="[0-9]*"
              value={CustomerValue.mobileNo}
              // placeholder={placeholderText("globally.input.phone-number1.placeholder.label")}
              onChange={handleInputChange}
              // onKeyDown={mobileNo1handleKeyDown}
            />
            <span className="text-danger d-block fw-400 fs-small mt-2"></span>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              {getFormattedMessage("globally.input.entryFrom.label")}
            </label>

            <input
              type="text"
              name="entry"
              autoComplete="off"
              className="form-control"
              // pattern="[0-9]*"
              value={CustomerValue.entry}
              // placeholder={placeholderText("globally.input.phone-number2.placeholder.label")}
              onChange={handleInputChange}
              // onKeyDown={mobileNo2handleKeyDown}
            />
            <span className="text-danger d-block fw-400 fs-small mt-2"></span>
          </div>
          </div>
         

          {/* <ModelFooter
                  onEditRecord={singleLedger}
                  onSubmit={onSubmit}
                  editDisabled={false}
                  addDisabled={!ledgerValue.ledgerName}
                  to="/app/ledger"
                  clearField={clearField}
                /> */}
         
      </Form>
    </div>
    </div>
    </div>
  )
}

export default connect(null,{editCustomer} )(PosCustomerForm);

 