import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Modal } from "react-bootstrap-v5"
import { getFormattedMessage, placeholderText } from "../../shared/sharedMethod";
import ReactSelect from "../../shared/select/reactSelect";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { fetchEmpDepartment } from "../../store/action/empDepartmentAction";
import { fetchEmpDesignation } from "../../store/action/empDesignationAction";
import { connect } from "react-redux";


const SalaryPreparation = (props) => {

    const {show,handleClose,title}=props;
    
    const now = new Date();
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const [preparationValue, setPreparationValue] = useState({
        year: now.getFullYear(),
        month: monthNames[now.getMonth()],
        groupBy: '',
    });

    const yearOptions = Array.from({ length: 5 }, (_, i) => ({
        value: now.getFullYear() - 1 + i,
        label: now.getFullYear() - 1 + i
    }));
    
    console.log("Year =>" , yearOptions)

    const monthOptions = monthNames.map((month, index) => ({
        value: index + 1,
        label: month
    }));

    const handleYearChange = (selectedOption) => {
        setPreparationValue(prev => ({
            ...prev,
            year: selectedOption.value
        }));
    };

    const handleMonthChange = (selectedOption) => {
        setPreparationValue(prev => ({
            ...prev,
            month: monthNames[selectedOption.value - 1]
        }));
    };

    const closeButtonClick = () => {
        handleClose(show);
    };

    const closeClick = () => {
        handleClose(show);
    };

    const navigate = useNavigate();

    const submitClick = () => {
        navigate("/app/salaryPreparationListPage");
    };

    const options = [
        { value: 'department', label: 'Department' },
        { value: 'designation', label: 'Designation' },
        { value: 'departmentdesignation', label: 'Department & Designation'},
      ];
    
      const handleGroupByChange = (selectedOption) => {
        setPreparationValue(prev => ({
            ...prev,
            groupBy: selectedOption ? selectedOption.label : ''
        }));
    };

    return (
        
        <Modal show={show} onHide={closeButtonClick} centered >
        <Form  >
            <Modal.Header className="d-flex justify-content-between align-items-center">
                <Modal.Title className="text-start">{title}</Modal.Title>
                <button
                    style={{
                        backgroundColor: "white",
                        border: "none",
                        padding: 0,
                        margin: 0,
                    }}
                    onClick={closeButtonClick}
                >
                    <FontAwesomeIcon
                        icon={faXmark}
                        className="fa-2x"
                        style={{ height: "20px", width: "27px", color: "gray" }}
                    />
                </button>
            </Modal.Header>

         <Modal.Body>
           <div className="row">
              <div className="col-md-2 mb-3">
               <h3 className="mt-3">
                 {getFormattedMessage("Year.title")}
               </h3>
               </div>
               <div className="col-md-4 ">
                    <ReactSelect 
                       data={yearOptions}
                       value={yearOptions.find(option => option.value === preparationValue.year)}
                       onChange={handleYearChange}
                    />
               </div>
               <div className="col-md-2 mb-3">
               <h3 className="mt-3">
                 {getFormattedMessage("month.title")}
               </h3>
               </div>
               <div className="col-md-4">
                    <ReactSelect
                          data={monthOptions}
                          value={monthOptions.find(option => option.label === preparationValue.month)}
                          onChange={handleMonthChange}
                    />
               </div>
             </div>

             <br/>                
                
                <div className="row">
                    {/* <div className="col-md-1"></div> */}
                    <div className="col-md-1"></div>
                    <div className="col-md-3">
                        <h4 className="mt-3">Group By</h4>
                    </div>
                     {/* <select  onChange={handleGroupByChange} >
                        <option>Department</option>
                        <option>Designation</option>
                        <option>Department & Designation</option>
                    </select> */}
                    <div className="col-md-8">
                        <ReactSelect 
                                className="position-relative"
                                value={options.find(option => option.label === preparationValue.groupBy)}
                                data={options}
                                onChange={handleGroupByChange}
                        />
                    </div>
                        

                </div>

                <br/>                
                
               
                <br/>

 <div style={{textAlign:"center",marginBottom:"20px",display:"flex",gap:"20px",justifyContent:"center"
          }}>
       <button style={{
          width:"100px",
          height:"30px",
          border:"none",
          borderRadius:"10px",
          backgroundColor:"red",
          color:"white"
       }} onClick={submitClick} >
              Submit
       </button>
       <button style={{
           width:"100px",
           height:"30px",          
           border:"none",
           borderRadius:"10px",
           backgroundColor:"green",
           color:"white"
       }} onClick={closeClick} >
              Close
       </button>
</div>


          

                    
         </Modal.Body>
       </Form>
      
     </Modal>
    )
}

// const mapStateToProps =(state) => {
//     const {empDepartment,empDesignation} =state;
//     return {empDesignation,empDepartment}
// }

export default  SalaryPreparation