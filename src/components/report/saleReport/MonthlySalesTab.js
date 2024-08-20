import React, { useEffect, useRef, useState ,useCallback} from "react";
import moment from "moment";
import { Form, Modal } from "react-bootstrap-v5";
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
import { Button, InputGroup } from "react-bootstrap-v5";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import html2canvas from 'html2canvas';
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faPrint,faFileExcel, faFilePdf,faXmark  } from "@fortawesome/free-solid-svg-icons";

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
    companyConfig,fetchCompanyConfig,handleFieldClose
  } = props;
  const currencySymbol =
    frontSetting && frontSetting.value && frontSetting.value.currency_symbol;
  const [isWarehouseValue, setIsWarehouseValue] = useState(false);
  const pdfRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  console.log(monthlySales)
  const [fieldValue,setFieldValue]=useState({
    showPageSize:"",
    showPageOrientation:""
  })
  const [loadingPdf,setLoadingPdf]=useState(false)

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
  const getCurrentDateTimeInIST = () => {
    const now = new Date();
    const offset = 5.5; // IST is UTC+5:30
    const istDate = new Date(now.getTime() + offset * 3600 * 1000);
    return istDate.toISOString().replace(/T/, ' ').replace(/\..+/, '');
  };
  const generatePDF = useCallback((companyDetails, reportDetails, orientation) => {
    const { companyName, address, phoneNumber } = companyDetails;
    const { title, yearRange } = reportDetails;

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
        const imgWidth = pdfWidth - 20;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.setFontSize(14);
        pdf.text(companyName, pdfWidth / 2, 10, { align: "center" });
        pdf.setFontSize(12);
        pdf.text(address, pdfWidth / 2, 20, { align: 'center' });
        pdf.text(`Phone: ${phoneNumber}`, pdfWidth / 2, 30, { align: 'center' });
        pdf.setLineWidth(0.2);
        pdf.line(10, 42, pdfWidth - 10, 42);

        pdf.setFontSize(12);
        pdf.text(title, 10, 50);
        pdf.text(yearRange, 10, 60);

        pdf.addImage(imgData, 'PNG', 10, 70, imgWidth, imgHeight);

        const addFooter = () => {
            const pageCount = pdf.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                pdf.setPage(i);
                pdf.setFontSize(10);
                pdf.text(`Page ${i} of ${pageCount}`, pdfWidth / 2, pdfHeight - 10, { align: 'center' });
            }
        };

        addFooter();
        pdf.save(`Monthly_Sales_${getCurrentDateTimeInIST()}.pdf`);
    });
}, []);

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
  generateSalesReportExcel (companyDetails, reportDetails,itemsValue )
}

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
              onClick={handleClick}
            ></FontAwesomeIcon>

          </button>
        </div>
        
      </div>

<div className="row">

<div className="col-md-12">
       {itemsValue.length>0 && 

<div className="fixTableHead" ref={pdfRef}>
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
