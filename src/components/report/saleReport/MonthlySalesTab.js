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
      pdf.text(yearRange, 10, topMargin + 5 * textSpacing + 30);

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
        pdf.save(`Monthly_Sales_${getCurrentDateTimeInIST()}.pdf`);
    }).catch(error => {
        console.error('Error generating canvas:', error);
    });
}, []);
const generateAndPrintPDF = useCallback((companyDetails, reportDetails, orientation) => {
  const { companyName, address, phoneNumber } = companyDetails;
  const { title, yearRange } = reportDetails;

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
    pdf.text(yearRange, 10, topMargin + 5 * textSpacing + 30);

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

        // Open the PDF in a new window and trigger the print dialog
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
              onClick={exportToPrintPDF}
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
            defaultValue={defaultPageSize}
            data={showPageSize}
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
