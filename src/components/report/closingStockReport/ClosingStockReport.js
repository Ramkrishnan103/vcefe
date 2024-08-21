import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Modal } from "react-bootstrap-v5";
import TopProgressBar from "../../../shared/components/loaders/TopProgressBar"
import MasterLayout from "../../MasterLayout"
import {  faFilter,faFileExcel, faFilePdf, faPrint,faXmark } from "@fortawesome/free-solid-svg-icons";
import ClosingStockReportForm from "./ClosingStockReportForm";
import { useEffect, useRef, useState,useCallback } from "react";
import { useNavigate } from "react-router";
import UnitsForm from "../../units/UnitsForm";
import Units from "../../units/Units";
import { connect } from "react-redux";
import { fetchClosingStockReport } from "../../../store/action/ClsoingStockReportAction";
import html2canvas from 'html2canvas';
import {fetchCompanyConfig} from "../../../store/action/companyConfigAction";
import { getFormattedMessage } from "../../../shared/sharedMethod";
import ClosingStockField from "./ClosingStockField";
import {jsPDF} from 'jspdf';
import ReactSelect from "../../../shared/select/reactSelect";
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
  
    const {closingStocks,fetchClosingStockReport,ItemValues,companyConfig,fetchCompanyConfig} =props;
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
    const pdfRef = useRef(null);
    const searchRef=useRef();
    const [fieldValue,setFieldValue]=useState({
      showPageSize:"",
      showPageOrientation:""
    })
    const [loadingPdf,setLoadingPdf]=useState(false)
    
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
const getCurrentDateTimeInIST = () => {
  const now = new Date();
  const offset = 5.5; // IST is UTC+5:30
  const istDate = new Date(now.getTime() + offset * 3600 * 1000);
  return istDate.toISOString().replace(/T/, ' ').replace(/\..+/, '');
};
const [showField,setShowField]=useState()
console.log("showField",showField )
const generatePDF = useCallback((companyDetails, reportDetails, orientation) => {
  const { companyName, address, phoneNumber } = companyDetails;
  const { title, dateRange } = reportDetails;

  if (!pdfRef.current) {
      console.error("pdfRef.current is null");
      return;
  }

  const input = pdfRef.current;
  html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const isLandscape = orientation === 'Landscape';
      const pdf = new jsPDF({
          orientation: isLandscape ? 'landscape' : 'portrait',
          unit: 'mm',
          format: isLandscape ? [297, 210] : [210, 297]
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const centerX = pdfWidth / 2;
      const topMargin = 20; // Space from the top to the company name
      const textSpacing = 3; // Spacing between lines of text
      const lineSpacing = 15; // Space between line and image

      // Add company details
      pdf.setFontSize(12);
      pdf.text(companyName, centerX, topMargin, { align: 'center' });
      pdf.setFontSize(10);
      pdf.text(address, centerX, topMargin + textSpacing + 5, { align: 'center' });
      pdf.text(`Phone: ${phoneNumber}`, centerX, topMargin + 2 * textSpacing + 10, { align: 'center' });

      // Add a horizontal line below the company details
      pdf.setLineWidth(0.2);
      pdf.line(10, topMargin + 3 * textSpacing + 15, pdfWidth - 10, topMargin + 3 * textSpacing + 15); // Adjusted line position

      // Add report details
      pdf.setFontSize(12);
      pdf.text(title, 10, topMargin + 4 * textSpacing + 25); // Adjusted position for title
      pdf.text(dateRange, 10, topMargin + 5 * textSpacing + 30); // Adjusted position for year range

      // Calculate image dimensions and position
      const imgWidth = pdfWidth - 20; // 10 mm margin on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const xOffset = 10; // Left margin
      const yOffset = topMargin + 6 * textSpacing + 35; // Adjusted position below the line

      // Add image content
      pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);

      // Add footer to each page
      const addFooter = () => {
          const pageCount = pdf.internal.getNumberOfPages();
          for (let i = 1; i <= pageCount; i++) {
              pdf.setPage(i);
              pdf.setFontSize(10);
              pdf.text(`Page ${i} of ${pageCount}`, pdfWidth / 2, pdfHeight - 10, { align: 'center' });
          }
      };

      addFooter();
      pdf.save(`Closing_Stock_Report_${getCurrentDateTimeInIST()}.pdf`);
  }).catch(error => {
      console.error('Error generating canvas:', error);
  });
}, []);

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
  printWindow.document.write('<style>');
  printWindow.document.write('.company-info {');
  printWindow.document.write('  text-align: center;');
  printWindow.document.write('  margin: 0 auto;');
  printWindow.document.write('  padding: 20px;');
  printWindow.document.write('  max-width: 600px;'); // Adjust the max-width as needed
  printWindow.document.write('}');
  printWindow.document.write('</style>');
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

  generatePDF(companyDetails, reportDetails,fieldValue.showPageOrientation )
};
const showPageOrientation = [
  { value: "Portrait", label: "Portrait" },
  { value: "Landscape", label: "Landscape" },
];

// Define the options for page size
const showPageSize = [
  { value: "A4", label: "A4" },
];

// Find the default value from the options
const defaultPageOrientation = showPageOrientation.find(option => option.value === 'Portrait');
const defaultPageSize = showPageSize.find(option => option.value === 'A4');

const closeButtonClick = () => {
  setLoadingPdf(false)
};
const handleFieldChange = (field) => (selectedOption) => {
  setFieldValue((prevValues) => ({
    ...prevValues,
    [field]: selectedOption ? selectedOption.value : ""
  }));
};


const handlePdfClick=()=>{
setLoadingPdf(true)

}
const handleFieldCancel=()=>{
  setLoadingPdf(false)
}

    return(
   <>
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
              onClick={handlePdfClick}
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

<div className="fixTableHead" ref={pdfRef}>
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
        <Modal  className="pdfTable" show={loadingPdf} onHide={() => setLoadingPdf(false)} centered>
  <Form>
    <Modal.Header>
      <Modal.Title>Print</Modal.Title>
      <button style={{ backgroundColor: "white", display: "flex", gap: "10px", border: "none" }}
              onClick={closeButtonClick}>
        <FontAwesomeIcon
          icon={faXmark}
          className="fa-2x search-icon"
          style={{ height: "20px", width: "27px", marginTop: "2px", color: "gray" }}
        />
      </button>
    </Modal.Header>
    <Modal.Body>
      <div className="row">
        <div className="col-md-12 mb-3">
        <p style={{fontSize:"13px"}}>Create a printer-friendly PDF of your report.</p>
        </div>
        <div className="col-md-12 mb-3">
          <ReactSelect
            className="position-relative"
            title={getFormattedMessage("globally.input.pageSize.name")}
            data={showPageSize}
            defaultValue={defaultPageSize}
            value={showPageSize.find(option => option.value === fieldValue.showPageSize)}
            onChange={handleFieldChange('showPageSize')}
          />
        </div>
        <div className="col-md-12 mb-3">
          <ReactSelect
            className="position-relative"
            title={getFormattedMessage("globally.input.pageOrientation.name")}
            data={showPageOrientation}
            defaultValue={defaultPageOrientation}
            value={showPageOrientation.find(option => option.value === fieldValue.showPageOrientation)}
            onChange={handleFieldChange('showPageOrientation')}
          />
        </div>
      </div>
    </Modal.Body>
    <div style={{ textAlign: "center", marginBottom: "20px", display: "flex", gap: "20px", justifyContent: "center" }}>
      <button style={{
        width: "100px",
        height: "30px",
        border: "none",
        borderRadius: "10px",
        backgroundColor: "red",
        color: "white"
      }}
        onClick={exportToPDF}>
        Print
      </button>
      <button style={{
        width: "100px",
        height: "30px",
        border: "none",
        borderRadius: "10px",
        backgroundColor: "green",
        color: "white"
      }}
        onClick={handleFieldCancel}>
        Cancel
      </button>
    </div>
  </Form>
</Modal>

        </>
    )
}

const mapStateToProps =(state) => {
    const {closingStocks,companyConfig} =state;
    return{closingStocks,companyConfig};
}

export default connect(mapStateToProps,{fetchClosingStockReport,fetchCompanyConfig}) (ClosingStockReport)