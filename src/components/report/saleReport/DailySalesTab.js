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
import { ReactTabulator } from 'react-tabulator';
import 'react-tabulator/lib/styles.css'; // Import Tabulator styles
import 'tabulator-tables/dist/css/tabulator_simple.min.css'; // Import Tabulator styles



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
    const formatDecimal = (cell, formatterParams, onRendered) => {
      const value = cell.getValue();
      // Format number to 2 decimal places
      return value.toFixed(2);
    };
  
    useEffect(() => {
     
      fetchCompanyConfig()
    }, []);
    useEffect(() => {
        fetchFrontSetting();
    }, [warehouseValue]);
    const columns=[
      {title:"Date",field:"date",headerSort:false,width:"10%"},
      {title:"InvNo",field:"invNo",headerSort:false,width:"20%"},
      {title:"Customer Name",field:"customerName",headerSort:false,width:"20%"},
      {title:"Payment Type",field:"paymentType",headerSort:false,hozAlign:"center", headerHozAlign: "center",width:"15%"},
      {title:"Address",field:"address",headerSort:false,width:"15%"},
      {title:"Sales Value",field:"salesValue",headerSort:false,hozAlign:"right",headerHozAlign:"right",formatter: formatDecimal ,width:"20%"  },
    ]

    const itemsValue = dailySales?.length >= 0 && dailySales.map(dailysale => {
      
        return (
            {
                date:dailysale?.date=== null ? null : moment( dailysale.date).format("DD-MM-YYYY"),
                invNo:dailysale.attributes.invNo,
              
                customerName: dailysale.attributes.customerName,
                paymentType: dailysale.attributes.paymentType,
                address:dailysale.attributes.customerAddress,
                salesValue:dailysale.attributes.salesValue,
            }
        )
    });

    console.log("itemsValue",itemsValue)
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
const generatePDF = useCallback((companyDetails, reportDetails, orientation) => {
  const { companyName, address, phoneNumber } = companyDetails;
    const { title, dayRange } = reportDetails;

    if (!pdfRef.current) {
        console.error("pdfRef.current is null");
        return;
    }

    const input = pdfRef.current;
    html2canvas(input, { scale: 1.5, useCORS: true }).then((canvas) => {
        // Create a new canvas to resize the image
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
        pdf.text(dayRange, 10, topMargin + 5 * textSpacing + 30);

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
      pdf.save(`Daily_Sales${getCurrentDateTimeInIST()}.pdf`);
  }).catch(error => {
      console.error('Error generating canvas:', error);
  });
}, []);


const generateAndPrintPDF = useCallback((companyDetails, reportDetails, orientation) => {
  const { companyName, address, phoneNumber } = companyDetails;
  const { title, dayRange } = reportDetails;

  if (!pdfRef.current) {
      console.error("pdfRef.current is null");
      return;
  }

  const input = pdfRef.current;
  html2canvas(input, { scale: 1.5 , useCORS: true}).then((canvas) => {
      // Create a new canvas to resize the image
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
      pdf.text(dayRange, 10, topMargin + 5 * textSpacing + 30);

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
             onClick={exportToPrintPDF}
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

            <div className="tabulator-container" style={{borderRadius:"5px"}}>

{
  itemsValue.length>0&&(
    <ReactTabulator
    ref={pdfRef} columns={columns} 
        data={itemsValue}
         options={{
           columnHeaderVertAlign:"bottom",
           layout:"fitColumns",
           responsiveLayout:"hide",
           placeholder:"No records found",
           height:"350px",
           
           footerElement:`<div style='width:100%;text-align: left; padding: 10px; border: 1px solid rgb(99, 166, 77); border-radius: 0 0 5px 5px;   display: flex; justify-content: space-between; align-items: center;'>
    <div style='padding-left: 10px;'>Total</div>
    <div style='padding-right: 10px;'>${totalSalesValue(itemsValue)}</div>
  </div>`,
  // footer: (table) => getFooterData(table)
        }}
    />
  )
}
</div>
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
            defaultValue={defaultPageOrientation}
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
