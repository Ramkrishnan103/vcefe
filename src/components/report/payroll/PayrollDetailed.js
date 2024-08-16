import React, { useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint, faFileExcel, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import ReactSelect from '../../../shared/select/reactSelect';
import { InputGroup } from 'react-bootstrap';
import { ReactTabulator } from 'react-tabulator';
import 'react-tabulator/lib/styles.css'; // Import Tabulator styles
import 'tabulator-tables/dist/css/tabulator_simple.min.css'; // Import Tabulator styles
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

  const generatePDF = (companyDetails) => {
    const { companyName, address, phoneNumber } = companyDetails;
    
    const input = paySlipRef.current;
    html2canvas(input, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
     
      // Add company details
     
      // Add the image content
      const pdfWidth = 210;
      const pdfHeight = 297;
      const centerX = pdfWidth / 2;
      pdf.setFontSize(12);
      pdf.text(companyName, centerX, 10, { align: 'center' });
      pdf.setFontSize(10);
      pdf.text(address, centerX, 20, { align: 'center' });
      pdf.text(`Phone: ${phoneNumber}`,centerX, 30, { align: 'center' });

      const imgWidth = pdfWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const xOffset = 10;
      const yOffset = 40;
      pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);

      const currentDateTime = getCurrentDateTimeInIST();
      pdf.save(`PayrollDetailed_${currentDateTime}.pdf`);
    }).catch(error => {
      console.error('Error generating canvas:', error);
    });
  };

  return (
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
            <FontAwesomeIcon icon={faPrint} className="fa-2x search-icon" style={{ color: "black" }} />
            <FontAwesomeIcon icon={faFileExcel} className="fa-2x search-icon" style={{ color: "green", paddingLeft: "10px" }} />
            <FontAwesomeIcon icon={faFilePdf} className="fa-2x search-icon" style={{ color: "red", paddingLeft: "10px" }} onClick={() => generatePDF(companyDetails)} />
          </button>
        </div>
      </div>

      <div ref={paySlipRef} className="payroll-container" style={{ width: '100%', overflowX: 'auto', height: "auto", marginTop: '20px', borderRadius: "5px", border: "none" }}>
        <div className="row mt-4 mb-4">
          <div className="col-md-5">
            <h4>Payroll on April - 2024</h4>
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
  );
};

const mapStateToProps = (state) => {
  const { companyConfig } = state;
  return { companyConfig };
};

export default connect(mapStateToProps, { fetchCompanyConfig })(PayrollDetailed);
