import React, { useState,useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint, faFileExcel, faFilePdf ,faXmark} from '@fortawesome/free-solid-svg-icons';
import ReactSelect from '../../../shared/select/reactSelect';
import { InputGroup } from 'react-bootstrap';
import { ReactTabulator } from 'react-tabulator';
import 'react-tabulator/lib/styles.css'; // Import Tabulator styles
import 'tabulator-tables/dist/css/tabulator_simple.min.css'; // Import Tabulator styles
import { Form, Modal } from "react-bootstrap-v5";
import { getFormattedMessage } from "../../../shared/sharedMethod";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { fetchCompanyConfig } from "../../../store/action/companyConfigAction";
import { connect } from 'react-redux';

const PayrollDetailed = (props) => {
  const { companyConfig, fetchCompanyConfig } = props;
  const tableRef = useRef(null);
  const paySlipRef = useRef(null);

  useEffect(() => {
    fetchCompanyConfig();
  }, [fetchCompanyConfig]);
  const [fieldValue,setFieldValue]=useState({
    showPageSize:"",
    showPageOrientation:""
  })
  const [loadingPdf,setLoadingPdf]=useState(false)
  const companyDetails = {
    companyName: companyConfig?.companyName || 'Company Name',
    address: `${companyConfig?.attributes?.address1 || ''} , ${companyConfig?.attributes?.address2 || ''}`,
    phoneNumber: companyConfig?.attributes?.phoneNo || 'Phone Number'
  };

  const columns = [
    { title: "Emp ID", field: "empId", width: 110, headerSort: false },
    { title: "Emp Name", field: "empName", width: 150, headerSort: false },
    {
      title: "Earnings", hozAlign: "center",
      columns: [
        { title: "Basic Pay", field: "basicPay", hozAlign: "right", width: 90, headerSort: false },
        { title: "HRA", field: "hra", hozAlign: "right", width: 90, headerSort: false },
        { title: "Conveyance", field: "conveyance", hozAlign: "right", width: 100, headerSort: false },
        { title: "Others", field: "others", hozAlign: "right", width: 90, headerSort: false }
      ]
    },
    {
      title: "Deductions", hozAlign: "center",
      columns: [
        { title: "ESI", field: "esi", hozAlign: "right", width: 90, headerSort: false },
        { title: "PF", field: "pf", hozAlign: "right", width: 90, headerSort: false },
        { title: "LWF", field: "lwf", hozAlign: "right", width: 90, headerSort: false },
        { title: "Tax Deduc.", field: "taxDeduc", hozAlign: "right", width: 90, headerSort: false }
      ]
    },
    { title: "LOP", field: "lop", width: 110, hozAlign: "right", headerSort: false },
    { title: "Net Paid", field: "netPaid", width: 110, hozAlign: "right", headerSort: false },
  ];

  const getFooterData = (table) => {
    return [
      { empId: '', empName: 'Total', basicPay: '', hra: '', conveyance: '', others: '', netPaid: '6667' }
    ];
  };

  const getCurrentDateTimeInIST = () => {
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Kolkata',
      hour12: false
    };
    const formatter = new Intl.DateTimeFormat('en-GB', options);
    return formatter.format(new Date()).replace(/\/|,|:/g, '-');
  };

  const generatePDF = (companyDetails, orientation) => {
    const { companyName, address, phoneNumber } = companyDetails;
    const input = paySlipRef.current;
    const isLandscape = orientation === 'Landscape';
  
    html2canvas(input, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
  
      const pdf = new jsPDF({
        orientation: isLandscape ? 'landscape' : 'portrait',
        unit: 'mm',
        format: isLandscape ? [297, 210] : [210, 297],
      });
  
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const centerX = pdfWidth / 2;
  
      // Define spacing values
      const topMargin = 20; // Space from the top to the company name
      const textSpacing = 3; // Reduced spacing between lines of text
      const lineSpacing = 15; // Space between line and image
  
      // Add company details with reduced spacing
      pdf.setFontSize(12);
      pdf.text(companyName, centerX, topMargin, { align: 'center' });
      pdf.setFontSize(10);
      pdf.text(address, centerX, topMargin + textSpacing + 5, { align: 'center' });
      pdf.text(`Phone: ${phoneNumber}`, centerX, topMargin + 2 * textSpacing + 10, { align: 'center' });
  
      // Add a horizontal line below the company details
      pdf.setLineWidth(0.2);
      pdf.line(10, topMargin + 3 * textSpacing + 15, pdfWidth - 10, topMargin + 3 * textSpacing + 15); // Adjusted line position
  
      // Calculate image dimensions and position
      const imgWidth = pdfWidth - 20; // 10 mm margin on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const xOffset = 10; // Left margin
      const yOffset = topMargin + 3 * textSpacing + 20; // Adjusted position below the line
  
      // Add image content
      pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);
  
      // Save PDF
      const currentDateTime = getCurrentDateTimeInIST();
      pdf.save(`PayrollDetailed_${currentDateTime}.pdf`);
    }).catch(error => {
      console.error('Error generating canvas:', error);
    });
  };
  
  
  const exportToPDF = () => {

    generatePDF(companyDetails,fieldValue.showPageOrientation )
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
  const handlePdfClick=()=>{
    setLoadingPdf(true)
    
    }
    const handleFieldCancel=()=>{
      setLoadingPdf(false)
    }
  return (
    <>
    <div className="warehouse_purchase_report_table">
      <div className="row mb-4">
        <div className="col-md-3">
          <h4>Month</h4>
          <InputGroup className="flex-nowrap">
            <ReactSelect style={{ paddingLeft: "20px", marginLeft: "10px" }} />
          </InputGroup>
        </div>
        <div className="col-md-1"></div>
        <div className="col-md-3">
          <h4>Year</h4>
          <InputGroup className="flex-nowrap">
            <ReactSelect style={{ paddingLeft: "20px", marginLeft: "10px" }} />
          </InputGroup>
        </div>
        <div className="col-md-3"></div>
        <div className="col-md-2 d-flex flex-row justify-content-end">
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
            <FontAwesomeIcon icon={faPrint} className="fa-2x search-icon" style={{ color: "black" }} onClick={handlePdfClick} />
            <FontAwesomeIcon icon={faFileExcel} className="fa-2x search-icon" style={{ color: "green", paddingLeft: "10px" }} />
            <FontAwesomeIcon icon={faFilePdf} className="fa-2x search-icon" style={{ color: "red", paddingLeft: "10px" }} onClick={handlePdfClick} />
          </button>
        </div>
      </div>

      <div ref={paySlipRef} className="payroll-container" style={{ width: '100%', overflowX: 'auto', height: "auto", marginTop: '20px', borderRadius: "5px", border: "none" }}>
        <div className="row mt-4 mb-4">
          <div className="col-md-5">
            <h4>Payroll Detailed Report For The Month Of April - 2024</h4>
          </div>
        </div>
        <ReactTabulator
          columns={columns}
          data={[
            { empId: 1, empName: "John Doe", basicPay: 5000, hra: 2000, conveyance: 500, others: 300, esi: 100, pf: 200, lwf: 50, taxDeduc: 150, lop: 0, netPaid: 7550 },
            { empId: 2, empName: "Jane Smith", basicPay: 6000, hra: 2500, conveyance: 600, others: 400, esi: 120, pf: 240, lwf: 60, taxDeduc: 180, lop: 0, netPaid: 8260 }
          ]}
          ref={tableRef}
          options={{
            columnHeaderVertAlign: "bottom",
            layout: 'fitColumns',
            responsiveLayout: "hide",
            footerElement: `<div style='width:100%;text-align: left; padding: 10px; border: 1px solid rgb(99, 166, 77); border-radius: 5px; height: 50px; background-color: #e0f4e0; display: flex; justify-content: space-between; align-items: center;margin-top:-6px'>
              <div style='padding-left: 10px;'>Total</div>
              <div style='padding-right: 10px;'>6667</div>
            </div>`,
            footer: (table) => getFooterData(table) // Dynamic footer example
          }}
          style={{
            width: '100%',
            borderCollapse: 'collapse',
          }}
        />
      </div>
    </div>

    
    <Modal className="pdfTable"  show={loadingPdf} onHide={() => setLoadingPdf(false)} centered>
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
  const { companyConfig } = state;
  return { companyConfig };
};

export default connect(mapStateToProps, { fetchCompanyConfig })(PayrollDetailed);
