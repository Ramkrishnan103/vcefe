import React, { useEffect, useState, useRef, useCallback } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { Form, Modal } from "react-bootstrap-v5";
import {
  getFormattedMessage,
  placeholderText,
} from "../../../shared/sharedMethod";
import { connect } from 'react-redux';
import { fetchMonthPurchase, fetchMonthPurchaseparam } from '../../../store/action/monthlyPurchaseAction';
import { fetchFrontSetting } from '../../../store/action/frontSettingAction';
import { fetchAcYear } from '../../../store/action/acYearAction';
import { fetchCompanyConfig } from '../../../store/action/companyConfigAction';
import { InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint, faFileExcel, faFilePdf, faMagnifyingGlass,faXmark } from '@fortawesome/free-solid-svg-icons';
import ReactSelect from '../../../shared/select/reactSelect';
import { useNavigate } from "react-router";
import { ReactTabulator } from 'react-tabulator';
import 'react-tabulator/lib/styles.css'; // Import Tabulator styles
import 'tabulator-tables/dist/css/tabulator_simple.min.css'; // Import Tabulator styles
import { filter } from "lodash";

const MonthlyPurchaseTab = ({
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
  fetchAcYear,
  companyConfig,
  fetchCompanyConfig
}) => {
  const navigate = useNavigate();
  const searchRef = useRef();
  const pdfRef = useRef(null);
  const [fieldValue,setFieldValue]=useState({
    showPageSize:"",
    showPageOrientation:""
  })
  const [loadingPdf,setLoadingPdf]=useState(false)

  const [isClearDropdown, setIsClearDropdown] = useState(true);
  const [isDropdown, setIsDropdown] = useState(true);
  const [errors, setErrors] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [itemsRecord, setItemsRecord] = useState(false);
  const [selectedYearRange, setSelectedYearRange] = useState({
    value: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
    label: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
  });
  const [acYears, setAcYears] = useState({
    acFrom: 0,
    acTo: 0,
    acYear: "",
  });
  const columns=[
    {title:"Month",field:"month",headerSort:false},
    {title:"Purchase value",field:"purchaseValue",headerSort:false,hozAlign:"right",headerHozAlign:"right"}
  ]
  

  const itemsValue = monthlyPurchase?.length > 0 ? monthlyPurchase.map((monthPurchase) => ({
    month: monthPurchase.monthYear,
    purchaseValue: monthPurchase.attributes.purchaseValue,
  })) : [];

  const companyDetails = {
    companyName: companyConfig?.companyName || '',
    address: `${companyConfig?.attributes?.address1 || ''}, ${companyConfig?.attributes?.address2 || ''}`,
    phoneNumber: companyConfig?.attributes?.phoneNo || ''
  }; 

  const reportDetails = {
    title: "Monthly Purchase Report",
    yearRange: selectedYearRange.label
  };
  const getCurrentDateTimeInIST = () => {
    const now = new Date();
    const offset = 5.5; // IST is UTC+5:30
    const istDate = new Date(now.getTime() + offset * 3600 * 1000);
    return istDate.toISOString().replace(/T/, ' ').replace(/\..+/, '');
  };

  useEffect(() => {
    fetchFrontSetting();
    fetchAcYear();
    fetchCompanyConfig();
  }, [fetchFrontSetting, fetchAcYear, fetchCompanyConfig]);

  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const values = `?fromDate='${selectedYearRange.label.substr(0, 4)}-04-01'&toDate='${selectedYearRange.label.substr(5, 9)}-03-31'`;
    fetchMonthPurchaseparam(values, filter, true);
  }, [fetchMonthPurchaseparam, selectedYearRange]);
  const filterItems = useCallback((query) => {
    if (query === '') {
      setFilteredItems(itemsValue);
      setItemsRecord(false);
    } else {
      const filtered = itemsValue.filter(item =>
        item.monthYear.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredItems(filtered);
      setItemsRecord(true);
    }
  }, [itemsValue]);
  const handleSearchChange = useCallback((e) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterItems(query);
  }, [filterItems]);

  

  const loadValues = (obj) => {
    const newValues = { value: obj?.value ?? 0, label: obj?.label };
    setIsClearDropdown(false);
    setIsDropdown(false);
    setAcYears({ ...acYears, acYear: newValues });
    setErrors("");
    let values = `?fromDate='${newValues.label.substr(0, 4)}-04-01'&toDate='${newValues.label.substr(5, 9)}-03-31'`;
    fetchMonthPurchaseparam(values, filter, true);
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
  const totalPurchaseValue = (items) => {
    return items.reduce((total, item) => total + parseFloat(item.purchaseValue || 0), 0).toFixed(2);
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
        pdf.save(`Monthly_Purchase_${getCurrentDateTimeInIST()}.pdf`);
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


  const generatePurchaseReportExcel = useCallback((companyDetails, reportDetails, itemsValue) => {
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
  }, []);

  const exportToPDF = () => {

    generatePDF(companyDetails, reportDetails,fieldValue.showPageOrientation )
  };
  const exportToPrintPDF = () => {

    generateAndPrintPDF(companyDetails, reportDetails,fieldValue.showPageOrientation )
  };

  const exportToExcel = () => generatePurchaseReportExcel(companyDetails, reportDetails, itemsValue);

  
  return (
    <>
    <div className="warehouse_purchase_report_table">
      <div className="row">
        <div className="col-md-3">
          <input
            className="form-control wd-100"
            placeholder="Search"
            onChange={handleSearchChange}
            ref={searchRef}
            style={{ paddingLeft: '30px' }}
          />
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            style={{ marginTop: "-66px", marginLeft: "10px" }}
          />
        </div>
        <div className="col-md-1"></div>
        <div className="col-md-1">
          <h3 className="mt-3">Ac Year</h3>
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
              onClick={exportToPrintPDF}
            />
            <FontAwesomeIcon
              icon={faFileExcel}
              className="fa-2x search-icon"
              style={{ color: "green", paddingLeft: "10px" }}
              onClick={exportToExcel}
            />
            <FontAwesomeIcon
              icon={faFilePdf}
              className="fa-2x search-icon"
              style={{ color: "red", paddingLeft: "10px" }}
              onClick={handleClick}
            />
            
          </button>
        </div>
      </div>

     
          {itemsValue.length > 0 && (
           
<ReactTabulator ref={pdfRef}
columns={columns}
data={itemsRecord? filteredItems : itemsValue}
options={{
  columnHeaderVertAlign: "bottom",
  layout: 'fitColumns',
  responsiveLayout: "hide",
  placeholder: "No records found",
  footerElement: `<div style='width:100%;text-align: left; padding: 10px; border: 1px solid rgb(99, 166, 77); border-radius: 5px; height: 50px; background-color: #e0f4e0; display: flex; justify-content: space-between; align-items: center;margin-top:-6px'>
    <div style='padding-left: 10px;'>Total</div>
    <div style='padding-right: 10px;'>{totalPurchaseValue(itemsRecord ? filteredItems : itemsValue)}</div>
  </div>`,
  footer: (table) => getFooterData(table), // Dynamic footer example
  initialSort: [
    { columns: "month", dir: "asc" }  // Default sort on empName in ascending order
  ]
}}
style={{
  width: '100%',
  borderCollapse: 'collapse'
}}
/>
          )}
       
    </div>
    <Modal className="pdfTable" show={loadingPdf} onHide={() => setLoadingPdf(false)} centered>
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
  const { isLoading, totalRecord, monthlyPurchase, frontSetting, acYear, companyConfig } = state;
  return { isLoading, totalRecord, monthlyPurchase, frontSetting, acYear, companyConfig };
};

export default connect(mapStateToProps, { fetchFrontSetting, fetchMonthPurchase, fetchMonthPurchaseparam, fetchAcYear, fetchCompanyConfig })(MonthlyPurchaseTab);
