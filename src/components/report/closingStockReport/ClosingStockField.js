import { Form, Modal } from "react-bootstrap-v5";
import { getFormattedMessage, placeholderText } from "../../../shared/sharedMethod";
import ReactSelect from "../../../shared/select/reactSelect";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";



const ClosingStockField=({fieldShow,setShowField,handleFieldClose})=>{
 

  const [fieldValue,setFieldValue]=useState({
    showCode:"",
    showItemCost:"",
    showStockValue:""
  })

  const [codeShow,setCodeShow]=useState(false)
 const [costShow,setCostShow]=useState(false)
 const [stockShow,setStockShow]=useState(false)
  const showFieldCode=[
     {value:"",label:""},
    {value:"Yes",label:"Yes"},
    {value:"No",label:"No"}
  ]
  const showItemCost=[ 
    {value:"",label:""},
    {value:"Yes",label:"Yes"},
    {value:"No",label:"No"}
  ]
  const showStockValue=[
    {value:"",label:""},
    {value:"Yes",label:"Yes"},
    {value:"No",label:"No"}
  ]
  const handleFieldChange=(field)=>(selectedOption)=>{
     setFieldValue((prev)=>({...prev,[field]:selectedOption.label}))
  }


  const closeButtonClick = () => {
    handleFieldClose();
  };

  const showClick = () => {
    setShowField({
      showCode: fieldValue.showCode === "Yes",
      showItemCost: fieldValue.showItemCost === "Yes",
      showStockValue: fieldValue.showStockValue === "Yes"
    });
  };
  const handleFieldCancel=()=>{
    handleFieldClose();
  }

console.log("codeShow",codeShow)

  return(
    <Modal  show={fieldShow} >
      <Form>
      <Modal.Header  >
            <Modal.Title>Closing Stock Field Form </Modal.Title>
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
              <ReactSelect
                          className="position-relative"
                          title={getFormattedMessage(
                            "globally.input.showcode.name"
                          )}
                          placeholder={placeholderText(
                            "globally.input.placeholder.showcode.name"
                          )}
                           data={showFieldCode}
                         
                           value={showFieldCode.find((option) => option.value === fieldValue.showCode)}
                          //  option={closingStocks}
                           onChange={handleFieldChange('showCode')}
                />
             
            </div>
           
                  <div className="col-md-12 mb-3">
             
                <ReactSelect
                          className="position-relative"
                          title={getFormattedMessage(
                            "globally.input.showItemCost.name"
                          )}
                          placeholder={placeholderText(
                            "globally.input.placeholder.showItemCost.name"
                          )}
                           data={showItemCost}
                           value={showItemCost.find((option) => option.value === fieldValue.showItemCost)}
                           onChange={handleFieldChange('showItemCost')}
                         
                />
              
            </div>
           
            <div className="col-md-12 mb-3">
                <ReactSelect
                          className="position-relative"
                          title={getFormattedMessage(
                            "globally.input.stockValue.name"
                          )}
                          placeholder={placeholderText(
                            "globally.input.placeholder.stockValue.name"
                          )}
                         data={showStockValue}
                           onChange={handleFieldChange('showStockValue')}
                           value={showStockValue.find((option) => option.value === fieldValue.showStockValue)}
                />
             
            </div>

           
          </div>

          </Modal.Body>
       
      </Form>
      <div style={{textAlign:"center",marginBottom:"20px",display:"flex",gap:"20px",justifyContent:"center"
          }}>
       <button style={{
          width:"100px",
          height:"30px",
          border:"none",
          borderRadius:"10px",
          backgroundColor:"red",
          color:"white"
       }} onClick={handleFieldCancel}>
             Cancel
       </button>
       <button style={{
           width:"100px",
           height:"30px",          
           border:"none",
           borderRadius:"10px",
           backgroundColor:"green",
           color:"white"
       }} onClick={showClick} >
              Submit
       </button>
</div>
    </Modal>
  )
}
export default ClosingStockField