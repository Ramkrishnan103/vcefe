import { useEffect } from "react";
import { connect } from "react-redux";
import { editEmpDepartment, fetchSpecificEmpDepartments } from "../../store/action/empDepartmentAction";
import { useParams } from "react-router";
import EmpDepartmentForm from "./EmpDepartmentForm";
import { getFormattedMessage } from "../../shared/sharedMethod";

const EditEmpDepartment =(props) => {

    const {empDepartment,fetchSpecificEmpDepartments,show,handleClose,empdepartment,editEmpDepartment} =props;

    console.log("show =>" ,show)


    // const {id} =useParams() ;

    // useEffect(() => {
    //     fetchSpecificEmpDepartments(id) ;
    //     editEmpDepartment();
    // },[])

    // console.log("Id",id)

    // const itemsValue = empdepartment && empDepartment.length ===1 && empDepartment.map(empDepartments => ({
    //     departmentName:empDepartments?.attributes?.departmentName,
    //     isActive:empDepartments?.attributes?.isActive,
    //     departmentId: empDepartments?.departmentId 
    // }));
  
    // console.log("Item Value =>",itemsValue)

    return(
        <div>
            {empDepartment && <EmpDepartmentForm show={show} 
                        handleClose={handleClose} singleEmpDepartment={empdepartment} 
                        title={getFormattedMessage('empDepartment.edit.title')} /> }
       </div>
    )
}

const mapStateToProps = (state) => {
    const {empDepartment} = state;
    return { empDepartment }
}

export default connect(mapStateToProps,{fetchSpecificEmpDepartments,editEmpDepartment}) (EditEmpDepartment)