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

  const itemsValue = monthlyPurchase?.length > 0 ? monthlyPurchase.map((monthPurchase) => ({
    monthYear: monthPurchase.monthYear,
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

  const totalPurchaseValue = (items) => {
    return items.reduce((total, item) => total + parseFloat(item.purchaseValue || 0), 0).toFixed(2);
  };

  const generatePDF = useCallback((companyDetails, reportDetails,orientation) => {
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
      const pdf = new jsPDF({  orientation: isLandscape ? 'landscape' : 'portrait',
        unit: 'mm',
        format: isLandscape ? [297, 210] : [210, 297] });
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
      pdf.text(yearRange, 10, 60);

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
      pdf.save(`Monthly_Purchase_${getCurrentDateTimeInIST()}.pdf`);
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

  const exportToExcel = () => generatePurchaseReportExcel(companyDetails, reportDetails, itemsValue);

  const printTable = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<style>');
    printWindow.document.write('body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }');
    printWindow.document.write('.company-info { text-align: center; margin: 20px auto; padding: 20px; max-width: 600px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }');
    printWindow.document.write('</style>');

    printWindow.document.write('<div class="company-info">');
    printWindow.document.write(`<h2>${companyDetails.companyName}</h2>`);
    printWindow.document.write(`<p>${companyDetails.address}</p>`);
    printWindow.document.write(`<p>${companyDetails.phoneNumber}</p>`);
    printWindow.document.write('</div>');
    printWindow.document.write('<hr>');

    printWindow.document.write('<div class="report-info">');
    printWindow.document.write(`<h3>${reportDetails.title}</h3>`);
    printWindow.document.write(`<p>${reportDetails.yearRange}</p>`);
    printWindow.document.write('</div>');

    const tableContent = document.querySelector('.table-container').outerHTML;
    printWindow.document.write('<html><head><title>Print</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; }');
    printWindow.document.write('th, td { border: 1px solid black; padding: 8px; text-align: left; }');
    printWindow.document.write('th { background-color: #f2f2f2; }');
    printWindow.document.write('.purchase-value { text-align: right; }');
    printWindow.document.write('@media print { .no-print { display: none; } }');
    printWindow.document.write('</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write('<h1>Monthly Purchase Report</h1>');
    printWindow.document.write(tableContent);
    printWindow.document.write('</body></html>');

    printWindow.document.close();
    printWindow.focus();
    printWindow.onload = () => printWindow.print();
  };

  const paySlipClick = () => navigate('/app/paySlip');

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
              onClick={printTable}
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
          {itemsValue.length > 0 && (
            <div className="fixTableHead" ref={pdfRef}>
              <table className='table-container'>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left" }}>Month</th>
                    <th style={{ textAlign: "right" }}>Purchase Value</th>
                  </tr>
                </thead>
                <tbody>
                  {(itemsRecord ? filteredItems : itemsValue).map((month, index) => (
                    <tr key={index}>
                      <td>{month.monthYear}</td>
                      <td style={{ textAlign: "right" }} className="purchaseValue">
                        {new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(parseFloat(month.purchaseValue).toFixed(2))}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th>Total</th>
                    <th style={{ textAlign: "right" }}>
                      {totalPurchaseValue(itemsRecord ? filteredItems : itemsValue)}
                    </th>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
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
  const { isLoading, totalRecord, monthlyPurchase, frontSetting, acYear, companyConfig } = state;
  return { isLoading, totalRecord, monthlyPurchase, frontSetting, acYear, companyConfig };
};

export default connect(mapStateToProps, { fetchFrontSetting, fetchMonthPurchase, fetchMonthPurchaseparam, fetchAcYear, fetchCompanyConfig })(MonthlyPurchaseTab);
