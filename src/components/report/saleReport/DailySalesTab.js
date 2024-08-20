import React, {useEffect, useRef, useState,useCallback} from 'react';
import { Form, Modal } from "react-bootstrap-v5";
import moment from 'moment';
import {connect} from 'react-redux';
import { fetchDailySales } from '../../../store/action/dailySalesAction';
import { fetchFrontSetting } from '../../../store/action/frontSettingAction';
import { saleExcelAction } from '../../../store/action/salesExcelAction';
import { getFormattedMessage, placeholderText } from '../../../shared/sharedMethod';
import html2canvas from 'html2canvas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint, faFileExcel, faFilePdf, faXmark } from '@fortawesome/free-solid-svg-icons';
import ReactDataTable from '../../../shared/table/ReactDataTable';
import { InputGroup } from 'react-bootstrap';
import ReactSelect from "../../../shared/select/reactSelect";
import { address, date } from 'faker/lib/locales/az';
import { apiBaseURL } from '../../../constants';
import loader from 'sass-loader';
import { filter } from 'lodash';
import CommonTable from '../../../shared/table/CommonTable';
import {jsPDF} from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import {fetchCompanyConfig} from "../../../store/action/companyConfigAction";

// import "../../assets/css/frontend.css";

const DailySalesTab = (props) => {
    const {
        isLoading,
        totalRecord,
        fetchDailySales,
        dailySales,
        frontSetting,
        fetchFrontSetting,
        warehouseValue,
        saleExcelAction, allConfigData
        ,companyConfig
    } = props;
    const currencySymbol = frontSetting && frontSetting.value && frontSetting.value.currency_symbol
    const [isWarehouseValue, setIsWarehouseValue] = useState(false);
    const pdfRef = useRef(null);
    console.log("dailySales",dailySales)
    const [fieldValue,setFieldValue]=useState({
      showPageSize:"",
      showPageOrientation:""
    })
    const [loadingPdf,setLoadingPdf]=useState(false)
  
    useEffect(() => {
     
      fetchCompanyConfig()
    }, []);
    useEffect(() => {
        fetchFrontSetting();
    }, [warehouseValue]);

    const itemsValue = dailySales?.length >= 0 && dailySales.map(dailysale => {
      
        return (
            {
                Date:dailysale?.date=== null ? null : moment( dailysale.date).format("DD-MM-YYYY"),
                invNo:dailysale.attributes.invNo,
              
                customerName: dailysale.attributes.customerName,
                paymentMode: dailysale.attributes.paymentType,
                address:dailysale.attributes.customerAddress,
                salesValue:dailysale.attributes.salesValue,
            }
        )
    });

    console.log("itemsValue",itemsValue)

   

    const footers = [
        {
          name: getFormattedMessage("totalSales.title"),
            
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
    }).format(data.reduce((acc, curr) => acc + parseFloat(curr.salesValue), 0));
  };
  

    const today=new Date();
    const numOfDaysAdded=0;
    const date=today.setDate(today.getDate() + numOfDaysAdded);
    const defaultValue=new Date(date).toISOString().split('T')[0];  // YYYY-MM-dd


    const fromDate=useRef();
    const tooDate=useRef();
    const paymode=useRef();
    const search=useRef();


    // const [selectPayMode,setSelectPayMode] =useState('')
    // const [fromDate1,setFromDate1] =useState('')
    // const [todate,setToDate] =useState('')
    const loadValues=(filter)=>{
        let values="?fromDate="+fromDate.current.value +"&toDate="+tooDate.current.value 
        + "&counterId=0&paymentType="+paymode.current.value+"&particular="+search.current.value
        console.log(values);
        fetchDailySales(values,filter,true);
        
    }
    const companyDetails = {
      companyName: companyConfig?.companyName,
      address: `${companyConfig?.attributes?.address1} , ${companyConfig?.attributes?.address2}`,
      phoneNumber: companyConfig?.attributes?.phoneNo
    };
    const formatDate = (dateString) => {
      return moment(dateString).format('DD-MM-YYYY');
  };
  const reportDetails = {
    title: "Daily Sales Report",
    dayRange: `${formatDate(fromDate.current?.value)} - ${formatDate(tooDate.current?.value)}`

};
const getCurrentDateTimeInIST = () => {
  const now = new Date();
  const offset = 5.5; // IST is UTC+5:30
  const istDate = new Date(now.getTime() + offset * 3600 * 1000);
  return istDate.toISOString().replace(/T/, ' ').replace(/\..+/, '');
};
const generatePDF = useCallback((companyDetails,reportDetails,orientation) => {
  const { companyName, address, phoneNumber } = companyDetails;
  const { title, dayRange } = reportDetails;
  if (!pdfRef.current) {
    console.error("pdfRef.current is null");
    return;
  }
  const input=pdfRef.current ;
  html2canvas(input, { scale: 2 }).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');

    const isLandscape = orientation === 'Landscape';
    const pdf = new jsPDF({ orientation:isLandscape? 'landscape' :'portrait', unit: 'mm',  format: isLandscape ? [297, 210] : [210, 297] });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.setFontSize(14);
    pdf.text(companyName, pdfWidth / 2, 10, { align: "center" });
    pdf.setFontSize(12);
    pdf.text(address, pdfWidth / 2, 20, { align: 'center' });
    pdf.text(`Phone: ${phoneNumber}`, pdfWidth / 2, 30, { align: 'center' });
    pdf.setLineWidth(0.2);
    pdf.line(10, 42, 200, 40);

    pdf.setFontSize(12);
    pdf.text(title, 10, 50);
    pdf.text(dayRange, 10, 60);

    pdf.addImage(imgData, 'PNG', 10, 70, imgWidth, imgHeight);
  
  const addFooter = () => {
    const pageCount = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.text(`Page ${i} of ${pageCount}`, pdfWidth / 2, 290, { align: 'center' });
    }
  };

  addFooter();
  pdf.save(`Daily_Sales_${getCurrentDateTimeInIST()}.pdf`);
    })
},[])

 const printTable = () => {
  
  const printWindow=window.open('','','height=600,width=800');
  printWindow.document.write('<style>');
printWindow.document.write('.company-info {');
printWindow.document.write('  text-align: center;');
printWindow.document.write('  margin: 0 auto;');
printWindow.document.write('  padding: 20px;');
printWindow.document.write('  max-width: 600px;'); // Adjust the max-width as needed
printWindow.document.write('}');
printWindow.document.write('</style>');

  printWindow.document.write('<div class="company-info">');
   printWindow.document.write(`<h2>${companyDetails.companyName}</h2>`);
   printWindow.document.write(`<p>${companyDetails.address}</p>`);
   printWindow.document.write(`<p>${companyDetails.phoneNumber}</p>`);
   printWindow.document.write('</div>');
   printWindow.document.write('<hr>');
  
   // Add report details
   printWindow.document.write('<div className="report-info">');
   printWindow.document.write(`<h3>${reportDetails.title}</h3>`);
   printWindow.document.write(`<p>${reportDetails.dayRange}</p>`);
   printWindow.document.write('</div>');

  const tableContent=document.querySelector('.table-container').outerHTML;
  printWindow.document.write('<html><head><title>Print</title>');
  printWindow.document.write('<style>');
   printWindow.document.write('table { width: 100%; border-collapse: collapse; }');
   printWindow.document.write('th, td { border: 1px solid black; padding: 8px; text-align: left; }');
   printWindow.document.write('th { background-color: #f2f2f2; }');
   printWindow.document.write('.salesValue { text-align: right; }');
   printWindow.document.write('@media print { .no-print { display: none; } }');
   printWindow.document.write('</style>');
   printWindow.document.write('</head><body >');
   printWindow.document.write('<h1>Daily Sales Report</h1>'); // Add headers or other content here
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

const XLSX = require('xlsx');
const fs = require('fs');

const generateSalesReportExcel = () => {
  
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet([
      [companyDetails.companyName],
      [companyDetails.address],
      [companyDetails.phoneNumber],
      [],
      [`${reportDetails.title} (${reportDetails.dayRange})`],
      [],
      ['Date', 'Inv No', 'Customer Name', ...(paymode.current?.value === '' ? ['Payment Mode'] : []), 'Sales Value']
  ]);

  itemsValue.forEach(item => {
      XLSX.utils.sheet_add_aoa(worksheet, [
          [item.Date, item.invNo, item.customerName, ...(paymode.current?.value === '' ? [item.paymentMode] : []), item.salesValue]
      ], { origin: -1 });
  });

  const totalValue = itemsValue.reduce((acc, curr) => acc + parseFloat(curr.salesValue), 0).toFixed(2);
  XLSX.utils.sheet_add_aoa(worksheet, [['Total', '', '', '', totalValue]], { origin: -1 });

  worksheet['!cols'] = [{ wch: 15 }, { wch: 15 }, { wch: 20 }, { wch: 20 }];

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Daily Sales');
  XLSX.writeFile(workbook, 'DailySales.xlsx');
};

const exportToExcel=()=>{
  generateSalesReportExcel (companyDetails, reportDetails, itemsValue)
  }

    const onExcelClick = () => {
        setIsWarehouseValue(true);
    };
    const exportToPDF = () => {

      generatePDF(companyDetails, reportDetails,fieldValue.showPageOrientation )
    };
    const showPageSize=[
      {value:"",label:""},
      {value:"24mm",label:"24mm"},
      {value:"27mm",label:"27mm"},
      
    ]
    const showPageOrientation=[
      {value:"",label:""},
      {value:"Portrait",label:"Portrait"},
      {value:"Landscape",label:"Landscape"},
      
    ]
    const closeButtonClick = () => {
      setLoadingPdf(false)
    };
    const handleFieldChange = (field) => (selectedOption) => {
      setFieldValue((prevValues) => ({
        ...prevValues,
        [field]: selectedOption ? selectedOption.value : ""
      }));
    };
    
    
    const handleClick=()=>{
    setLoadingPdf(true)
    
    }
    const handleFieldCancel=()=>{
      setLoadingPdf(false)
    }

    return (
      <>
        <div className='warehouse_sale_report_table'>
 
             <div className='row'>
                <div className='col-md-2'> 
                        <h4 className='mt-2'>From Date</h4>
                </div>

                 <div className='col-md-2'>
                        <input id1='dateInput' type='date' ref={fromDate}  defaultValue={defaultValue}
                  className=' form-control rounded text-align-center ml-2 align-item-center mr-15 mb-5' ></input>
                </div>

                <div className='col-md-1'></div>

                <div className='col-md-2 mt-2'>
                        <h4>To Date</h4>
                </div>

                <div className='col-md-2'>
                        <input id2='dateRequired2' type='date' ref={tooDate} defaultValue={defaultValue}  className='form-control  rounded text-align-center  align-items-center mr-15 mb-5'></input>
                </div>

                <div className='col-md-1'></div>
                <div className='col-md-2 mx-auto ' >
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
              style={{ color: "black" }}
             onClick={printTable}
            ></FontAwesomeIcon>

            <FontAwesomeIcon
              icon={faFileExcel}
              className="fa-2x search-icon "
              style={{ color: "green", paddingLeft: "10px" }}
              onClick={exportToExcel}
            ></FontAwesomeIcon>

            <FontAwesomeIcon
              icon={faFilePdf}
              className="fa-2x search-icon"
              style={{ color: "red", paddingLeft: "10px" }}
              onClick={handleClick}
             
            ></FontAwesomeIcon>

          </button>
        </div>
        </div>
        <div className='row'>
  
  <div className='col-md-2 mt-2'>
      <h4>Search</h4>
  </div>
  
  <div className='col-md-3'>
                     <input type='text' ref={search}  placeholder='Customer Name Or Mobile No Or Inv. No' className=' form-control rounded text-align-center  align-items-center mr-15 mb-5'></input>
                </div>
                <div className='col-md-2 mt-2 d-flex ' >
                        <h4 className="col me-1">Select Pay Mode</h4>
                        </div>
                        <div className='col-md-3'>
                    <select className='w-50 h-20 p-3 flex-nowrap dropdown-side-btn- boder-0 form-control ' ref={paymode}
                     name='DropDownValue' >
                        <option value=''>All</option>
                        <option value='Cash'>Cash</option>
                        <option value='Upi'>Upi</option>
                        <option value='Bank'>Bank</option>
                    </select>
                </div>
             
           


               
                <div className='col-md-2'>
                    <button className=' form-control border-0 bg-success text-white' onClick={loadValues}>Generate</button>
                </div>
            </div>

{/* <div className='row'>
        <div className='col-md-3'>
            <h4 style={{color:"green"}}>From Date = {fromDate1?fromDate1:defaultValue}</h4>
        </div>
        <div className='col-md-3'>
            <h4 style={{color:"green"}}>To Date = {todate?todate:defaultValue}</h4>
        </div>
        <div className='col-md-3'>
            <h4 style={{color:"green"}} >Payment Type ={selectPayMode?selectPayMode:"All"}</h4>
        </div>
</div> */}



<div className="col-md-12">
       {itemsValue.length>0 && 

<div className="fixTableHead" ref={pdfRef}>
<table className='table-container'>
  <thead>
    <tr >
      <th style={{fontWeight:"bold",fontSize:"16px"}}>Date</th>
      <th style={{fontWeight:"bold",fontSize:"16px"}}>Inv No</th>
      <th style={{fontWeight:"bold",fontSize:"16px"}}>Customer Name</th>
      { paymode.current.value=='' &&
        <th style={{fontWeight:"bold",fontSize:"16px"}}>Payment Type</th>
        }
      <th style={{fontWeight:"bold",fontSize:"16px"}}>Address</th>
      <th style={{fontWeight:"bold",textAlign:"right",fontSize:"16px"}}> Sales Value</th>
    </tr>
  </thead>


 
  <tbody>
    {itemsValue.map((month, index) => (
      <tr key={index}>
        <td >{month.Date}</td>
        <td >{month.invNo}</td>
        <td >{month.customerName}</td>
        { paymode.current.value=='' &&
        <td >{month.paymentMode}</td>
        }
        <td >{month.address}</td>
        <td className="salesvalue">{
            new Intl.NumberFormat('en-IN', {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(parseFloat(month.salesValue), 0)
            }
        </td>
      </tr>
    ))}
  </tbody>

  
  <tfoot>
    <tr >
      {footers.map((footer) => (
        <th colSpan="4">{footer.name}</th>
      ))}
      <th colSpan="5" style={{textAlign:"right"}}>{totalSalesValue(itemsValue)}</th>
    </tr>
  </tfoot>
  </table>
</div>
}
</div>
</div> 
<Modal show={loadingPdf} onHide={() => setLoadingPdf(false)} centered>
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
          <p>We'll create a printer-friendly PDF version of your report.</p>
        </div>
        <div className="col-md-12 mb-3">
          
          <ReactSelect
            className="position-relative"
            title={getFormattedMessage("globally.input.pageSize.name")}
            data={showPageSize}
            value={showPageSize.find(option => option.value === fieldValue.showPageSize)}
            onChange={handleFieldChange('showPageSize')}
          />
        </div>
        <div className="col-md-12 mb-3">
          <ReactSelect
            className="position-relative"
            title={getFormattedMessage("globally.input.pageOrientation.name")}
            data={showPageOrientation}
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
};

const mapStateToProps = (state) => {
    const {dailySales,isLoading, totalRecord, frontSetting,companyConfig} = state;
    return {dailySales,isLoading, totalRecord, frontSetting,companyConfig}
};

export default connect(mapStateToProps, {fetchFrontSetting, fetchDailySales, saleExcelAction,fetchCompanyConfig})(DailySalesTab);
