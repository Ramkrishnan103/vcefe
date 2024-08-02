import { useState } from "react";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar"
import MasterLayout from "../MasterLayout"
import { Button } from "react-bootstrap-v5";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { useNavigate } from "react-router";
import { Filters } from "../../constants";
import { connect } from "react-redux";
import EmpDesignationForm from "./EmpDesignationForm";
import { addEmpDesignation } from "../../store/action/empDesignationAction";

const EmpDepartmentCreate =  (props) => {

    const {show,handleClose,addEmpDesignation} =props;
    


    const addEmpDesignationData = (formValue) => {
        addEmpDesignation(formValue, handleClose, Filters.OBJ);
    }
   

    return(
        
            <EmpDesignationForm show={show} handleClose={handleClose} addEmpDesignationData={addEmpDesignationData}
            title={getFormattedMessage('empDesignaiton.create.title')}/>
            
    )
}


export default connect(null,{addEmpDesignation}) (EmpDepartmentCreate)