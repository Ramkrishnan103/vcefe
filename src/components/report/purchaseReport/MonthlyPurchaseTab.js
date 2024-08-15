import React, { useEffect, useState, useRef } from 'react';
import moment, { monthsShort } from 'moment';
import { connect } from 'react-redux';
import { fetchMonthPurchase, fetchMonthPurchaseparam, } from '../../../store/action/monthlyPurchaseAction';
import { fetchFrontSetting } from '../../../store/action/frontSettingAction';

import { getFormattedMessage, placeholderText } from '../../../shared/sharedMethod';

import { InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint, faFileExcel, faFilePdf, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import ReactSelect from '../../../shared/select/reactSelect';
import { fetchAcYear } from "../../../store/action/acYearAction";
import { filter, stubString } from "lodash";
import {jsPDF} from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import {fetchCompanyConfig} from "../../../store/action/companyConfigAction";
import { useNavigate } from "react-router";


const MonthlyPurchaseTab = (props) => {
 
  const {
    acYear,
    isLoading,
    totalRecord,
    fetchMonthPurchase,
    fetchMonthPurchaseparam,
    monthlyPurchase,
    frontSetting,
    fetchFrontSetting,
    warehouseValue,
    allConfigData,
    fetchAcYear,companyConfig,fetchCompanyConfig
  } = props;
  const navigate =useNavigate();
  const searchRef = useRef();
  console.log("companyConfig",companyConfig)
  useEffect(() => {
    fetchFrontSetting();
  }, [warehouseValue]);
  console.log(acYear)
  
  useEffect(() => {
    fetchAcYear();
    fetchCompanyConfig()
  }, []);
  console.log("companyConfig",companyConfig)
  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.focus();
    }
  }, []);
  const [isClearDropdown, setIsClearDropdown] = useState(true);
  const [isDropdown, setIsDropdown] = useState(true);
  const [errors, setErrors] = useState();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [itemsRecord, setItemsRecord] = useState(false)
 
  console.log(monthlyPurchase)

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterItems(query);
  };

  const filterItems = (query) => {
    if (query === '') {
      setFilteredItems(itemsValue);
      setItemsRecord(false)
    } else {
      const filtered = itemsValue.filter(item =>
        item.monthYear.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredItems(filtered);
      setItemsRecord(true)
      console.log("filtered", filteredItems)
    }
  };
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const yearRange = `${currentYear}-${nextYear}`;

  const [selectedYearRange, setSelectedYearRange] = useState({
    value: yearRange,
    label: yearRange,
  });



  const [acYears, setAcYears] = useState({
    acFrom: 0,
    acTo: 0,
    acYear: "",
  });
  useEffect(() => {
    let values =
      `?fromDate='${selectedYearRange.label.substr(0, 4)}-04-01'&toDate='${selectedYearRange.label.substr(5, 9)}-03-31'`

    console.log("hi",values);
    fetchMonthPurchaseparam(values, filter, true);
  }, [fetchMonthPurchaseparam, selectedYearRange])



  const loadValues = (obj) => {

    const new_values = { value: obj?.value ?? 0, label: obj?.label };

    setIsClearDropdown(false);
    setIsDropdown(false);
    setAcYears({ ...acYears, acYear: new_values });
    setErrors("");
    let values =
      `?fromDate='${new_values.label.substr(0, 4)}-04-01'&toDate='${new_values.label.substr(5, 9)}-03-31'`

    console.log(values);
    fetchMonthPurchaseparam(values, filter, true);
  };

  const itemsValue =
    monthlyPurchase?.length >= 0 &&
    monthlyPurchase.map((monthPurchase) => {
      return {

        monthYear: monthPurchase.monthYear,

        purchaseValue: monthPurchase.attributes.purchaseValue,
      };
    });


  const acFrom = useRef();
  const companyDetails = {
    companyName: companyConfig?.companyName,
    address: `${companyConfig?.attributes?.address1} , ${companyConfig?.attributes?.address2}`,
    phoneNumber: companyConfig?.attributes?.phoneNo
  };

  const reportDetails = {
    title: " Monthly Purchase Report",
    yearRange:selectedYearRange.label 
  };
  

  const loadReport = () => {
    let acFrom1 = acFrom.current.value;

    console.log(acFrom1);
  };
  const generatePurchaseReportPDF = (companyDetails, reportDetails, itemsValue) => {
    const { companyName, address, phoneNumber } = companyDetails;
    const { title, yearRange } = reportDetails;

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
    doc.text(`${title} ${yearRange}`, 10, 50); 

    doc.autoTable({
        startY: 60,
       
        head: [['Month', 'Purchase Value']],
        body: itemsValue.map(item => [item.monthYear, item.purchaseValue]),
        foot: [['Total', itemsValue.reduce((acc, curr) => acc + parseFloat(curr.purchaseValue), 0).toFixed(2)]],
        headStyles: {
            0: { halign: 'left' },
            1: { halign: 'right' }
        },
        footStyles: {
            0: { halign: 'left' },
            1: { halign: 'right' }
        },
        columnStyles: {
            0: { halign: 'left' },
            1: { halign: 'right' }
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
    const filename = `Monthly_Purchase_${dateString}_${timeString}.pdf`;

    doc.save(filename);
};

  const footers = [
    {
      name: getFormattedMessage("totalPurchase.title"),
      selector: (row) => row.totalValue,
      sortField: "totalValue",
      sortable: true,
    }
  ];

  console.log(footers)
  const totalPurchaseValue = (data) => {
    console.log("data", data)
    return new Intl.NumberFormat('en-IN', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(data.reduce((acc, curr) => acc + parseFloat(curr.purchaseValue), 0));
  };

  
  const printTable = () => {
  
  
   const printWindow=window.open('','','height=600,width=800');
   printWindow.document.write('<style>');
   printWindow.document.write('body {');
   printWindow.document.write('  margin: 0;');
   printWindow.document.write('  padding: 0;');
   printWindow.document.write('  display: flex;');
   printWindow.document.write('  justify-content: center;');
   printWindow.document.write('  align-items: center;');
   printWindow.document.write('  min-height: 100vh;'); // Ensure the body takes up at least the full height of the viewport
   printWindow.document.write('}');
   printWindow.document.write('.company-info {');
   printWindow.document.write('  text-align: center;');
   printWindow.document.write('  margin: 20px auto;');
   printWindow.document.write('  padding: 20px;');
   printWindow.document.write('  max-width: 600px;'); // Adjust the max-width as needed
   printWindow.document.write('  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);'); // Optional: Add some shadow for better visibility
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
   printWindow.document.write(`<p>${reportDetails.yearRange}</p>`);
   printWindow.document.write('</div>');

   const tableContent=document.querySelector('.table-container').outerHTML;
   printWindow.document.write('<html><head><title>Print</title>');
   printWindow.document.write('<style>');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; }');
    printWindow.document.write('th, td { border: 1px solid black; padding: 8px; text-align: left; }');
    printWindow.document.write('th { background-color: #f2f2f2; }');
    printWindow.document.write('.purchase-value { text-align: right; }');
    printWindow.document.write('@media print { .no-print { display: none; } }');
    printWindow.document.write('</style>');
    printWindow.document.write('</head><body >');
    printWindow.document.write('<h1>Monthly Purchase Report</h1>'); // Add headers or other content here
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

const generatePurchaseReportExcel = (companyDetails, reportDetails, itemsValue) => {
    const { companyName, address, phoneNumber } = companyDetails;
    const { title, yearRange } = reportDetails;
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([
        [companyName],
        [address],
        [phoneNumber],
       [],
        [`${title} ${yearRange}`],
        [],           
        ['Month', 'Purchase Value']
        
    ]);
  
     itemsValue.forEach(item => {
      XLSX.utils.sheet_add_aoa(worksheet, [[item.monthYear, item.purchaseValue]], { origin: -1 });
  });

  const totalValue = itemsValue.reduce((acc, curr) => acc + parseFloat(curr.purchaseValue), 0).toFixed(2);
  XLSX.utils.sheet_add_aoa(worksheet, [['Total', totalValue]], { origin: -1 });
  worksheet['!cols'] = [{ wch: 20 }, { wch: 15 }];

  ['A1', 'A2', 'A3', 'A5'].forEach(cell => {
    if (worksheet[cell]) {
        worksheet[cell].s = { alignment: { horizontal: "center" } };
    }
});
   
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Monthly Purchases');
    XLSX.writeFile(workbook, 'MonthlyPurchases.xlsx');
};
const exportToExcel=()=>{
  generatePurchaseReportExcel (companyDetails, reportDetails, itemsValue)
}

  const exportToPDF = () => {
   generatePurchaseReportPDF(companyDetails, reportDetails, itemsValue)
  };
  const paySlipClick=()=>{
    navigate('/app/paySlip')
  
  }


  return (
    <div className="warehouse_purchase_report_table">
      <div className="row">
        <div className="col-md-3">
          <input
            className="form-control wd-100"
            placeholder="Search" onChange={handleSearchChange} ref={searchRef} style={{ paddingLeft: '30px' }}
          />
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            style={{ marginTop: "-66px", marginLeft: "10px" }}
          />
        </div>
        <div className="col-md-1"></div>
        <div className="col-md-1">
          <h3 className="mt-3" >
            Ac Year
          </h3>
        </div>

        <div className="col-md-3">

          <InputGroup className="flex-nowrap dropdown-side-btn text-black">
            <ReactSelect
              className="position-relative"
              placeholder={placeholderText("globally.input.AcYear.label")}
              defaultValue={selectedYearRange}

              data={acYear}
              onChange={loadValues}
            />
          </InputGroup>

        </div>

        <div className="col-md-2"></div>
        <div className="col-md-2">
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
              background: "white"
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
 <button
        className="btn btn-success me-3 d-flex"
        onClick={paySlipClick}
      >
        Pay Slip
      </button>

          </button>
        
         
        </div>

      </div>

      <div className="row">

        <div className="col-md-12">
          {itemsValue.length > 0 &&


            <div className="fixTableHead">
              <table className='table-container'>
                <thead>
                  <tr >
                    <th style={{ textAlign: "left" }}>Month</th>
                    <th style={{ textAlign: "right" }}>Purchase Value</th>
                  </tr>
                </thead>



                <tbody>
                  {(itemsRecord ? filteredItems : itemsValue).map((month, index) => (
                    <tr key={index}>
                      <td >{month.monthYear}</td>
                      <td style={{textAlign:"right"}}className="purchaseValue">{new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(parseFloat(month.purchaseValue).toFixed(2))}</td>
                    </tr>
                  ))}
                </tbody>


                <tfoot>
                  <tr >
                    {footers.map((footer) => (
                      <th>{footer.name}</th>
                    ))}
                    <th style={{textAlign:"right"}}>{totalPurchaseValue(itemsRecord ? filteredItems : itemsValue)}</th>
                  </tr>
                </tfoot>
              </table>
            </div>

          }
        </div>
      </div>


    </div>
  );
};


const mapStateToProps = (state) => {
  const { isLoading, totalRecord, monthlyPurchase, frontSetting, acYear ,companyConfig} = state;
  return { isLoading, totalRecord, monthlyPurchase, frontSetting, acYear,companyConfig }
};

export default connect(mapStateToProps, { fetchFrontSetting, fetchMonthPurchase, fetchMonthPurchaseparam, fetchAcYear,fetchCompanyConfig })(MonthlyPurchaseTab);
