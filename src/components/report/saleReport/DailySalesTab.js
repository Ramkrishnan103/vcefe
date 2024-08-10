import React, {useEffect, useRef, useState} from 'react';
import moment from 'moment';
import {connect} from 'react-redux';
import { fetchDailySales } from '../../../store/action/dailySalesAction';
import { fetchFrontSetting } from '../../../store/action/frontSettingAction';
import { saleExcelAction } from '../../../store/action/salesExcelAction';
import { getFormattedMessage, placeholderText } from '../../../shared/sharedMethod';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint, faFileExcel, faFilePdf, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import ReactDataTable from '../../../shared/table/ReactDataTable';
import { InputGroup } from 'react-bootstrap';
import ReactSelect from 'react-select';
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

    console.log("dailySales",dailySales)
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
const generateSalesReportPDF = () => {
  const { companyName, address, phoneNumber } = companyDetails;
  const { title, dayRange } = reportDetails;

  const doc = new jsPDF();
  let pageNumber = 1;

  const addHeader = () => {
      doc.setFontSize(18);
      doc.text(companyName, 105, 20, null, null, 'center');
      doc.setFontSize(12);
      doc.text(address, 105, 28, null, null, 'center');
      doc.setFontSize(10);
      doc.text(phoneNumber, 105, 35, null, null, 'center');
      doc.setLineWidth(0.2);
      doc.line(10, 40, 200, 40);
  };

  const addFooter = () => {
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(10);
      doc.text(`Page ${pageNumber} of ${pageCount}`, 105, 290, null, null, 'center');
  };

  addHeader();
  doc.setFontSize(14);
  doc.text(`${title} (${dayRange})`, 10, 50);

  doc.autoTable({
      startY: 60,
      head: [['Date', 'Inv No', 'Customer Name', ...(paymode.current?.value === '' ? ['Payment Mode'] : []), 'Sales Value']],
      body: itemsValue.map(item => [
          item.Date,
          item.invNo,
          item.customerName,
          ...(paymode.current?.value === '' ? [item.paymentMode] : []),
          item.salesValue
      ]),
      foot: [['Total', '', '', '', itemsValue.reduce((acc, curr) => acc + parseFloat(curr.salesValue), 0).toFixed(2)]],

      
      headStyles: {
        0: { halign: 'left' },
        1: { halign: 'left' },
        2: { halign: 'left' },
        [paymode.current?.value === '' ? 3 : 4]: { halign: 'right' }
    },
      columnStyles: {
        0: { halign: 'left' },   // Align Date to the left
        1: { halign: 'left' },   // Align Inv No to the left
        2: { halign: 'left' },   // Align Supplier Name to the left
        3: { halign: 'left' },   // Align Payment Mode to the left (if included)
        [paymode.current?.value === '' ? 4 : 3]: { halign: 'right' }   // Align Purchase Value to the right
    },
    footStyles: {
      0: { halign: 'left' },   // Total
      1: { halign: 'left' },   // Empty
      2: { halign: 'left' },   // Empty
      [paymode.current?.value === '' ? 3 : 4]: { halign: 'right' } // Total Value
  },
      didDrawPage: () => {
          addFooter();
          pageNumber++;
      },
      margin: { top: 50 },
      pageBreak: 'auto'
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
  const filename = `Daily_Sales_${dateString}_${timeString}.pdf`;

  doc.save(filename);
};
const exportToPDF = () => {
  generateSalesReportPDF(companyDetails, reportDetails, itemsValue)
 };
 const printTable = () => {
  
  const printWindow=window.open('','','height=600,width=800');
  printWindow.document.write('<div className="company-info">');
   printWindow.document.write(`<h2 >${companyDetails.companyName}</h2>`);
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

    return (
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
              onClick={exportToPDF}
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

<div className="fixTableHead">
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

                        
      
    )
};

const mapStateToProps = (state) => {
    const {dailySales,isLoading, totalRecord, frontSetting,companyConfig} = state;
    return {dailySales,isLoading, totalRecord, frontSetting,companyConfig}
};

export default connect(mapStateToProps, {fetchFrontSetting, fetchDailySales, saleExcelAction,fetchCompanyConfig})(DailySalesTab);
