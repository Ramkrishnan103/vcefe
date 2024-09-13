import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form, Modal } from "react-bootstrap-v5";
import TopProgressBar from "../../../shared/components/loaders/TopProgressBar";
import MasterLayout from "../../MasterLayout";
import { ReactTabulator } from 'react-tabulator';
import 'react-tabulator/lib/styles.css';
import 'tabulator-tables/dist/css/tabulator_simple.min.css';
import { faFilter, faFileExcel, faFilePdf, faPrint, faXmark } from "@fortawesome/free-solid-svg-icons";
import ClosingStockReportForm from "./ClosingStockReportForm";
import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import UnitsForm from "../../units/UnitsForm";
import Units from "../../units/Units";
import { connect } from "react-redux";
import { fetchClosingStockReport } from "../../../store/action/ClsoingStockReportAction";
import html2canvas from 'html2canvas';
import { fetchCompanyConfig } from "../../../store/action/companyConfigAction";
import { getFormattedMessage } from "../../../shared/sharedMethod";
import ClosingStockField from "./ClosingStockField";
import { jsPDF } from 'jspdf';
import ReactSelect from "../../../shared/select/reactSelect";
import * as XLSX from 'xlsx';
const today = new Date();
const numOfDaysAdded = 0;
const date = new Date(today.setDate(today.getDate() + numOfDaysAdded));
const defaultValue = date.toISOString().split('T')[0]; 
const formatDecimal = (cell, formatterParams, onRendered) => {
  const value = cell.getValue();
  // Format number to 2 decimal places
  return value.toFixed(2);
};
const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const ClosingStockReport = ({ closingStocks, fetchClosingStockReport,ItemValues, companyConfig, fetchCompanyConfig }) => {
  const today = new Date();
  const formattedDate = formatDate(today);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [fetchRangeValue, setFetchRangeValue] = useState({
    category1Name: "",
    category2Name: "",
    category3Name: "",
    unitName: ""
  });
  const [label, setLabel] = useState(false);
  const [fieldShow, setFieldShow] = useState(false);
  const handleFieldClose = () => setFieldShow(!fieldShow);
  const pdfRef = useRef(null);
  const searchRef = useRef();
  const [fieldValue, setFieldValue] = useState({
    showPageSize: "",
    showPageOrientation: ""
  });
  const [loadingPdf, setLoadingPdf] = useState(false);
  const navigate = useNavigate();

  const columns = [
    { title: "Code", field: "code",headerSort:false,width:"10%" },
    { title: "Product Name", field: "productName",headerSort:false,width:'40%' },
    { title: "MRP", field: "mrp",headerSort:false ,hozAlign:"center", headerHozAlign: "center",formatter: formatDecimal ,width:"10%" },
    { title: "Stock", field: "stock",headerSort:false ,hozAlign:"center", headerHozAlign: "center",width:"10%"  },
    { title: "Unit Name", field: "unitName",headerSort:false, hozAlign:"right", headerHozAlign: "right" ,width:"10%"},
    { title: "Cost", field: "cost",headerSort:false, hozAlign:"right", headerHozAlign: "right" ,formatter: formatDecimal,width:"10%"    },
    { title: "Value", field: "value",headerSort:false , hozAlign:"right" ,headerHozAlign: "right",formatter: formatDecimal  ,width:"10%"  }
  ];

  const onChange = () => {
    setSearch(searchRef.current.value);
  };

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(!show);

  const [formcode, setFormCode] = useState("R02");
  useEffect(() => {
    debugger;
    const storedFormData = localStorage.getItem("UserFormCode");

    if (storedFormData) {
      const parsedFormData = JSON.parse(storedFormData);

      console.log("Parsed Form Data:", parsedFormData);
      if (parsedFormData.length > 0) {
        const formCodeItems = parsedFormData.filter((item) => item?.attributes?.formCode == formcode && item?.attributes?.visibility );
        console.log("Form Code Items:", formCodeItems);
        if(!formCodeItems.length > 0){
            navigate("/app/dashboard");
        }
      } else {
        navigate("/app/dashboard");
      }
    } 
  }, []);

  useEffect(() => {
    fetchCompanyConfig();
    fetchClosingStockReport();
  }, []);
  const itemsValue = closingStocks?.length >= 0 &&
  closingStocks.map(closingStock => ({
    code: closingStock.attributes.itemCode,
    productName: closingStock.attributes.itemName,
    mrp: closingStock.attributes.mrp,
    stock: closingStock.attributes.stock,
    unitName: closingStock.attributes.unitName,
    cost: closingStock.attributes.purchaseCost,
    value: closingStock.attributes.salesPrice
  })) || [];



  const totalSalesValue = (data) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(data.reduce((acc, curr) => acc + parseFloat(curr.value), 0));
  };
  const calculateFooterData = (table) => {
    const data = table.getData();
   
    const totalValue = data.reduce((acc, row) => acc + (row.value || 0), 0);
  
    return `
      <div style='width:100%; text-align: right; padding: 10px; border-top: 1px solid #ddd; background-color: #f9f9f9;'>
        <div>Total</div>
        <div>Total Value:${totalValue.toFixed(2)}</div>
      </div>
    `;
  };
  

  const [range, setRange] = useState({
    category1Name: "",
    category2Name: "",
    category3Name: "",
    unitName: "",
  });

  const handleClick = (e) => {
    setFieldShow(true);
  };

  const companyDetails = {
    companyName: companyConfig?.companyName,
    address: `${companyConfig?.attributes?.address1} , ${companyConfig?.attributes?.address2}`,
    phoneNumber: companyConfig?.attributes?.phoneNo
  };

  const reportDetails = {
    title: "Closing Stock Report as on",
    dateRange: formattedDate
  };
  useEffect(() => {
    console.log("Closing Stocks: ", closingStocks);
    console.log("Items Value: ", itemsValue);
  }, [closingStocks]);

  const getCurrentDateTimeInIST = () => {
    const now = new Date();
    const offset = 5.5; // IST is UTC+5:30
    const istDate = new Date(now.getTime() + offset * 3600 * 1000);
    return istDate.toISOString().replace(/T/, ' ').replace(/\..+/, '');
  };
  const [showField,setShowField]=useState()
  const generatePDF = useCallback((companyDetails, reportDetails, orientation) => {
    if (!pdfRef.current) {
      console.error("pdfRef.current is null");
      return;
    }

    html2canvas(pdfRef.current, { scale: 1.5, useCORS: true }).then(canvas => {
      const resizedCanvas = document.createElement('canvas');
      const resizedCtx = resizedCanvas.getContext('2d');
      resizedCanvas.width = canvas.width / 2;
      resizedCanvas.height = canvas.height / 2;
      resizedCtx.drawImage(canvas, 0, 0, resizedCanvas.width, resizedCanvas.height);

      const imgData = resizedCanvas.toDataURL('image/png');
      const isLandscape = orientation === 'Landscape';
      const pdf = new jsPDF({
        orientation: isLandscape ? 'landscape' : 'portrait',
        unit: 'mm',
        format: isLandscape ? [297, 210] : [210, 297]
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const centerX = pdfWidth / 2;
      const topMargin = 20;
      const textSpacing = 3;

      pdf.setFontSize(12);
      pdf.text(companyDetails.companyName, centerX, topMargin, { align: 'center' });
      pdf.setFontSize(10);
      pdf.text(companyDetails.address, centerX, topMargin + textSpacing + 5, { align: 'center' });
      pdf.text(`Phone: ${companyDetails.phoneNumber}`, centerX, topMargin + 2 * textSpacing + 10, { align: 'center' });

      pdf.setLineWidth(0.2);
      pdf.line(10, topMargin + 3 * textSpacing + 15, pdfWidth - 10, topMargin + 3 * textSpacing + 15);

      pdf.setFontSize(12);
      pdf.text(reportDetails.title, 10, topMargin + 4 * textSpacing + 25);
      pdf.text(reportDetails.dateRange, 10, topMargin + 5 * textSpacing + 30);

      const imgProps = pdf.getImageProperties(imgData);
      const pdfImgWidth = pdfWidth - 20;
      const pdfImgHeight = (imgProps.height * pdfImgWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 10, topMargin + 6 * textSpacing + 35, pdfImgWidth, pdfImgHeight);
      setLoadingPdf(false);
      pdf.save(`ClosingStockReport_${formattedDate}.pdf`);
    }).catch(error => {
      console.error('Error generating PDF:', error);
    });
  }, [formattedDate]);

  const generateAndPrintPDF = useCallback((companyDetails, reportDetails, orientation) => {
    const { companyName, address, phoneNumber } = companyDetails;
    const { title, dateRange } = reportDetails;
  
    if (!pdfRef.current) {
        console.error("pdfRef.current is null");
        return;
    }
  
    const input = pdfRef.current;
    html2canvas(input, { scale: 1.5,useCORS:true }).then((canvas) => {
      const resizedCanvas = document.createElement('canvas');
      const resizedCtx = resizedCanvas.getContext('2d');
      resizedCanvas.width = canvas.width / 2; // Reduce the size
      resizedCanvas.height = canvas.height / 2;
      resizedCtx.drawImage(canvas, 0, 0, resizedCanvas.width, resizedCanvas.height);
  
      const imgData = resizedCanvas.toDataURL('image/png');
      const isLandscape = orientation === 'Landscape';
      const pdf = new jsPDF({
          orientation: isLandscape ? 'landscape' : 'portrait',
          unit: 'mm',
          format: isLandscape ? [297, 210] : [210, 297]
      });
  
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const centerX = pdfWidth / 2;
      const topMargin = 20;
      const textSpacing = 3;
      const lineSpacing = 15;
  
      pdf.setFontSize(12);
      pdf.text(companyName, centerX, topMargin, { align: 'center' });
      pdf.setFontSize(10);
      pdf.text(address, centerX, topMargin + textSpacing + 5, { align: 'center' });
      pdf.text(`Phone: ${phoneNumber}`, centerX, topMargin + 2 * textSpacing + 10, { align: 'center' });
  
      pdf.setLineWidth(0.2);
      pdf.line(10, topMargin + 3 * textSpacing + 15, pdfWidth - 10, topMargin + 3 * textSpacing + 15);
  
      pdf.setFontSize(12);
      pdf.text(title, 10, topMargin + 4 * textSpacing + 25);
      pdf.text(dateRange, 10, topMargin + 5 * textSpacing + 30);
  
      const imgWidth = pdfWidth - 20;
      const imgHeight = (resizedCanvas.height * imgWidth) / resizedCanvas.width;
      const xOffset = 10;
      const yOffset = topMargin + 6 * textSpacing + 35;
  
      pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);
  
      const addFooter = () => {
          const pageCount = pdf.internal.getNumberOfPages();
          for (let i = 1; i <= pageCount; i++) {
              pdf.setPage(i);
              pdf.setFontSize(10);
              pdf.text(`Page ${i} of ${pageCount}`, pdfWidth / 2, pdfHeight - 10, { align: 'center' });
          }
      };
      addFooter();
      const pdfBlob = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const iframe = document.createElement('iframe');
          iframe.style.position = 'absolute';
          iframe.style.width = '0';
          iframe.style.height = '0';
          iframe.style.border = 'none';
          document.body.appendChild(iframe);
  
          iframe.onload = () => {
              iframe.contentWindow.focus();
              iframe.contentWindow.print();
          };
  
          iframe.contentWindow.onafterprint = () => {
              
              document.body.removeChild(iframe);
              URL.revokeObjectURL(pdfUrl);
          };
  
          iframe.src = pdfUrl;
    }).catch(error => {
        console.error('Error generating canvas:', error);
    });
  }, []);
  const exportToPrintPDF = () => {

    generateAndPrintPDF(companyDetails, reportDetails,fieldValue.showPageOrientation )
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
const showPageSize = [
  { value: "A4", label: "A4" },
];
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
    const onClick = () => {
      setLabel(true)
      //  navigate(`/app/report/closingStock`)
    //    setShowStatements(true)
       setShow(true)
      //  console.log("Range =>" ,range)
       setFetchRangeValue(range)
       console.log("fetchRangeValue =>" ,fetchRangeValue)
        };
  return (
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
             onClick={exportToPrintPDF}
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
<div className="col-md-12 w-100 tabulator-container " >

  
<ReactTabulator 
                  columns={columns}
                  data={itemsValue}
                  ref={pdfRef}
                  options={{
                    columnHeaderVertAlign: "bottom",
                    layout: 'fitColumns',
                    responsiveLayout: "collapse",
                    placeholder: "No records found",
                    height:"350px",
                   footerElement:`<div style='width:100%;text-align: left; padding: 10px; border: 1px solid rgb(99, 166, 77); border-radius: 5px; display: flex; justify-content: space-between; align-items: center;'>
                    <div style='padding-left: 10px;'>Total</div>
                    <div style='padding-right: 10px;'>
                    ${totalSalesValue(itemsValue)}
                    </div>
            </div>`
                  }}
                />
    

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
  );
};


const mapStateToProps = (state) => {
 const {closingStocks,companyConfig}=state;
 return {closingStocks,companyConfig}
};



export default connect(mapStateToProps,{fetchClosingStockReport,fetchCompanyConfig} )(ClosingStockReport);
