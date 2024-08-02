import { Form, Modal } from "react-bootstrap-v5";
import { getFormattedMessage, placeholderText } from "../../shared/sharedMethod";
import ModelFooter from "../../shared/components/modelFooter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { connect } from "react-redux";
import { editEmpDepartment } from "../../store/action/empDepartmentAction";

const EmpDepartmentForm =(props) => {
    const {show,handleClose,title,addEmpDepartmentData,id,singleEmpDepartment,showEdit,handleEdit,editEmpDepartment} =props;
console.log("Show =>" ,show)
console.log("Emp Deapartment =>" ,singleEmpDepartment)


const closeButtonClick =() => {
    handleClose(show)
}

    const [empDepartmentValue,setEmpDepartmentValue] =useState({
        departmentId: singleEmpDepartment ? singleEmpDepartment?.departmentId : 0,
        departmentName :singleEmpDepartment?singleEmpDepartment?.departmentName: "",
        isActive: singleEmpDepartment ? (singleEmpDepartment?.isActive=="Yes" ? true : false) : true
    })

    const [errors, setErrors] = useState({
        departmentName :"",
        isActive : false
    });

    const onChangeInput = (e) => {
        e.preventDefault();
        setEmpDepartmentValue((inputs) => ({
          ...inputs,
          [e.target.name]: e.target.value,
        }));
       
    
        setErrors("");
      };
    
      const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
    
        setEmpDepartmentValue((prev) => ({
          ...prev,
    
          [name]: type === 'checkbox' ? checked : value
        }
        ));
      };

      
  const disabled = false;

  const handleValidation = () => {
    let errors = {};
    let isValid = false;
   
    if (!empDepartmentValue["departmentName"]) {
      errors["departmentName"] = getFormattedMessage("departmentName.input.name.validate.label");
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
      "departmentId": data.departmentId,
      "departmentName":data.departmentName,
      "remarks": "",
      "isActive": data.isActive,

    }
    return formData;
  }


  const onSubmit = (event) => {
    event.preventDefault();
    const valid = handleValidation();
    if (singleEmpDepartment) {
      if (!disabled && valid) {
        console.log("Hiii")
        handleClose(!show)
        editEmpDepartment(singleEmpDepartment.departmentId, prepareFormData(empDepartmentValue),handleClose);
        // handleClose
        // clearField(false);
      }
    }
    else {
      if (valid) {
        // setLedgerValue( ledgerValue );
        handleClose(!show)
        addEmpDepartmentData(prepareFormData(empDepartmentValue),handleClose);
       
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
                  {getFormattedMessage("departmentName.title")}:{" "}
                </label>
                <span className="required" />
                <input
                  type="text"
                  name="departmentName"
                  id="departmentName"
                   value={empDepartmentValue.departmentName}
                  placeholder={placeholderText(
                    "globally.input.Departmentname.placeholder.label"
                  )}
                  className="form-control"
                //   ref={innerRef}
                  autoComplete="off"
                  onChange={(e) => onChangeInput(e)}
                />
                <span className="text-danger d-block fw-400 fs-small mt-2">
                  {errors["departmentName"] ? errors["departmentName"] : null}
                </span>
              </div>

            <div className="row" >
             <div className="col-md-12">
              <input
                type="checkbox"
                name="isActive"
              className="me-3 form-check-input cursor-pointer mt-1 "
                style={{ marginLeft: "10px" }}
                checked={empDepartmentValue.isActive}
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
           onEditRecord={singleEmpDepartment}
           onSubmit={onSubmit}
           editDisabled={disabled}
           clearField={clearField}
           addDisabled={!empDepartmentValue?.departmentName?.trim()}
        />
      </Modal>
    )
}

export default connect(null,{editEmpDepartment}) (EmpDepartmentForm)