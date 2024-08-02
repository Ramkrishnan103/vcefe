import { useState } from "react";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar"
import MasterLayout from "../MasterLayout"
import EmpDepartmentForm from "./EmpDepartmentForm"
import { Button } from "react-bootstrap-v5";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { addEmpDepartment } from "../../store/action/empDepartmentAction";
import { useNavigate } from "react-router";
import { Filters } from "../../constants";
import { connect } from "react-redux";
import { title } from "faker/lib/locales/az";

const EmpDepartmentCreate =  (props) => {

    const {show,handleClose,addEmpDepartment,title} =props;
    

    const navigate =useNavigate();

    const addEmpDepartmentData = (formValue) => {
        addEmpDepartment(formValue, navigate, Filters.OBJ);
    }
   

    return(
        <div>
            <EmpDepartmentForm show={show} handleClose={handleClose} addEmpDepartmentData={addEmpDepartmentData}
            title={getFormattedMessage('empDepartment.create.title')}/>
        </div>
    )
}


export default connect(null,{addEmpDepartment}) (EmpDepartmentCreate)