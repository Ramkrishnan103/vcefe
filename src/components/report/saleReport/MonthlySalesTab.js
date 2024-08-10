import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import { connect } from "react-redux";
import {
  // fetchMonthSales,
  fetchMonthSalesparam,
} from "../../../store/action/monthlySalesAction";
import { fetchFrontSetting } from "../../../store/action/frontSettingAction";
import { saleExcelAction } from "../../../store/action/salesExcelAction";
import {
  getFormattedMessage,
  placeholderText,
} from "../../../shared/sharedMethod";
import ReactDataTable from "../../../shared/table/ReactDataTable";
import { Button, Form, InputGroup } from "react-bootstrap-v5";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import ReactSelect from "../../../shared/select/reactSelect";
import { fetchAcYear } from "../../../store/action/acYearAction";
import { filter, stubString } from "lodash";
import allConfigReducer from "../../../store/reducers/allConfigReducer";
import {
  ActionOnSet,
  FONT_WEIGHT,
} from "ag-charts-community/dist/esm/es6/module-support";
import { act } from "react";
import loader from "sass-loader";
import { LinearGradient } from "ag-charts-community/dist/esm/es6/scene/gradient/linearGradient";
import { color } from "faker/lib/locales/az/commerce";
// import "./monthlySalesTab.css";
import Footer from "../../footer/Footer";
import CommonTable from "../../../shared/table/CommonTable";
// import "./assets/css/frontend.css"
import {jsPDF} from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import {fetchCompanyConfig} from "../../../store/action/companyConfigAction";

const MonthlySalesTab = (props) => {
  const {
    isLoading,
    totalRecord,
    // fetchMonthSales,
    fetchMonthSalesparam,
    // selectedYearRange,
    monthlySales,
    frontSetting,
    fetchFrontSetting,
    warehouseValue,
    saleExcelAction,
    allConfigData,
    acYear,
    fetchAcYear,
    companyConfig,fetchCompanyConfig
  } = props;
  const currencySymbol =
    frontSetting && frontSetting.value && frontSetting.value.currency_symbol;
  const [isWarehouseValue, setIsWarehouseValue] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  console.log(monthlySales)


  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterItems(query);
  };

  const filterItems = (query) => {
    if (query === '') {
      setFilteredItems(itemsValue);
      setIsFiltered(false);
    } else {
      const filtered = itemsValue.filter(item =>
        item.monthYear.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredItems(filtered);
      setIsFiltered(true);
    }
  };

  console.log("filteredItems",filteredItems)
  console.log("searchQuery",searchQuery)

  console.log(acYear);

  const searchRef = useRef();

  useEffect(() => {
    fetchFrontSetting();
  }, [warehouseValue]);

  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.focus();
    }
  }, []);

  const itemsValue =
    monthlySales?.length >= 0 &&
    monthlySales.map((monthSales) => {
      return {
        monthYear: monthSales.monthYear,
        salesValue: monthSales.attributes.salesValue,
      };
    });

  useEffect(() => {
    if (isWarehouseValue === true) {
      saleExcelAction(warehouseValue.value, setIsWarehouseValue);
    }
  }, [isWarehouseValue]);

  const footers = [
    {
      name: getFormattedMessage("totalSales.title"),
        
       selector: (row) => row.totalValue,
       sortField: "totalValue",
       sortable: true, 
    }
  ];

  console.log(footers)


  useEffect(() => {
    fetchAcYear();
    fetchCompanyConfig()
  }, []);

  const [isClearDropdown, setIsClearDropdown] = useState(true);
  const [isDropdown, setIsDropdown] = useState(true);
  const [errors, setErrors] = useState();
  const [acYears, setAcYears] = useState({
    acFrom: 0,
    acTo: 0,
    acYear: "",
  });

  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const yearRange = `${currentYear}-${nextYear}`;

  const [selectedYearRange, setSelectedYearRange] = useState({
    value: yearRange,
    label: yearRange,
  });

  const handleChange = (selectedOption) => {
    setSelectedYearRange(selectedOption);
    loadValues(selectedOption); 
  };

console.log("yearRange",yearRange)
console.log("selectedYear",selectedYearRange)

  const loadValues = (obj) => {
    

    console.log("onTaxChange obj", obj);
    const new_values = { value: obj?.value ?? 0, label: obj?.label };
    setIsClearDropdown(false);
    setIsDropdown(false);
    setAcYears({ ...acYears, acYear: new_values });
    console.log("New value => ",new_values)
    setErrors("");
    let values =
      "?fromDate='" +
      new_values.label.substr(0, 4) +
      "-04-01'" +
      "&toDate='" +
      new_values.label.substr(5, 9) +
      "-03-31'";

    console.log(values);
    fetchMonthSalesparam(values, filter, true);
  };

  useEffect(() => {
    let values =
    "?fromDate='" +
    selectedYearRange.label.substr(0, 4) +
    "-04-01'" +
    "&toDate='" +
    selectedYearRange.label.substr(5, 9) +
    "-03-31'";

  console.log(values);  
  fetchMonthSalesparam(values, filter, true);
  },[])
const totalSalesValue = (data) => {
    console.log("data",data)
    return new Intl.NumberFormat('en-IN', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(data.reduce((acc, curr) => acc + parseFloat(curr.salesValue), 0));
  };
  const companyDetails = {
    companyName: companyConfig?.companyName,
    address: `${companyConfig?.attributes?.address1} , ${companyConfig?.attributes?.address2}`,
    phoneNumber: companyConfig?.attributes?.phoneNo
  };
  const reportDetails = {
    title: " Monthly Sales Report",
    yearRange:selectedYearRange.label // 
  };
  const generateSalesReportPDF = (companyDetails, reportDetails, itemsValue) => {
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
       
        head: [['Month','Sales Value']],
        body: itemsValue.map(item => [item.monthYear, item.salesValue]),
        foot: [['Total', itemsValue.reduce((acc, curr) => acc + parseFloat(curr.salesValue), 0).toFixed(2)]],
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
    const filename = `Monthly_Sales_${dateString}_${timeString}.pdf`;

    doc.save(filename);
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
   printWindow.document.write(`<p>${reportDetails.yearRange}</p>`);
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
   printWindow.document.write('<h1>Monthly Sales Report</h1>'); // Add headers or other content here
   printWindow.document.write(tableContent);
   printWindow.document.write('</body></html>');
 
   
   printWindow.document.close();
   printWindow.focus(); 
 
  
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
       [`${reportDetails.title} (${reportDetails.yearRange})`],
        [],             
        ['Month', 'Sales Value'] 
    ]);
    
     itemsValue.forEach(item => {
      XLSX.utils.sheet_add_aoa(worksheet, [[item.monthYear, item.salesValue]], { origin: -1 });
  });
  const totalValue = itemsValue.reduce((acc, curr) => acc + parseFloat(curr.salesValue), 0).toFixed(2);
  XLSX.utils.sheet_add_aoa(worksheet, [['Total', totalValue]], { origin: -1 });

  worksheet['!cols'] = [{ wch: 20 }, { wch: 15 }];

  ['A1', 'A2', 'A3', 'A5'].forEach(cell => {
    if (worksheet[cell]) {
        worksheet[cell].s = { alignment: { horizontal: "center" } };
    }
});


    XLSX.utils.book_append_sheet(workbook, worksheet, 'Monthly Sales');
    XLSX.writeFile(workbook, 'MonthlySales.xlsx');
};
const exportToExcel=()=>{
  generateSalesReportExcel (companyDetails, reportDetails, itemsValue)
}

  const exportToPDF = () => {
   generateSalesReportPDF(companyDetails, reportDetails, itemsValue)
  };
  

  return (
    <div className="warehouse_sale_report_table">
    <div className="row">
        <div className="col-md-3">
          <input
            className="form-control wd-100"
            placeholder="Search"
            ref={searchRef}
            value={searchQuery}
            onChange={handleSearchChange}
            style={{ paddingLeft: '30px' }} 
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
              // ref={acFrom}
              defaultValue={selectedYearRange}
              data={acYear}
            onChange={handleChange}
            />
          </InputGroup>

          {/* </select> */}
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
              backgroundColor: "white",
              gap: "13px",  
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
              style={{ color: "green",paddingLeft:"10px"}}
              onClick={exportToExcel}
            ></FontAwesomeIcon>
         
            
          
            <FontAwesomeIcon
              icon={faFilePdf}
              className="fa-2x search-icon"
              style={{ color: "red" ,paddingLeft:"10px"}}
              onClick={exportToPDF}
            ></FontAwesomeIcon>

          </button>
        </div>
        
      </div>

<div className="row">

<div className="col-md-12">
       {itemsValue.length>0 && 

<div className="fixTableHead">
<table className='table-container'>
  <thead>
    <tr >
      <th style={{fontWeight:"bold",fontSize:"16px"}}>Month</th>
      <th style={{fontWeight:"bold",textAlign:"right",fontSize:"16px"}}> Sales Value</th>
    </tr>
  </thead>



  <tbody>
    {(isFiltered ? filteredItems : itemsValue).map((month, index) => (
      <tr key={index}>
        <td >{month.monthYear}</td>
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
        <th>{footer.name}</th>
      ))}
      <th style={{textAlign:'right'}} >{totalSalesValue(isFiltered ? filteredItems : itemsValue)}</th>
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
  const { isLoading, totalRecord, monthlySales, frontSetting, acYear,companyConfig} = state;
  return { isLoading, totalRecord, monthlySales, frontSetting, acYear,companyConfig };
};

export default connect(mapStateToProps, {
  fetchFrontSetting,
  saleExcelAction,
  fetchAcYear,
  fetchMonthSalesparam,
  fetchCompanyConfig
})(MonthlySalesTab);
