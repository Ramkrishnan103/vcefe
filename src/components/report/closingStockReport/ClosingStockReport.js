import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TopProgressBar from "../../../shared/components/loaders/TopProgressBar"
import MasterLayout from "../../MasterLayout"
import {  faFilter,faFileExcel, faFilePdf, faPrint } from "@fortawesome/free-solid-svg-icons";
import ClosingStockReportForm from "./ClosingStockReportForm";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import UnitsForm from "../../units/UnitsForm";
import Units from "../../units/Units";
import { connect } from "react-redux";
import { fetchClosingStockReport } from "../../../store/action/ClsoingStockReportAction";
import {fetchCompanyConfig} from "../../../store/action/companyConfigAction";
import { getFormattedMessage } from "../../../shared/sharedMethod";
import ClosingStockField from "./ClosingStockField";
import {jsPDF} from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';



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
// const formattedDate = formatDate(date);



const ClosingStockReport = (props) => {
  
    const {closingStocks,fetchClosingStockReport,ItemValues,companyConfig} =props;
    console.log("closingStocks =>", closingStocks)
    console.log("closingStocks =>", ItemValues)
    const today = new Date();
    const formattedDate = formatDate(today);
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
  fetchCompanyConfig()
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

const companyDetails = {
  companyName: companyConfig?.companyName,
  address: `${companyConfig?.attributes?.address1} , ${companyConfig?.attributes?.address2}`,
  phoneNumber: companyConfig?.attributes?.phoneNo
};

const reportDetails = {
  title: " Closing Stock Report as on",
  dateRange:formattedDate
};
const [showField,setShowField]=useState()
console.log("showField",showField )
const generateClosingStockReportPDF = (companyDetails, reportDetails, itemsValue) => {
  const { companyName, address, phoneNumber } = companyDetails;
  const { title, dateRange } = reportDetails;

  const doc = new jsPDF();
  let pageNumber = 1;

  const addHeader = () => {
      doc.setFontSize(18);
      doc.text(companyName, 105, 20, null, null, 'center');
      doc.setFontSize(12);
      doc.text(address, 105, 28, null, null, "center");
      doc.setFontSize(10);
      doc.text(phoneNumber, 105, 35, null, null, "center");
      doc.setLineWidth(0.2);
      doc.line(10, 42, 200, 40); 
  };

  const addFooter = () => {
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(10);
      doc.text(`Page ${pageNumber} of ${pageCount}`, 105, 290, null, null, 'center');  
  };

  addHeader();

  doc.setFontSize(14);
  doc.text(`${title} ${dateRange}`, 10, 50); 

  doc.autoTable({
      startY: 60,
     
      head: [['Code', 'Product Name','Stock','Cost','Value']],
      body: itemsValue.map(item => [item. Code, item.productName,item.stock,item.cost,item.value]),
      foot: [['Total','','', itemsValue.reduce((acc, curr) => acc + parseFloat(curr.value), 0).toFixed(2)]],
      headStyles: {
          0: { halign: 'left' },
          1: { halign: 'left' },
          2:{halign:'left'},
          3:{halign:'left'},
          4:{halign:'right'}
      },
      footStyles: {
          0: { halign: 'left' },
          1: { halign: 'right' }
      },
      columnStyles: {
          0: { halign: 'left' },
          1: { halign: 'left' },
          2:{halign:'left'},
          3:{halign:'left'},
          4:{halign:'left'},
          5: { halign: 'right' }
      },
      margin: { top: 50 }, 
      pageBreak: 'avoid',  
      didDrawPage: function (data) {
          addFooter();
          pageNumber++;
      }
      

  });
      
  const now = new Date();
  const optionsDate = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Kolkata' };
  const optionsTime = { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit', 
      hour12: true, 
      timeZone: 'Asia/Kolkata' 
  };
  
  const dateString = now.toLocaleDateString('en-GB', optionsDate).replace(/\//g, '-');
  const timeString = now.toLocaleTimeString('en-GB', optionsTime).replace(/:/g, '-');
  const filename = `Closing Stock Report_${dateString}_${timeString}.pdf`;

  doc.save(filename);

  doc.save('ClosingStockReport.pdf');
};
const XLSX = require('xlsx');
  const fs = require('fs');

  const generateClosingStockReportExcel = (companyDetails, reportDetails, itemsValue) => {
    const { companyName, address, phoneNumber } = companyDetails;
  const { title, dateRange } = reportDetails;
      
      const workbook = XLSX.utils.book_new();
      
      // Create worksheet content
      const worksheet = XLSX.utils.aoa_to_sheet([
          [companyName],
          [address],
          [phoneNumber],
          [],
          [`${title} ${dateRange}`],
          [],
          ['Code', 'Product Name', 'Stock', 'Unit Name', 'Cost', 'Value'] // Header Row
      ]);
    
      // Add rows to worksheet
      itemsValue.forEach(item => {
          XLSX.utils.sheet_add_aoa(worksheet, [[
              item.Code, 
              item.productName, 
              item.stock, 
              item.unitName, 
              item.cost, 
              item.value
          ]], { origin: -1 });
      });
    
      // Calculate and add total value
      const totalValue = itemsValue.reduce((acc, curr) => acc + parseFloat(curr.value), 0).toFixed(2);
      XLSX.utils.sheet_add_aoa(worksheet, [['', '', '', '', 'Total', totalValue]], { origin: -1 });
  
      // Define column widths
      worksheet['!cols'] = [
          { wch: 15 }, // Code
          { wch: 30 }, // Product Name
          { wch: 15 }, // Stock
          { wch: 20 }, // Unit Name
          { wch: 15 }, // Cost
          { wch: 20 }  // Value
      ];
    
      // Center align company details and title
      ['A1', 'A2', 'A3', 'A5'].forEach(cell => {
          if (worksheet[cell]) {
              worksheet[cell].s = { alignment: { horizontal: "center" } };
          }
      });
      const headerCells=['C7','E7','F7'];
      headerCells.forEach(cell=>{
        if(worksheet[cell]){
          worksheet[cell].s={alignment:{horizontal:"right"}}
        }
      })

      const totalValueCell = 'F' + (worksheet['!ref'].split(':')[1].replace(/\D/g, ''));
      if (worksheet[totalValueCell]) {
          worksheet[totalValueCell].s = { alignment: { horizontal: "right" } };
      }
      // Append worksheet to workbook and save
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Closing Stock Report');
      XLSX.writeFile(workbook, 'Closing_Stock_Report.xlsx');
  };
  
const printTable = () => {
  // Create a new window or tab
  const printWindow = window.open('', '', 'height=600,width=800');
  printWindow.document.write('<div className="company-info">');
   printWindow.document.write(`<h2 >${companyDetails.companyName}</h2>`);
   printWindow.document.write(`<p>${companyDetails.address}</p>`);
   printWindow.document.write(`<p>${companyDetails.phoneNumber}</p>`);
   printWindow.document.write('</div>');
   printWindow.document.write('<hr>');
  
   // Add report details
   printWindow.document.write('<div className="report-info">');
   printWindow.document.write(`<h3>${reportDetails.title}</h3>`);
   printWindow.document.write(`<p>${reportDetails.dateRange}</p>`);
   printWindow.document.write('</div>');


  // Get the content you want to print
  const tableContent = document.querySelector('.table-container').outerHTML;

  // Write the content to the new window
  printWindow.document.write('<html><head><title>Print</title>');
  printWindow.document.write('<style>');
  printWindow.document.write('table { width: 100%; border-collapse: collapse; }');
  printWindow.document.write('th, td { border: 1px solid black; padding: 8px; text-align: left; }');
  printWindow.document.write('th { background-color: #f2f2f2; }');
  printWindow.document.write('.purchase-value { text-align: right; }');
  printWindow.document.write('.total-value { text-align: right; font-weight: bold; }'); 
  printWindow.document.write('@media print { .no-print { display: none; } }');
  printWindow.document.write('</style>');
  printWindow.document.write('</head><body >');
  printWindow.document.write('<h1>Closing Stock Report</h1>'); // Add headers or other content here
  printWindow.document.write(tableContent);
  printWindow.document.write('</body></html>');

  // Close the document to trigger the print dialog
  printWindow.document.close();
  printWindow.focus(); // Ensure the new window is in focus

  // Trigger the print dialog
  printWindow.onload = () => {
    printWindow.print();
};
};
const exportToExcel=()=>{
  generateClosingStockReportExcel (companyDetails, reportDetails, itemsValue)
}

  const exportToPDF = () => {
   generateClosingStockReportPDF(companyDetails, reportDetails, itemsValue)
  };

    return(
   
        <div style={{backgroundColor:"white",height:"100%"}}>
            
    {fieldShow&&<ClosingStockField setShowField={setShowField} fieldShow={fieldShow}  handleFieldClose={handleFieldClose}/>}
           <div className="row">
           <div className="col-md-5">
                <h2 style={{color:"green"}}>Closing  Stock Report as on  { formattedDate}</h2>
                </div>
                <div className="col-md-5"></div>
                <div className="col-md-2 ">
                <button
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              borderRadius: "10px",
              width: "220px",
              height: "60px",
              gap: "13px",
              background: "white",
              
            }}
          >
            <FontAwesomeIcon
              icon={faPrint}
              className="fa-2x search-icon"
              style={{ color: "black",paddingTop:"8px" }}
             onClick={printTable}
            ></FontAwesomeIcon>

            <FontAwesomeIcon
              icon={faFileExcel}
              className="fa-2x search-icon "
              style={{ color: "green", paddingLeft: "10px",paddingTop:"7px" }}
              onClick={exportToExcel}
            ></FontAwesomeIcon>

            <FontAwesomeIcon
              icon={faFilePdf}
              className="fa-2x search-icon"
              style={{ color: "red", paddingLeft: "10px",paddingTop:"7px" }}
              onClick={exportToPDF}
            ></FontAwesomeIcon>

          </button>
           </div> 
           </div>
          
          
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
      <th colSpan='5' style={{textAlign:"right"}} >{totalSalesValue(itemsValue)}</th>
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
    const {closingStocks,companyConfig} =state;
    return{closingStocks,companyConfig};
}

export default connect(mapStateToProps,{fetchClosingStockReport,fetchCompanyConfig}) (ClosingStockReport)