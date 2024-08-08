import { connect } from "react-redux"
import TopProgressBar from "../../shared/components/loaders/TopProgressBar"
import MasterLayout from "../MasterLayout"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import ReactDataTable from "../../shared/table/ReactDataTable";
import { getFormattedMessage, placeholderText } from "../../shared/sharedMethod";
import { Link, useNavigate } from "react-router-dom";
import ReactSelect from "../../shared/select/reactSelect";
import { Button, Form } from "react-bootstrap";

const  SalaryPreparationListPage = (props) => {

    const {isLoading} =props;

  const to='/app/salaryPreparation';

const itemsValue = [];

const navigate = useNavigate();

const loadClick = () => {
    navigate("/app/salaryPreparation")
}



    return(
        <div>
            <MasterLayout>
                <TopProgressBar/>


<div className="d-md-flex align-items-center justify-content-between mb-5">
      {<h1 className="mb-0 create-title">Salary Preparation</h1> }
      <div className="text-end mt-4 mt-md-0">
        <Link to={to} className="btn btn-primary me-3 save-btn"
        style={{width:"110px"}} >
         {getFormattedMessage("globally.save-btn")}
       </Link>
        {to ? (
          <Link to={to} className="btn btn-outline-primary back-btn">
            {getFormattedMessage("globally.back-btn")}
          </Link>
        ) : null}
      </div>
</div>

<div className="card">
<div className="card-body">
<Form>

<div className="row">
    <div className="col-md-10">
        <h3 >Salary For The Month Of </h3>
    </div>
</div>
<br/>
<div className="row">
    <div className="col-md-3">
              <h4 className="mt-1">
                {getFormattedMessage("empDepartment.title")}
              </h4>
              <ReactSelect/>
    </div>
    <div className="col-md-3">
              <h4 className=" mt-1">
                {getFormattedMessage("empDesignation.title")}
              </h4>
              <ReactSelect/>
    </div>
    <div className="col-md-3">
              <h4 className="mt-1">
                {getFormattedMessage("employee.title")}
              </h4>
              <ReactSelect/>
    </div>
<div className="col-md-1"></div>
    <div className="col-md-2">
    <Button className="btn-success mt-8"
        style={{width:"110px",}} onClick={loadClick} >
            Load
       </Button >
    </div>
    
</div>

<br/>
<br/>

            {/* <div  >
                <ReactDataTable 
                    // columns={columns}
                    items={itemsValue ? itemsValue : []}
                    isLoading={isLoading}
                     totalRows={itemsValue?.length}
                    isUnitFilter
                    subHeader={false}
                />
            </div> */}


<div className="fixTableHead"  >
<table className='table-container' style={{height:"500px"}} >
  <thead>
    <tr style={{backgroundColor: "#f1f1f1",color:"black"}}>
      <th style={{fontWeight: "bold", fontSize: "16px"}}>Emp.Id</th>
      <th style={{fontWeight: "bold", fontSize: "16px"}}>Name</th>
      <th style={{fontWeight: "bold", fontSize: "16px"}}>No.Of.Days</th>
      <th style={{fontWeight: "bold", fontSize: "16px"}}>Leave</th>
      <th style={{fontWeight: "bold", fontSize: "16px"}}>Work Days</th>
      <th style={{fontWeight: "bold", fontSize: "16px"}}>Earnings</th>
      <th style={{fontWeight: "bold", fontSize: "16px"}}>Deduction</th>
      <th style={{fontWeight: "bold", fontSize: "16px"}}>Net Pay</th>
    </tr>
  </thead>

  <tbody>
                    {/* {(isFiltered ? filteredItems : itemsValue).map((month, index) => (
                        <tr key={index}>
                            <td >{month.monthYear}</td>
                            <td className="salesvalue">{
                                new Intl.NumberFormat('en-IN', {
                                    style: 'decimal',
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }).format(parseFloat(month.salesValue), 0)
                            }</td>
                        </tr>
                    ))} */}
                    <tr>
                        <td style={{ fontWeight: "bold", fontSize: "16px", textAlign: "left", verticalAlign: "middle" }}>Total</td>
                        <td style={{ fontWeight: "bold", fontSize: "16px", textAlign: "left", verticalAlign: "middle" }}>Total</td>
                        <td style={{ fontWeight: "bold", fontSize: "16px", textAlign: "left", verticalAlign: "middle" }}>Total</td>
                        <td style={{ fontWeight: "bold", fontSize: "16px", textAlign: "left", verticalAlign: "middle" }}>Total</td>
                        <td style={{ fontWeight: "bold", fontSize: "16px", textAlign: "left", verticalAlign: "middle" }}>
                            <input type="text" value="Total"  style={{ fontSize: "16px", width: "100px" }} />
                        </td>
                        <td style={{ fontWeight: "bold", fontSize: "16px", textAlign: "left", verticalAlign: "middle" }}>Total</td>
                        <td style={{ fontWeight: "bold", fontSize: "16px", textAlign: "left", verticalAlign: "middle" }}>Total</td>
                        <td style={{ fontWeight: "bold", fontSize: "16px", textAlign: "left", verticalAlign: "middle" }}>Total</td>
                    </tr>
                </tbody>

  <tfoot>
    <tr>
      <th colSpan="8" style={{fontWeight: "bold", fontSize: "16px", textAlign: "right", backgroundColor:"lightblue",
          // backgroundColor: "#333",
          // color: "white",
          // textAlign: "center",
          // padding: "10px",
          // position: "fixed",
          // bottom: "0",
          // width: "100%",
          // marginTop:"50px"
      }}>Total</th>
    </tr>
  </tfoot>
</table>
</div>



</Form>
</div>
</div>
            </MasterLayout>
        </div>
    )
}

const mapStateToProps = (state) => {
    const {isLoading} =state;
    return {isLoading}
}

export default connect (mapStateToProps,{}) (SalaryPreparationListPage)