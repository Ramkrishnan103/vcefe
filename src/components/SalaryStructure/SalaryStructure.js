import { getFormattedMessage } from "../../shared/sharedMethod"
import ReactSelect from "../../shared/select/reactSelect";



const SalaryStructure=()=>{
return(
 <>
   <div>
      <div className="d-md-flex align-items-center justify-content-between mb-5">
      <h1 className="mb-0 create-title"> {getFormattedMessage("salaryStructure.title")}</h1>
      <div className="d-grid gap-2 d-md-block ">
      <button type='button' variant='primary' className="btn btn-primary me-3  save-btn ps-2 " >Save</button>
      <button type='button' variant='primary' className="btn btn-primary me-3 back-btn" >Back</button>
        
      </div>
</div>


   <div className="card">
   <div className="card-body">
  <div className="w-100 h-5">

  <div className="row">
    <div className="col-md-6 d-flex justify-content-between"  >
<div className="col-md-10 d-flex">
            <label className="form-label me-3 mt-2">
              {getFormattedMessage(  "department.title")}
            </label>
            {/* </div>
            <div className="col-md-2 mb-3"> */}
           <ReactSelect />
          </div>
          </div>
          <div className="col-md-6"  >
          <div className="col-md-10 d-flex ">
            <label className="form-label me-3 mt-2">
              {getFormattedMessage(  "globally.input.designation.label")}
            </label>
           
          <ReactSelect/>
          </div>
          </div>
</div>
  </div>
  
 
</div>
</div>
</div>


<div className="card mt-3  ">
<div className="card-body">
<div className=" w-100 h-80">
 <div className="row">
 <h4 className="mb-3">Earnings</h4>
 </div>
 <div className="row row-cols-2 row-cols-lg-5 g-2 g-lg-3">
 <div className="col">
  <label >{getFormattedMessage(  "basicPay.title")}</label><span className="required" />
  <input type="number"  className="form-control" />
  </div>
 
 <div className="col">
  <label >{getFormattedMessage(  "hr.title")}</label><span className="required" />
  <input type="number"  className="form-control" />
 </div>

 <div className="col">
  <label >{getFormattedMessage(  "conveyance.title")}</label><span className="required" />
  <input type="number"  className="form-control"/>
  </div>
 
 <div className="col">
  <label >{getFormattedMessage(  "otherAllowance.title")}</label><span className="required" />
  <input type="number"  className="form-control" />
  </div>
 
 <div className="col">
 <label ></label>
  <input type="number"  className="form-control bg-light text-dark"  />
  </div>
 </div>
</div>


<div className=" w-100 h-80 mt-3">
 <div className="row">
 <h4 className="mb-3">Deductions</h4>
 </div>
 <div className="row row-cols-2 row-cols-lg-5 g-2 g-lg-3">
 <div className="col">
  <label >{getFormattedMessage(  "esi.title")}</label>
  <input type="number"  className="form-control" />
  </div>
 
 <div className="col">
  <label >{getFormattedMessage(  "pf.title")}</label>
  <input type="number"  className="form-control" />
 </div>

 <div className="col">
  <label >{getFormattedMessage(  "lwf.title")}</label>
  <input type="number"  className="form-control"/>
  </div>
 
 <div className="col">
  <label >{getFormattedMessage(  "taxDeductions.title")}</label>
  <input type="number"  className="form-control" />
  </div>
 
 <div className="col">
 
  </div>
 </div>
</div>


</div>
</div>
</>
)
}
export default SalaryStructure