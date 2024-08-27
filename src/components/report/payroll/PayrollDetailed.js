import React, { useRef, useEffect, useState } from 'react';
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
import { connect, useSelector } from 'react-redux';
import { fetchSalaryDetailsReportFilter } from '../../../store/action/SalaryStructureAction';
import Select from 'react-select';
import moment from 'moment';

const PayrollDetailed = (props) => {
  const { companyConfig, fetchCompanyConfig, fetchSalaryDetailsReportFilter, payrollReportDetails } = props;
  const tableRef = useRef(null);
  const paySlipRef = useRef(null);
  const payrollReport = useSelector((state) => state.payrollReport);
  const [paySlipMonth, setPaySlipMonth] = useState();

  const now = new Date();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [preparationValue, setPreparationValue] = useState({
    year: now.getFullYear(),
    month: monthNames[now.getMonth()],
  });

  const yearOptions = Array.from({ length: 5 }, (_, i) => ({
    value: now.getFullYear() - 1 + i,
    label: now.getFullYear() - 1 + i,
  }));

  console.log("Year =>", yearOptions);

  const monthOptions = monthNames.map((month, index) => ({
    value: index + 1,
    label: month,
  }));

  const handleYearChange = (selectedOption) => {
    setPreparationValue((prev) => ({
      ...prev,
      year: selectedOption?.value,
    }));
  };

  const handleMonthChange = (selectedOption) => {
    console.log("SelectedOption", selectedOption);

    setPreparationValue((prev) => ({
      ...prev,
      month: selectedOption?.label,
    }));
  };

  useEffect(() => {
    
    const monthIndex = (moment(preparationValue?.month, 'MMMM').month() + 1) - 1;

    // Create a moment object for the first day of that month
    const monthMoment = moment().month(monthIndex);

    // Format the month to get the abbreviated name
    const monthAbbrev = monthMoment.format('MMM');

    console.log(monthAbbrev); // Outputs: Aug

    setPaySlipMonth(monthAbbrev + " " + preparationValue?.year);

    if (preparationValue?.month != "" && preparationValue?.year != "") {
      loadValues();
    }
  }, [preparationValue]);


  const yearValue = useRef();
  const monthValue = useRef();

  const loadValues = (filter) => {
    
    let year = yearOptions.find(
      (option) => option.value === preparationValue.year
    );
    let month = monthOptions.find(
      (option) => option.label === preparationValue.month
    );

    let values = `?year=${year ? year.value : ""}&month=${month ? month.value : ""
      }`;
    console.log(values);

    fetchSalaryDetailsReportFilter(values, filter, true);
  };


  // useEffect(() => {
  //   loadValues();
  // }, [preparationValue.month, preparationValue.year])


  // console.log("PayrollReport => ", payrollReportDetails)

  useEffect(() => {
    fetchCompanyConfig();
    // fetchSalaryDetailsReportFilter();
  }, [fetchCompanyConfig]);

  const companyDetails = {
    companyName: companyConfig?.companyName || 'Company Name',
    address: `${companyConfig?.attributes?.address1 || ''} , ${companyConfig?.attributes?.address2 || ''}`,
    phoneNumber: companyConfig?.attributes?.phoneNo || 'Phone Number'
  };
  const [fieldValue, setFieldValue] = useState({
    showPageSize: "",
    showPageOrientation: ""
  });
  const [loadingPdf, setLoadingPdf] = useState(false);

  const columns = [
    { title: "Emp ID", field: "empId", width: 80, headerSort: false },
    { title: "Emp Name", field: "empName", width: 110, headerSort: false },
    {
      title: "Earnings", hozAlign: "center",
      columns: [
        { title: "Basic Pay", field: "basicPay", hozAlign: "right", width: 70, headerSort: false },
        { title: "HRA", field: "hra", hozAlign: "right", width: 70, headerSort: false },
        { title: "Conveyance", field: "conveyance", hozAlign: "right", width: 80, headerSort: false },
        { title: "Others", field: "others", hozAlign: "right", width: 70, headerSort: false },
        { title: "Total Earnings", field: "others", hozAlign: "right", width: 80, headerSort: false }
      ]
    },
    {
      title: "Deductions", hozAlign: "center",
      columns: [
        { title: "ESI", field: "esi", hozAlign: "right", width: 70, headerSort: false },
        { title: "PF", field: "pf", hozAlign: "right", width: 70, headerSort: false },
        { title: "LWF", field: "lwf", hozAlign: "right", width: 70, headerSort: false },
        { title: "Tax Deduc.", field: "taxDeduc", hozAlign: "right", width: 70, headerSort: false },
        { title: "Total Deduc.", field: "totalDeduc", hozAlign: "right", width: 70, headerSort: false }
      ]
    },
    { title: "Gross Amount", field: "grossAmt", width: 80, hozAlign: "right", headerSort: false },
    { title: "LOP",hozAlign:"center",
      columns:[
        { title: "Leave Days", field: "leaveDays", hozAlign: "right", width: 70, headerSort: false },
        { title: "Loss of Pay", field: "lossOfPay", hozAlign: "right", width: 70, headerSort: false },
      ]
    },
    { title: "Net Paid", field: "netPaid", width: 80, hozAlign: "right", headerSort: false },
  ];

  const getFooterData = (table) => {
    return [
      { empId: '', empName: 'Total', basicPay: '', hra: '', conveyance: '', others: '', netPaid: payrollReport?.data?.employeeDetails?.reduce((total, item) => total + parseFloat(item?.netPaid), 0) }
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
    
    const isLandscape = orientation === 'Landscape';
    const input = paySlipRef.current;

    html2canvas(input, { scale: 1.5, useCORS: true }).then((canvas) => {
      const resizedCanvas = document.createElement('canvas');
      const resizedCtx = resizedCanvas.getContext('2d');
      resizedCanvas.width = canvas.width / 2; // Reduce the size
      resizedCanvas.height = canvas.height / 2;
      resizedCtx.drawImage(canvas, 0, 0, resizedCanvas.width, resizedCanvas.height);

      const imgData = resizedCanvas.toDataURL('image/png');
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

      const imgWidth = pdfWidth - 20;
      const imgHeight = (resizedCanvas.height * imgWidth) / resizedCanvas.width;
      const xOffset = 10;
      const yOffset = topMargin + 4 * textSpacing + 25;

      pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);

      const currentDateTime = getCurrentDateTimeInIST();
      pdf.save(`PayrollDetailed_${currentDateTime}.pdf`);
    }).catch(error => {
      console.error('Error generating canvas:', error);
    });
  };

  const generateAndPrintPDF = (companyDetails, orientation) => {
    const { companyName, address, phoneNumber } = companyDetails;

    const isLandscape = orientation === 'Landscape';
    const input = paySlipRef.current;

    html2canvas(input, { scale: 1.5, useCORS: true }).then((canvas) => {
      const resizedCanvas = document.createElement('canvas');
      const resizedCtx = resizedCanvas.getContext('2d');
      resizedCanvas.width = canvas.width / 2; // Reduce the size
      resizedCanvas.height = canvas.height / 2;
      resizedCtx.drawImage(canvas, 0, 0, resizedCanvas.width, resizedCanvas.height);

      const imgData = resizedCanvas.toDataURL('image/png');
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

      pdf.setFontSize(12);
      pdf.text(companyName, centerX, topMargin, { align: 'center' });
      pdf.setFontSize(10);
      pdf.text(address, centerX, topMargin + textSpacing + 5, { align: 'center' });
      pdf.text(`Phone: ${phoneNumber}`, centerX, topMargin + 2 * textSpacing + 10, { align: 'center' });

      pdf.setLineWidth(0.2);
      pdf.line(10, topMargin + 3 * textSpacing + 15, pdfWidth - 10, topMargin + 3 * textSpacing + 15);

      const imgWidth = pdfWidth - 20;
      const imgHeight = (resizedCanvas.height * imgWidth) / resizedCanvas.width;
      const xOffset = 10;
      const yOffset = topMargin + 4 * textSpacing + 25;

      pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);

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
  };

  const exportToPrintPDF = () => {
    generateAndPrintPDF(companyDetails, fieldValue.showPageOrientation);
  };

  const exportToPDF = () => {
    generatePDF(companyDetails, fieldValue.showPageOrientation);
  };

  const showPageOrientation = [
    { value: "Portrait", label: "Portrait" },
    { value: "Landscape", label: "Landscape" },
  ];
  
  const showPageSize = [
    { value: "A4", label: "A4" },
  ];
  const defaultPageOrientation = showPageOrientation.find(option => option.value === 'Portrait');
  const defaultPageSize = showPageSize.find(option => option.value === 'A4');

  const closeButtonClick = () => {
    setLoadingPdf(false);
  };
  const handleFieldChange = (field) => (selectedOption) => {
    setFieldValue((prevValues) => ({
      ...prevValues,
      [field]: selectedOption ? selectedOption.value : ""
    }));
  };

  const itemsValue =
    payrollReport &&
    payrollReport?.data?.employeeDetails?.map((payroll) => {
      return {
        empId: payroll?.empId,
        empName: payroll?.empName,
        basicPay: parseFloat(payroll?.basicPay).toFixed(2) || payroll?.basicPay,
        hra: parseFloat(payroll?.hra).toFixed(2) || payroll?.hra,
        conveyance: parseFloat(payroll?.conveyaences).toFixed(2) || payroll?.conveyaences,
        others: parseFloat(payroll?.others).toFixed(2) || payroll?.others,
        totalEarnings:"",
        esi: parseFloat(payroll?.employeeEsi).toFixed(2) || payroll?.employeeEsi,
        pf: parseFloat(payroll?.employeePf).toFixed(2) || payroll?.employeePf,
        lwf: parseFloat(payroll?.lwf).toFixed(2) || payroll?.lwf,
        taxDeduc: parseFloat(payroll?.taxDeductions).toFixed(2) || payroll?.taxDeductions,
        totalDeduc:"",
        grossAmt:"",
        lop: parseFloat(payroll?.lop).toFixed(2) || payroll?.lop,
        netPaid: parseFloat(payroll?.netPaid).toFixed(2)
      };
    });
  console.log(itemsValue);

  const handlePdfClick = () => {
    setLoadingPdf(true);
  };

  const handleFieldCancel = () => {
    setLoadingPdf(false);
  };

  return (
    <>
    <div className="warehouse_purchase_report_table">
      <div className="row mb-4">
        <div className="col-md-3">
          <h4>Month</h4>
          {/* <InputGroup className="flex-nowrap"> */}
            <Select
              options={monthOptions}
              className='flex-nowrap'
              // value={formValues.designation}
              value={monthOptions.find(
                (option) => option.label === preparationValue.month
              )}
              onChange={(selectedOption) => {
                handleMonthChange(selectedOption);
              }}
            />
          {/* </InputGroup> */}
        </div>
        <div className="col-md-1"></div>
        <div className="col-md-3">
          <h4>Year</h4>
          {/* <InputGroup className="flex-nowrap"> */}
            {/* <ReactSelect style={{ paddingLeft: "20px", marginLeft: "10px" }}
              data={yearOptions}
              ref={yearValue}
              value={yearOptions.find(
                (option) => option.value === preparationValue.year
              )}
              onChange={() => handleYearChange()}
            /> */}
            <Select
              options={yearOptions}
              className='flex-nowrap'
              // value={formValues.designation}
              value={yearOptions.find(
                (option) => option.value === preparationValue.year
              )}
              onChange={(selectedOption) => {
                handleYearChange(selectedOption);
              }}
            />
          {/* </InputGroup> */}
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
            <FontAwesomeIcon icon={faPrint} className="fa-2x search-icon" style={{ color: "black" }} onClick={exportToPrintPDF} />
            <FontAwesomeIcon icon={faFileExcel} className="fa-2x search-icon" style={{ color: "green", paddingLeft: "10px" }} />
            <FontAwesomeIcon icon={faFilePdf} className="fa-2x search-icon" style={{ color: "red", paddingLeft: "10px" }} onClick={handlePdfClick}  />
          </button>
        </div>
      </div>

      <div ref={paySlipRef} className="payroll-container" style={{ width: '100%', overflowX: 'auto', height: "auto", marginTop: '20px', borderRadius: "5px", border: "none" }}>
        <div className="row mt-4 mb-4">
          <div className="col-md-5">
            <h4>Payroll on {paySlipMonth}</h4>
          </div>
        </div>
        <ReactTabulator
          columns={columns}
          data={itemsValue || []}
          ref={tableRef}
          options={{
            columnHeaderVertAlign: "bottom",
            layout: 'fitColumns',
            responsiveLayout: "hide",
            placeholder: "No records found",
            footerElement: `<div style='width:100%;text-align: left; padding: 10px; border: 1px solid rgb(99, 166, 77); border-radius: 5px; height: 50px; background-color: #e0f4e0; display: flex; justify-content: space-between; align-items: center;margin-top:-6px'>
              <div style='padding-left: 10px;'>Total</div>
              <div style='padding-right: 10px;'>${parseFloat(payrollReport?.data?.employeeDetails?.reduce((a, b) => a + b.netPaid, 0)).toFixed(2)}</div>
            </div>`,
            footer: (table) => getFooterData(table), // Dynamic footer example
            initialSort: [
              { column: "empId", dir: "asc" }  // Default sort on empName in ascending order
            ]
          }}
          style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}
        />
      </div>
    </div>
    </>
  );
};

const mapStateToProps = (state) => {
  const { companyConfig, payrollReportDetails } = state;
  return { companyConfig, payrollReportDetails };
};

export default connect(mapStateToProps, { fetchCompanyConfig, fetchSalaryDetailsReportFilter })(PayrollDetailed);
