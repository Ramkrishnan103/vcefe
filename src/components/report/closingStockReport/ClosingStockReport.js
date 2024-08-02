import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TopProgressBar from "../../../shared/components/loaders/TopProgressBar"
import MasterLayout from "../../MasterLayout"
import { faFilter, faPrint } from "@fortawesome/free-solid-svg-icons";
import ClosingStockReportForm from "./ClosingStockReportForm";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import UnitsForm from "../../units/UnitsForm";
import Units from "../../units/Units";
import { connect } from "react-redux";
import { fetchClosingStockReport } from "../../../store/action/ClsoingStockReportAction";
import { getFormattedMessage } from "../../../shared/sharedMethod";
import ClosingStockField from "./ClosingStockField";
import { FALSE } from "sass";

const today = new Date();
const numOfDaysAdded = 0;
const date = new Date(today.setDate(today.getDate() + numOfDaysAdded));
const defaultValue = date.toISOString().split('T')[0]; 

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};
const formattedDate = formatDate(date);



const ClosingStockReport = (props) => {
  
    const {closingStocks,fetchClosingStockReport,ItemValues} =props;
    console.log("closingStocks =>", closingStocks)
    console.log("closingStocks =>", ItemValues)

    const[search,setSearch] =useState('')
    const[fetchRangeValue,setFetchRangeValue] =useState({
      category1Name:"",
      category2Name:"",
      category3Name:"",
      unitName:""
    });
    const [label,setLabel]=useState(false)
    const [fieldShow,setFieldShow]=useState(false) 
    const handleFieldClose = () => setFieldShow(!fieldShow);

    const searchRef=useRef();
   
    
const onChange =() => {
   setSearch(searchRef.current.value)
}

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(!show);

useEffect(()=> {
    fetchClosingStockReport();
},[])

    const onClick = () => {
  setLabel(true)
  //  navigate(`/app/report/closingStock`)
//    setShowStatements(true)
   setShow(true)
  //  console.log("Range =>" ,range)
   setFetchRangeValue(range)
   console.log("fetchRangeValue =>" ,fetchRangeValue)
    };


    const itemsValue =
    closingStocks?.length >= 0 &&
    closingStocks.map((closingStock) => {
      console.log("hi",closingStock)
      return {
        Code: closingStock.attributes.itemCode,
        productName: closingStock.attributes.itemName,
        MRP:closingStock.attributes.mrp,
        stock: closingStock.attributes.stock,
        unitName: closingStock.attributes.unitName,
        cost: closingStock.attributes.purchaseCost,
        value: closingStock.attributes.salesPrice,
        category1Name: closingStock.attributes.category1Name,
        
      };
    });

  const footers = [
    {
      name: getFormattedMessage("totalStock.title"),
        
       selector: (row) => row.totalValue,
       sortField: "totalValue",
       sortable: true, 
    }
  ];

  const totalSalesValue = (data) => {
    console.log("data",data)
    return new Intl.NumberFormat('en-IN', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(data.reduce((acc, curr) => acc + parseFloat(curr.value), 0));
  };

const [range,setRange ]=useState({
    category1Name:"",
    category2Name:"",
    category3Name:"",
    unitName:"",
})
const handleClick=(e)=>{
   setFieldShow(true)
 
}
const [showField,setShowField]=useState()
console.log("showField",showField )

    return(
   
        <div style={{backgroundColor:"white",height:"100%"}}>
            
    {fieldShow&&<ClosingStockField setShowField={setShowField} fieldShow={fieldShow}  handleFieldClose={handleFieldClose}/>}
    
           <div>
                <h2 style={{color:"green"}}>Closing  Stock Report as on  { formattedDate}</h2>
           </div>  
           {/* <br></br> */}
           <div className="row"> 
                <div className='col-md-1 mt-2'>
                    <h4 >Search</h4>
                </div>

                <div className='col-md-4'>
                     <input type='text' ref={searchRef} onChange={onChange}  placeholder='Item Name Or Item Code' className=' form-control rounded text-align-center  align-items-center mr-15 mb-5'></input>
                </div>

<div className="col-md-1"></div>

<div className="col-md-3" style={{ display: 'flex', alignItems: 'center', marginTop: "-20px" ,}}>
    <button style={{
        border: "1px solid gray",
        borderRadius: "10px 0 0 10px", 
        backgroundColor: "blue",
        height: "40px", 
        display: 'flex',
        alignItems: 'center',
        padding: '0 10px',
        color: "white" 
    }} onClick={onClick}>
        <FontAwesomeIcon
           icon={faFilter}
            className="fa-2x search-icon"
            style={{ fontSize: '20px' }}
        />
    </button> 
    <button style={{
        border: "1px solid gray",
        borderRadius: "0 10px 10px 0", 
        backgroundColor: "white",
        height: "40px", 
        display: 'flex',
        alignItems: 'center',
        padding: '0 10px',
        marginLeft: "-1px",
        marginRight:"35px",
        color: "blue" 
    }} onClick={onClick}>
        <span style={{ fontSize: '16px',fontWeight:"bold" }}>Range</span>
    </button>

    <button style={{
        border: "1px solid gray",
        borderRadius: "10px 0 0 10px", 
        backgroundColor: "blue",
        height: "40px", 
        display: 'flex',
        alignItems: 'center',
        padding: '0 10px',
        color: "white" 
    }} onClick={handleClick}>
        <FontAwesomeIcon
           icon={faFilter}
            className="fa-2x search-icon"
            style={{ fontSize: '20px' }}
        />
    </button> 
    <button style={{
     
        border: "1px solid gray",
        borderRadius: "0 10px 10px 0", 
        backgroundColor: "white",
        height: "40px", 
        display: 'flex',
        alignItems: 'center',
        padding: '0 10px',
        marginLeft: "-1px",
        marginRight:"35px",
        color: "blue" 
    }} onClick={handleClick}>
        <span style={{ fontSize: '16px',fontWeight:"bold" }}>Field</span>
    </button>


  
</div>
 </div>
{
  label&&(
    <div className="row">
    <div className="col-md-3">
        <h4> search : {search}</h4>
    </div>

    <div className="col-md-3">
        <h4> Category1 : {range.category1Name}</h4>
    </div>

    <div className="col-md-3">
        <h4> Category2 : {range.category2Name}</h4>
    </div>

    <div className="col-md-3">
        <h4> Category3 : {range.category3Name}</h4>
    </div>

    
</div>

  )
}

<div className="row">

<div className="col-md-12">
       {itemsValue.length>0 && 

<div className="fixTableHead">
<table className='table-container'>
  <thead>
    <tr >
      <th style={{fontWeight:"bold",fontSize:"16px"}}>Code</th>
      <th style={{fontWeight:"bold",textAlign:"center",fontSize:"16px"}}> Product Name</th>
      <th style={{fontWeight:"bold",textAlign:"center",fontSize:"16px"}}> MRP</th>
      <th style={{fontWeight:"bold",fontSize:"16px",textAlign:"center"}} colSpan='2'>Stock</th>
      {/* <th style={{fontWeight:"bold",textAlign:"right",fontSize:"16px"}}> Sales Value</th> */}

      <th style={{fontWeight:"bold",fontSize:"16px",textAlign:"center"}}>Cost</th>
      <th style={{fontWeight:"bold",textAlign:"right",fontSize:"16px"}}> Value</th>
    </tr>
  </thead>

  <tbody>
    {itemsValue.map((closingStock, index) => (
      <tr key={index}>
        <td >{closingStock.Code}</td>
        <td >{closingStock.productName}</td>
        <td >{closingStock.MRP}</td>
        <td  style={{textAlign:"right"}}>{closingStock.stock}</td>
        <td >{closingStock.unitName}</td>
        <td  style={{textAlign:"right"}}>{
       new Intl.NumberFormat('en-IN', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(parseFloat(closingStock.cost), 0)
        }</td>
        <td className="salesvalue" style={{textAlign:"right"}}>{
            new Intl.NumberFormat('en-IN', {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(parseFloat(closingStock.value), 0)
            }
        </td>
      </tr>
    ))}
  </tbody>

  
  <tfoot>
    <tr >
      {footers.map((footer) => (
        <th colSpan='2' >{footer.name}</th>
      ))}
      <th colSpan='5' >{totalSalesValue(itemsValue)}</th>
    </tr>
  </tfoot>
  </table>
</div>
}
</div>
</div> 

        { show? <ClosingStockReportForm closingStocks={closingStocks} show ={show} handleClose={handleClose} 
        // setItemValues={setItemValues}
        singleStock={itemsValue}  
        setRange ={setRange}
        search={search} /> : null }
        {/* </MasterLayout> */}
        </div>
    )
}

const mapStateToProps =(state) => {
    const {closingStocks} =state;
    return{closingStocks};
}

export default connect(mapStateToProps,{fetchClosingStockReport}) (ClosingStockReport)