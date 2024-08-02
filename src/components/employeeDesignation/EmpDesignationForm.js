import { Form, Modal } from "react-bootstrap-v5";
import { getFormattedMessage, placeholderText } from "../../shared/sharedMethod";
import ModelFooter from "../../shared/components/modelFooter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { connect } from "react-redux";
import { editEmpDesignation } from "../../store/action/empDesignationAction";

const EmpDesignationForm =(props) => {
    const {show,handleClose,title,addEmpDesignationData,id,singleEmpDesignation,showEdit,handleEdit,editEmpDesignation} =props;

const closeButtonClick =() => {
    handleClose(show)
}

    const [empDesignationValue,setEmpDesignationValue] =useState({
        designationId: singleEmpDesignation ? singleEmpDesignation?.designationId : 0,
        designationName : singleEmpDesignation ? singleEmpDesignation?.designationName : "",
        isActive: singleEmpDesignation ? (singleEmpDesignation?.isActive =="Yes" ? true : false) : true
    })

    const [errors, setErrors] = useState({
        designationName :"",
        isActive : false
    });

    const onChangeInput = (e) => {
        e.preventDefault();
        setEmpDesignationValue((inputs) => ({
          ...inputs,
          [e.target.name]: e.target.value,
        }));
       
    
        setErrors("");
      };
    
      const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
    
        setEmpDesignationValue((prev) => ({
          ...prev,
    
          [name]: type === 'checkbox' ? checked : value
        }
        ));
      };

      
  const disabled = false;

  const handleValidation = () => {
    let errors = {};
    let isValid = false;
   
    if (!empDesignationValue["designationName"]) {
      errors["designationName"] = getFormattedMessage("designationName.input.name.validate.label");
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
      "designationId": data.designationId,
      "designationName":data.designationName,
      "remarks": "",
      "isActive": data.isActive,

    }
    return formData;
  }


  const onSubmit = (event) => {
    event.preventDefault();
    const valid = handleValidation();
    if (singleEmpDesignation) {
      if (!disabled && valid) {
        console.log("Hiii")
        handleClose(!show)
        editEmpDesignation(singleEmpDesignation.designationId, prepareFormData(empDesignationValue),handleClose);
        // handleClose
        // clearField(false);
      }
    }
    else {
      if (valid) {
        // setLedgerValue( ledgerValue );
        handleClose(!show)
        addEmpDesignationData(prepareFormData(empDesignationValue),handleClose);
       
        // clearField(false);
      }
     }
  };


  const clearField = () => {
    handleClose(show)
  }
    


    return (
        <Modal
         show={show}
        >
        <Form >

          <Modal.Header  >
            <Modal.Title>{title} </Modal.Title>
            <button  style={{backgroundColor:"white",display:"flex",gap:"10px",border:"none" }}
                      onClick={closeButtonClick} >
              <FontAwesomeIcon 
              icon={faXmark}
              className="fa-2x search-icon"
              style={{height:"20px",width:"27px",marginTop:"2px",color:"gray" 
                
              }}
              
               ></FontAwesomeIcon>
            </button>
          </Modal.Header>

          <Modal.Body>
            <div className="row">
              <div className="col-md-12 mb-3">
                <label className="form-label">
                  {getFormattedMessage("designationName.title")}:{" "}
                </label>
                <span className="required" />
                <input
                  type="text"
                  name="designationName"
                  id="designationName"
                   value={empDesignationValue.designationName}
                  placeholder={placeholderText(
                    "globally.input.designationName.placeholder.label"
                  )}
                  className="form-control"
                  autoComplete="off"
                  onChange={(e) => onChangeInput(e)}
                />
                <span className="text-danger d-block fw-400 fs-small mt-2">
                  {errors["designationName"] ? errors["designationName"] : null}
                </span>
              </div>

            <div className="row" >
             <div className="col-md-12">
              <input
                type="checkbox"
                name="isActive"
              className="me-3 form-check-input cursor-pointer mt-1 "
                style={{ marginLeft: "10px" }}
                checked={empDesignationValue.isActive}
                placeholder={placeholderText(
                  "globally.input.remarks.placeholder.label"
                )}
                 onChange={(e) => handleInputChange(e)}
              />
              <label className="form-label mt-1">
                {getFormattedMessage("globally.input.isActive.label")}
              </label>

              <span className="text-danger d-block fw-400 fs-small mt-2"></span>
             </div>
        </div>

              </div>

                     
          </Modal.Body>
        </Form>
        <ModelFooter
           onEditRecord={singleEmpDesignation}
           onSubmit={onSubmit}
           editDisabled={disabled}
           clearField={clearField}
        addDisabled={!empDesignationValue?.designationName}
        />
      </Modal>
    )
}

export default connect(null,{editEmpDesignation}) (EmpDesignationForm)