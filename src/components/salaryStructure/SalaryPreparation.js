import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Modal } from "react-bootstrap-v5"
import { getFormattedMessage, placeholderText } from "../../shared/sharedMethod";
import ReactSelect from "../../shared/select/reactSelect";
import { useNavigate } from "react-router";


const SalaryPreparation = (props) => {

    const {show,handleClose,title}=props;

    const closeButtonClick =() => {
        handleClose(show)
    }

    const closeClick = () => {
        handleClose(show)
    }

    const navigate =useNavigate();

    const submitClick =() => {
        navigate("/app/salaryPreparationListPage");
     
    }

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

                    />
               </div>
               <div className="col-md-2 mb-3">
               <h3 className="mt-3">
                 {getFormattedMessage("month.title")}
               </h3>
               </div>
               <div className="col-md-4">
                    <ReactSelect/>
               </div>
             </div>

             <br/>                
                
                <div className="row">
                    {/* <div className="col-md-1"></div> */}
                    <div className="col-md-6">
                        <h4 className="mt-3">Choose Department</h4>
                    </div>
                    <div className="col-md-6">
                        <ReactSelect/>
                    </div>
                </div>

                <br/>                
                
                <div className="row">
                    {/* <div className="col-md-1"></div> */}
                    <div className="col-md-6">
                        <h4 className="mt-3">Choose Designation</h4>
                    </div>
                    <div className="col-md-6">
                        <ReactSelect/>
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

export default SalaryPreparation