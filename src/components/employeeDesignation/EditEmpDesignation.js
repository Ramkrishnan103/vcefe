import { useEffect } from "react";
import { connect } from "react-redux";

import { getFormattedMessage } from "../../shared/sharedMethod";
import EmpDesignationForm from "./EmpDesignationForm";
import { editEmpDesignation, fetchSpecificEmpDesignations } from "../../store/action/empDesignationAction";

const EditEmpDepartment =(props) => {

    const {empDesignation,fetchSpecificEmpDepartments,show,handleClose,empdesignation,editEmpDesignation} =props;

    console.log("show =>" ,show)


    return(
        <div>
            {empDesignation && <EmpDesignationForm show={show} 
                        handleClose={handleClose} singleEmpDesignation={empdesignation} 
                        title={getFormattedMessage('empDesignation.edit.title')} /> }
       </div>
    )
}

const mapStateToProps = (state) => {
    const {empDesignation} = state;
    return { empDesignation }
}

export default connect(mapStateToProps,{fetchSpecificEmpDesignations,editEmpDesignation}) (EditEmpDepartment)