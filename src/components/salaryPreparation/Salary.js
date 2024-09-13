import { connect, useSelector } from "react-redux";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import MasterLayout from "../MasterLayout";
import { useEffect, useState, useRef } from "react";
import TabTitle from "../../shared/tab-title/TabTitle";
import {
  getFormattedMessage,
  placeholderText,
} from "../../shared/sharedMethod";
import ReactDataTable from "../../shared/table/ReactDataTable";
import ActionButton from "../../shared/action-buttons/ActionButton";
import { faDownload, faFileDownload, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Container } from "react-bootstrap-v5";
import {
  deleteSalaryDetails,
  fetchSalaryDetails,
  fetchSalaryDetailsFilter,
  fetchSalaryDetailsReportFilter
} from "../../store/action/SalaryStructureAction";
import SalaryPreparation from "./SalaryPreparation";
import { fetchSalary } from "../../store/action/salaryAction";
import { useNavigate } from "react-router";
import SalaryPreparationListPage from "./SalaryPreparationListPage";
import { filter } from "lodash";
import moment from "moment";
import { addToast } from "../../store/action/toastAction";
import DeleteModel from "../../shared/action-buttons/DeleteModel";
import Modal from 'react-bootstrap/Modal';
import Loader from '../loader/Loader';
import { Col, Row } from "react-bootstrap";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { fetchCompanyConfig } from '../../store/action/companyConfigAction';

const formatCurrency = (value) => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Function to get current date and time in IST
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
  return formatter.format(new Date()).replace(/\/|,|:/g, '-'); // Format to `dd-MM-yyyy-HH-mm-ss`
};

const Salary = (props) => {
  const {
    salaryDetail,
    isLoading,
    fetchSalaryDetails,
    // salary,
    fetchSalary,
    fetchSalaryDetailsFilter,
    fetchSalaryDetailsReportFilter,
    deleteSalaryDetails,
    fetchCompanyConfig
  } = props;
  const [importEmpDeaprtment, setimportEmpDeaprtment] = useState(false);
  console.log("Salary Details  =>", salaryDetail);
  const [editModel, setEditModel] = useState(false);
  const [viewModel, setViewModel] = useState(false);
  const salary = useSelector(state => state.salaryDetail);
  const [salarydetails, setSalarydetails] = useState();
  const [deleteModel, setDeleteModel] = useState(false);
  const [isDelete, setIsDelete] = useState(null);
  const [itemsValue, setItemsValue] = useState();
  const details = useSelector((state) => state.salaryListingall);
  const report = useSelector((state) => state.payrollReport);
  const company = useSelector((state) => state.companyConfig);
  const [filterSalaryDetails, setFilterSalaryDetails] = useState([]);
  const [reportfilterSalaryDetails, setReportFilterSalaryDetails] = useState([]);
  const [paySlipEmployees, setPaySlipEmployees] = useState([]);
  const [paySlipshow, setPaySlipshow] = useState(false);
  const [paySlipMonth, setPaySlipMonth] = useState();
  const paySlipRef = useRef(null);
  const [show, setShow] = useState(false);
  const [print, setPrint] = useState(true);
  const [payEmp, setPayEmp] = useState({});
  const handleCloseCreate = () => setShow(!show);
  const [delMonth, setDelMonth] = useState();
  const [reportDetail, setReportDetail] = useState({
    year: "",
    month: ""
  });

  const [formcode, setFormCode] = useState("HR02");
  
  const navigate = useNavigate();
  useEffect(() => {
    debugger;
    const storedFormData = localStorage.getItem("UserFormCode");

    if (storedFormData) {
      const parsedFormData = JSON.parse(storedFormData);

      console.log("Parsed Form Data:", parsedFormData);
      if (parsedFormData.length > 0) {
        const formCodeItems = parsedFormData.filter((item) => item?.attributes?.formCode == formcode && item?.attributes?.visibility );
        console.log("Form Code Items:", formCodeItems);
        if(!formCodeItems.length > 0){
            navigate("/app/dashboard");
        }
      } else {
        navigate("/app/dashboard");
      }
    }
  }, []); 

  useEffect(() => {
    setSalarydetails(salaryDetail);
    setFilterSalaryDetails(salaryDetail);
  }, [salaryDetail]);

  useEffect(() => {
    fetchCompanyConfig();
  }, []);

  useEffect(() => {
    console.log("Report =>", report);
    console.log("Company =>", company);
  }, [report, company]);

  const handleSalaryEdit = (item) => {
    setViewModel(!viewModel);
    setSalarydetails(item);
    console.log("Item =>", item);
    // navigate("/app/salaryPreparationListPage", { state: { item } });
    let values = `?year=${item ? item?.year : ""}&month=${item ? moment(item?.month, 'MMMM').month() + 1 : ""
      }&groupBy=''`;
    fetchSalaryDetailsFilter(values, filter, true, "edit");
  };

  useEffect(() => {
    fetchSalary();
  }, []);

  const handleSalaryView = (salaryId) => {
    let dates = salaryId.split('-');
    let values = `?year=${dates ? dates[1] : ""}&month=${dates ? dates[0] : ""}&groupBy=''`;
    fetchSalaryDetailsFilter(values, filter, true, "view");
  };

  const onClickDeleteModel = (item) => {
    debugger
    console.log(item);
    setDelMonth('salary details for ' + item?.month + " " + item?.year);
    setDeleteModel(!deleteModel);
    setSalarydetails(item);
    setIsDelete(item)
    console.log("Item =>", item);
    // console.log("Salary Txno :",item?.salaryTxNo)
  };

  const onPrintModal = (item) => {
    console.log("Print data :", item);
    setReportDetail({
      year: item?.year,
      month: moment(item?.month, 'MMMM').month() + 1
    });
    setPrint(false);
    let values = `?year=${item?.year}&month=${item ? moment(item?.month, 'MMMM').month() + 1 : ""}&groupBy=''`;
    // fetchSalaryDetailsFilter(values, filter, true, "print");
    fetchSalaryDetailsReportFilter(values, filter, true, "print");
    setPaySlipshow(true);
  };

  useEffect(() => {
    console.log("reportDetails", reportDetail);
    const monthIndex = reportDetail?.month - 1;

    // Create a moment object for the first day of that month
    const monthMoment = moment().month(monthIndex);

    // Format the month to get the abbreviated name
    const monthAbbrev = monthMoment.format('MMM');

    console.log(monthAbbrev); // Outputs: Aug

    setPaySlipMonth(monthAbbrev + " " + reportDetail?.year);

  }, [reportDetail]);

  useEffect(() => {
    fetchSalaryDetails();
    fetchSalary();
  }, []);

  const handleSearchData = (e) => {
    debugger
    const { name, value } = e.target;
    console.log("hi name", name);
    console.log("hi value", value);
    console.log("hi", itemsValue)
    const filtered_salaryDetails = itemsValue.filter((item) => item?.month?.toLowerCase()?.includes(value?.toLowerCase()) || (item?.year).toString().toLowerCase()?.includes(value?.toLowerCase()));
    console.log("filtered_salaryDetails", filtered_salaryDetails);
    setFilterSalaryDetails(filtered_salaryDetails);
  };

  const handleSearchData1 = (e) => {
    debugger
    const { name, value } = e.target;
    console.log("hi name", name);
    console.log("hi value", value);
    console.log("hi", itemsValue)
    const filtered_salaryDetails = report?.data?.employeeDetails?.filter((item) => item?.empName?.toLowerCase()?.includes(value?.toLowerCase()) || (item?.empId).toString().toLowerCase()?.includes(value?.toLowerCase()));
    console.log("filtered_salaryDetails", filtered_salaryDetails);
    setReportFilterSalaryDetails(filtered_salaryDetails);
  };

  useEffect(() => {
    const items = salaryDetail
      ? salaryDetail?.data?.map((salarydetails, ind) => ({
        id: salarydetails?.attributes?.salaryMonth + '-' + salarydetails?.attributes?.salaryYear,
        year: salarydetails?.attributes?.salaryYear || [],
        month:
          moment()
            .month(salarydetails?.attributes?.salaryMonth - 1)
            .format("MMMM") || [],
        totalEarnings: parseFloat(salarydetails?.attributes?.totalEarnings).toFixed(2),
        deductions: parseFloat(salarydetails?.attributes?.deductions).toFixed(2),
        netPaid: parseFloat(salarydetails?.attributes?.netPaid).toFixed(2),
        txNo: salarydetails?.attributes?.salaryTxNo,
        status: salarydetails?.attributes?.status
      }))
      : [];
    setItemsValue(items);
  }, [salaryDetail]);


  useEffect(() => {
    debugger
    itemsValue?.filter(item => item.status === 1).forEach(item => {
      const buttons = document.querySelectorAll(`#cell-6-${item.id} button`);
      buttons.forEach((btn, ind) => {
        if (ind === 1 || ind === 2) {
          btn.style.display = 'none';
        }
      });
    });
    let data = itemsValue?.sort((a, b) => {
      // Compare years
      if (a.year !== b.year) {
        return a.year - b.year;
      }

      // If years are the same, compare months
      return monthToNumber(a.month) - monthToNumber(b.month);
    });
    // setItemsValue(data);
  }, [itemsValue]);

  const monthToNumber = (month) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return months.indexOf(month) + 1;
  };

  //setViewItems(itemsValue)
  const columns = [
    {
      name: getFormattedMessage("Year.title"),
      selector: (row) => row.year,
      sortField: "year",
      sortable: true,
    },
    {
      name: getFormattedMessage("month.title"),
      selector: (row) => row.month,
      sortField: "month",
      sortable: true,
    },
    {
      name: getFormattedMessage("totalEarnings.title"),
      selector: (row) => row.totalEarnings,
      sortField: "totalEarnings",
      sortable: true,
    },
    {
      name: getFormattedMessage("totalDeduction.title"),
      selector: (row) => row.deductions,
      sortField: "deductions",
      sortable: true,
    },
    {
      name: getFormattedMessage("netPaidAmount.title"),
      // selector: (row) => row.netPaid,
      sortField: "netPaid",
      sortable: true,
      // right: true,
      cell: (row) => (<div style={{ textAlign: "right" }}>{row.netPaid}</div>)
    },
    {
      name: getFormattedMessage("react-data-table.action.column.label"),
      right: true,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      cell: (row) => (
        <ActionButton
          item={row}
          isViewIcon={true}
          goToDetailScreen={handleSalaryView}
          goToEditProduct={handleSalaryEdit}
          isEditMode={true}
          isPrint={true}
          onClickDeleteModel={onClickDeleteModel}
          onPrintModal={onPrintModal}
        />
      ),
    },
  ];

  const onClick = () => {
    setShow(true);
  };


  const monthNameToNumber = (monthName) => {
    const monthMap = {
      "January": 1,
      "February": 2,
      "March": 3,
      "April": 4,
      "May": 5,
      "June": 6,
      "July": 7,
      "August": 8,
      "September": 9,
      "October": 10,
      "November": 11,
      "December": 12
    };
    return monthMap[monthName];
  };

  // Usage


  const deleteSalaryClick = () => {

    const monthNumber = monthNameToNumber(isDelete?.month);
    let deleteSalary = {
      txNo: isDelete?.txNo,
      txnDate: moment(new Date()).format("YYYY-MM-DD"),
      salaryMonth: monthNumber,
      salaryYear: isDelete?.year,
      totalDays: 31,
      updatedAt: 1,
      remarks: "",
      salaryDetails2: [],
      xMode: "d"
    }
    deleteSalaryDetails(deleteSalary, navigate)
    onClickDeleteModel(false);
  };

  const handleClose = () => {
    debugger
    setPaySlipshow(false);
    setPrint(true);
  }

  const convertNumberToWords = (num) => {
    const singleDigits = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const twoDigits = ['', 'Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

    let numToString = num?.toString().replace(/,/g, ''); // Remove commas
    let [integerPart, decimalPart] = numToString?.split('.');

    let words = '';

    // Convert number less than 1000 to words
    const convertBelowThousand = (n) => {
      let word = '';
      if (n > 99) {
        word += singleDigits[Math.floor(n / 100)] + ' Hundred ';
        n = n % 100;
      }
      if (n > 10 && n < 20) {
        word += teens[n - 11];
      } else {
        word += twoDigits[Math.floor(n / 10)];
        if (n % 10) {
          word += '-' + singleDigits[n % 10];
        }
      }
      return word.trim();
    }

    // Convert the integer part
    if (parseInt(integerPart, 10) > 0) {
      let len = integerPart?.length;
      if (len <= 3) {
        words = convertBelowThousand(parseInt(integerPart, 10));
      } else {
        let thousandPart = integerPart?.substring(0, len - 3);
        let hundredPart = integerPart?.substring(len - 3);
        words = convertBelowThousand(parseInt(thousandPart, 10)) + ' Thousand ';
        words += convertBelowThousand(parseInt(hundredPart, 10));
      }
    }

    // Convert the decimal part
    if (decimalPart && parseInt(decimalPart, 10) > 0) {
      words += ' and ' + convertBelowThousand(parseInt(decimalPart, 10)) + ' Paise';
    }

    words += ' Only';
    return words.trim();
  }

  const generate = (data) => {
    data["finalDeduction"] = (data?.totalDeduction + data?.lop);
    console.log("data", data);
    const words = convertNumberToWords(data?.netPaid ? parseFloat(data?.netPaid).toFixed(2) : 0);
    console.log("words", words);
    data["words"] = words;
    console.log(report)
    setPayEmp(data);
    // generatePDF();
  };

  useEffect(() => {
    if (payEmp?.empId) {
      generatePDF();
      setPayEmp({});
    }
  }, [payEmp]);

  const generatePDF = () => {
    debugger
    const input = paySlipRef.current;
    html2canvas(input, { scale: 2, useCORS: true }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Calculate image dimensions for A4
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = 297; // A4 height in mm
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      const currentDateTime = getCurrentDateTimeInIST();
      pdf.save(`PaySlip_${payEmp?.empId+ '_'+ payEmp?.empName+'_'+paySlipMonth.split(" ")[0]+'_'+paySlipMonth.split(" ")[1]}.pdf`);
    }).catch(error => {
      console.error('Error generating canvas:', error);
    });
  };

  return (
    <>
      <Loader />
      <MasterLayout>
        <TopProgressBar />
        <TabTitle title={placeholderText("salary.title")} />

        <div>
          <h3 className="text-light" style={{ fontWeight: "bold" }}>
            Listing Of Salaries
          </h3>
        </div>

        <div className="row">
          <div className="col-md-5 mb-3 searchBox">
            <div className="position-relative d-flex width-320">
              <input
                className="form-control ps-8"
                type="search"
                name="searchData"
                id="search"
                placeholder={placeholderText(
                  "react-data-table.searchbar.placeholder"
                )}
                aria-label="Search"
                onChange={(e) => handleSearchData(e)}
                autoComplete="off"
              />
              <span className="position-absolute d-flex align-items-center top-0 bottom-0 left-0 text-gray-600 ms-3">
                <FontAwesomeIcon icon={faSearch} />
              </span>
            </div>
          </div>

          <div className="col-md-4"></div>
          <div className="col-md-3  d-flex justify-content-end">
            <Button
              type="button"
              variant="primary"
              className="crt_product"
              onClick={onClick}
            >
              Prepare New
            </Button>
          </div>
        </div>

        <div className="payroll-table">
          <ReactDataTable
            columns={columns}
            items={itemsValue ? (filterSalaryDetails?.length > 0 ? filterSalaryDetails?.sort((a, b) => {
              // Compare years
              if (a.year !== b.year) {
                return a.year - b.year;
              }

              // If years are the same, compare months
              return monthToNumber(a.month) - monthToNumber(b.month);
            }) : itemsValue?.sort((a, b) => {
              // Compare years
              if (a.year !== b.year) {
                return a.year - b.year;
              }

              // If years are the same, compare months
              return monthToNumber(a.month) - monthToNumber(b.month);
            })) : []}
            isLoading={isLoading}
            totalRows={itemsValue?.length}
            isUnitFilter
            subHeader={false}
          />
        </div>

        {show ? (
          <SalaryPreparation
            show={show}
            handleClose={handleCloseCreate}
            title={getFormattedMessage("SalaryPreparation.title")}
            salaryDetail={salaryDetail}
          />
        ) : (
          ""
        )}

        {deleteModel && <DeleteModel onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel}
          deleteUserClick={deleteSalaryClick}
          title={getFormattedMessage(delMonth)}
          name={getFormattedMessage(delMonth)} 
          payroll = {true}/>}



        {/* {editModel && <SalaryPreparationListPage singleSalaryPreparation={itemsValue} />} */}
      </MasterLayout>
      <Modal
        size="lg"
        show={paySlipshow}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header className="row" closeButton>
          <Modal.Title className="col-6">
            <h1>Payslip Print - {paySlipMonth}</h1>
          </Modal.Title>
          <div className="col-4 mt-2">
            <div className="col-md-5 mb-3 searchBox">
              <div className="position-relative d-flex width-320">
                <input
                  className="form-control ps-8"
                  type="search"
                  name="searchData"
                  id="search"
                  placeholder={placeholderText(
                    "Search Emp Id or Name"
                  )}
                  aria-label="Search"
                  onChange={(e) => handleSearchData1(e)}
                />
                <span className="position-absolute d-flex align-items-center top-0 bottom-0 left-0 text-gray-600 ms-3">
                  <FontAwesomeIcon icon={faSearch} />
                </span>
              </div>
            </div>
          </div>
        </Modal.Header>
        <Modal.Body>
          <Container className="px-19" style={{ height: '400px', overflow: 'auto'}}>
            {reportfilterSalaryDetails?.length > 0 ? reportfilterSalaryDetails?.map((item, index) => {
              return (
                <Row className="mb-4">
                  <Col xs={12} md={6}>
                    {item.empName}
                  </Col>
                  <Col xs={12} md={6}>
                    <Button style={{
                      background: '#65D269',
                      border: 'none',
                      borderRadius: '14px',
                      color: 'black'
                    }} onClick={() => generate(item)}>Pay Slip <span><FontAwesomeIcon icon={faFileDownload} style={{ color: 'white', height: '20px' }} /></span></Button>
                  </Col>
                </Row>
              );
            }) 
            : report && report?.data?.employeeDetails?.map((item, index) => {
              return (
                <Row className="mb-4">
                  <Col xs={12} md={6}>
                    {item.empName}
                  </Col>
                  <Col xs={12} md={6}>
                    <Button style={{
                      background: '#65D269',
                      border: 'none',
                      borderRadius: '14px',
                      color: 'black'
                    }} onClick={() => generate(item)}>Pay Slip <span><FontAwesomeIcon icon={faFileDownload} style={{ color: 'white', height: '20px' }} /></span></Button>
                  </Col>
                </Row>
              );
            })
            }
          </Container>
        </Modal.Body>
        <Modal.Footer>
          {/* <Button variant="secondary" onClick={handleClose}>
            Close
          </Button> */}
          {/* <Button variant="primary">Understood</Button> */}
        </Modal.Footer>
      </Modal >

      <div id="paySlipDesign"
        className={print ? 'd-none' : ''}
        // style={ print ? { display: 'none' } : {}}
        style={{ marginTop: '100%' }}
      >
        <div className='' id="paySlip" ref={paySlipRef} style={{
          width: '190mm', // Slightly less than A4 width to allow for margins
          padding: '10mm',
          // fontFamily: 'Verdana, sans-serif',
          fontFamily: "Poppins, Helvetica, sans-serif",
          boxSizing: 'border-box'
        }}>
          <header style={{ marginBottom: '10mm' }}>
            <div className="row d-flex justify-content-between" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5mm' }}>
              <div className="col-md-8">
                <h4 style={{ fontWeight: 'bold' }}>{company ? company?.companyName : ''}</h4>
                <p>{company ? company?.attributes?.address1 + ', ' + company?.attributes?.address2 + ', ' + company?.attributes?.city + ', ' + company?.attributes?.state + '.' : ''}</p>
              </div>
              <div className="col-md-4" style={{ textAlign: 'right' }}>
                <img
                  id="companyLogo"
                  src={company ? company?.attributes?.companyLogo : ''}
                  alt="Company Logo"
                  crossorigin="anonymous"
                  style={{ maxWidth: '70px', height: 'auto', margin: '0 auto', borderRadius: "50%" }}
                />
              </div>
            </div>
            <hr style={{ width: '100%', borderColor: '2px solid grey' }} />
          </header>

          <section className="paySlipContent">
            <h4 style={{ fontWeight: 'bold', paddingBottom: '20px' }}>Payslip for the month of {paySlipMonth}</h4>
            <h4 style={{ fontWeight: 'bold', paddingBottom: '20px' }}>EMPLOYEE PAY SUMMARY</h4>

            <div className="employeeDetails" style={{ width: "100%", display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <div style={{ width: '45%', paddingRight: "25px" }}>
                <p style={{ paddingBottom: '5px' }}>Employee Name: <span style={{ fontWeight: 'bold', position: 'relative', top: '3px' }}>{payEmp?.empName}</span></p>
                <p style={{ paddingBottom: '5px' }}>Department: <span style={{ fontWeight: 'bold', position: 'relative', top: '3px' }}>{payEmp?.departmentName}</span></p>
                <p style={{ paddingBottom: '5px' }}>Join Date: <span style={{ fontWeight: 'bold', position: 'relative', top: '3px' }}>{payEmp?.dateOfJoin}</span></p>
                <p style={{ paddingBottom: '5px' }}>ESI No: <span style={{ fontWeight: 'bold', position: 'relative', top: '3px' }}>{payEmp?.employeeEsiNo}</span></p>
              </div>
              <div style={{ width: '40%' }}>
                <p style={{ paddingBottom: '5px' }}>Employee ID: <span style={{ fontWeight: 'bold', position: 'relative', top: '3px' }}>{payEmp?.empId}</span></p>
                <p style={{ paddingBottom: '5px' }}>Designation: <span style={{ fontWeight: 'bold', position: 'relative', top: '3px' }}>{payEmp?.designationName}</span></p>
                <p style={{ paddingBottom: '5px' }}>Payment Mode: <span style={{ fontWeight: 'bold', position: 'relative', top: '3px' }}>Bank</span></p>
                <p style={{ paddingBottom: '5px' }}>PF No: <span style={{ fontWeight: 'bold', position: 'relative', top: '3px' }}>{payEmp?.employeePfNo}</span></p>
              </div>
              <div style={{ width: '20%' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: "14px" }}>
                  <thead>
                    <tr>
                      <th style={{ border: '1px solid grey', padding: '5px', width: "70%" }}>Paid Days</th>
                      <th style={{ border: '1px solid grey', padding: '5px', width: "30%", textAlign: 'right' }}>{report?.data?.totalDays - payEmp?.leaveDays}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ border: '1px solid grey', padding: '5px', width: "70%" }}>LOP Days</td>
                      <td style={{ border: '1px solid grey', padding: '5px', width: "30%", textAlign: 'right' }}>{payEmp?.leaveDays}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10mm', paddingBottom: '10px' }}>
              <thead style={{ backgroundColor: 'rgb(116 177 239)' }}>
                <tr>
                  <th style={{ padding: '5px', fontWeight: 'bold' }}>EARNINGS</th>
                  <th style={{ padding: '5px', textAlign: 'right', fontWeight: 'bold' }}>AMOUNT</th>
                  <th style={{ padding: '5px', fontWeight: 'bold' }}>DEDUCTIONS</th>
                  <th style={{ padding: '5px', textAlign: 'right', fontWeight: 'bold' }}>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ border: 'none', padding: '5px' }}>Basic Salary</td>
                  <td style={{ borderRight: '1px solid grey', padding: '5px', textAlign: 'right' }}>₹{payEmp?.basicPay ? payEmp?.basicPay?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}</td>
                  {/* <td style={{ border: 'none', padding: '5px' }}>ESI</td>
                  <td style={{ border: 'none', padding: '5px', textAlign: 'right' }}>₹{payEmp?.employeeEsi ? payEmp?.employeeEsi?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}</td> */}
                  {payEmp?.employeeEsi ? <><td style={{ border: 'none', padding: '5px' }}>ESI</td>
                  <td style={{ border: 'none', padding: '5px', textAlign: 'right' }}>₹{payEmp?.employeeEsi ? payEmp?.employeeEsi?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}</td></> : <td style={{ border: 'none', padding: '5px' }}></td>}
                </tr>
                <tr>
                  {payEmp?.hra ? <><td style={{ border: 'none', padding: '5px' }}>HRA</td>
                    <td style={{ borderRight: '1px solid grey', padding: '5px', textAlign: 'right' }}>₹{payEmp?.hra ? payEmp?.hra?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}</td></> :
                    <><td style={{ border: 'none', padding: '5px' }}></td>
                      <td style={{ borderRight: '1px solid grey', padding: '5px', textAlign: 'right' }}></td></>}
                  {payEmp?.employeePf ? <><td style={{ border: 'none', padding: '5px' }}>PF</td>
                    <td style={{ border: 'none', padding: '5px', textAlign: 'right' }}>₹{payEmp?.employeePf ? payEmp?.employeePf?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}</td></> : <td style={{ border: 'none', padding: '5px' }}></td>}
                </tr>
                <tr>
                  {payEmp?.conveyaences ? <><td style={{ border: 'none', padding: '5px' }}>Conveyance</td>
                    <td style={{ borderRight: '1px solid grey', padding: '5px', textAlign: 'right' }}>₹{payEmp?.conveyaences ? payEmp?.conveyaences?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}</td></> :
                    <><td style={{ border: 'none', padding: '5px' }}></td>
                      <td style={{ borderRight: '1px solid grey', padding: '5px', textAlign: 'right' }}></td></>}
                  {payEmp?.lwf ? <><td style={{ border: 'none', padding: '5px' }}>LWF</td>
                    <td style={{ border: 'none', padding: '5px', textAlign: 'right' }}>₹{payEmp?.lwf ? payEmp?.lwf?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}</td></> :
                    ""}
                </tr>
                <tr>
                  {payEmp?.others ? <><td style={{ border: 'none', padding: '5px' }}>Other Allowances</td>
                    <td style={{ borderRight: '1px solid grey', padding: '5px', textAlign: 'right' }}>₹{payEmp?.others ? payEmp?.others?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}</td></> :
                    <><td style={{ border: 'none', padding: '5px' }}></td>
                      <td style={{ borderRight: '1px solid grey', padding: '5px', textAlign: 'right' }}></td></>}
                  {payEmp?.taxDeductions ? <><td style={{ border: 'none', padding: '5px' }}>Tax Deductions</td>
                    <td style={{ border: 'none', padding: '5px', textAlign: 'right' }}>₹{payEmp?.taxDeductions ? payEmp?.taxDeductions?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''}</td></> :
                    ""}
                </tr>
                <tr>
                  {parseFloat(payEmp?.variablePay) > 0 ? <><td style={{ border: 'none', padding: '5px' }}>Variable Pay</td>
                  <td style={{ borderRight: '1px solid grey', padding: '5px', textAlign: 'right' }}>₹{payEmp?.variablePay ? payEmp?.variablePay?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}</td></> : <><td style={{ border: 'none', padding: '5px' }}></td>
                  <td style={{ borderRight: '1px solid grey', padding: '5px', textAlign: 'right' }}></td></>}
                  <td style={{ border: 'none', padding: '5px' }}>LOP</td>
                    <td style={{ border: 'none', padding: '5px', textAlign: 'right' }}>₹{payEmp?.lop ? payEmp?.lop?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td style={{ borderTop: '1px solid grey', padding: '5px', fontWeight: 'bold' }}>Total Earnings</td>
                  <td style={{ borderTop: '1px solid grey', padding: '5px', textAlign: 'right', fontWeight: 'bold' }}>₹{payEmp?.totalEarnings ? (payEmp?.totalEarnings + parseFloat(payEmp?.variablePay))?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}</td>
                  <td style={{ borderTop: '1px solid grey', padding: '5px', fontWeight: 'bold' }}>Total Deductions</td>
                  <td style={{ borderTop: '1px solid grey', padding: '5px', textAlign: 'right', fontWeight: 'bold' }}>₹{payEmp?.finalDeduction ? payEmp?.finalDeduction?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}</td>
                </tr>
              </tfoot>
            </table>

            {/* <table style={{ width: '50%', borderCollapse: 'collapse', marginTop: '10mm', paddingBottom: '10px' }}>
              <thead style={{ backgroundColor: 'rgb(116 177 239)' }}>
                <tr>
                  <th style={{ padding: '5px', fontWeight: 'bold' }}>EARNINGS</th>
                  <th style={{ padding: '5px', textAlign: 'right', fontWeight: 'bold' }}>AMOUNT</th>
                  <th style={{ padding: '5px', fontWeight: 'bold' }}>DEDUCTIONS</th>
                  <th style={{ padding: '5px', textAlign: 'right', fontWeight: 'bold' }}>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ border: 'none', padding: '5px' }}>Basic Salary</td>
                  <td style={{ borderRight: '1px solid grey', padding: '5px', textAlign: 'right' }}>₹{payEmp?.basicPay ? payEmp?.basicPay?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}</td>
                  <td style={{ border: 'none', padding: '5px' }}>ESI</td>
                  <td style={{ border: 'none', padding: '5px', textAlign: 'right' }}>₹{payEmp?.employeeEsi ? payEmp?.employeeEsi?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}</td>
                </tr>
                <tr>
                  {payEmp?.hra ? <><td style={{ border: 'none', padding: '5px' }}>HRA</td>
                    <td style={{ borderRight: '1px solid grey', padding: '5px', textAlign: 'right' }}>₹{payEmp?.hra ? payEmp?.hra?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}</td></> :
                    <><td style={{ border: 'none', padding: '5px' }}></td>
                    <td style={{ borderRight: '1px solid grey', padding: '5px', textAlign: 'right' }}></td></>}
                  {payEmp?.employeePf && <><td style={{ border: 'none', padding: '5px' }}>PF</td>
                    <td style={{ border: 'none', padding: '5px', textAlign: 'right' }}>₹{payEmp?.employeePf ? payEmp?.employeePf?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}</td></>}
                </tr>
                <tr>
                  {payEmp?.conveyaences ? <><td style={{ border: 'none', padding: '5px' }}>Conveyance</td>
                    <td style={{ borderRight: '1px solid grey', padding: '5px', textAlign: 'right' }}>₹{payEmp?.conveyaences ? payEmp?.conveyaences?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}</td></> :
                    <><td style={{ border: 'none', padding: '5px' }}></td>
                    <td style={{ borderRight: '1px solid grey', padding: '5px', textAlign: 'right' }}></td></>}
                  {payEmp?.lwf ? <><td style={{ border: 'none', padding: '5px' }}>LWF</td>
                    <td style={{ border: 'none', padding: '5px', textAlign: 'right' }}>₹{payEmp?.lwf ? payEmp?.lwf?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}</td></> :
                    ""}
                </tr>
                <tr>
                  {payEmp?.others ? <><td style={{ border: 'none', padding: '5px' }}>Other Allowances</td>
                    <td style={{ borderRight: '1px solid grey', padding: '5px', textAlign: 'right' }}>₹{payEmp?.others ? payEmp?.others?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}</td></> :
                    <><td style={{ border: 'none', padding: '5px' }}></td>
                    <td style={{ borderRight: '1px solid grey', padding: '5px', textAlign: 'right' }}></td></>}
                  {payEmp?.taxDeductions ? <><td style={{ border: 'none', padding: '5px' }}>Tax Deductions</td>
                    <td style={{ border: 'none', padding: '5px', textAlign: 'right' }}>₹{payEmp?.taxDeductions ? payEmp?.taxDeductions?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''}</td></> :
                    ""}
                </tr>
                <tr>
                  <td style={{ border: 'none', padding: '5px' }}></td>
                  <td style={{ borderRight: '1px solid grey', padding: '5px', textAlign: 'right' }}></td>
                  {payEmp?.lop && <><td style={{ border: 'none', padding: '5px' }}>LOP</td>
                    <td style={{ border: 'none', padding: '5px', textAlign: 'right' }}>₹{payEmp?.lop ? payEmp?.lop?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}</td></>}
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td style={{ borderTop: '1px solid grey', padding: '5px', fontWeight: 'bold' }}>Gross Earnings</td>
                  <td style={{ borderTop: '1px solid grey', padding: '5px', textAlign: 'right', fontWeight: 'bold' }}>₹{payEmp?.totalEarnings ? payEmp?.totalEarnings?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}</td>
                  <td style={{ borderTop: '1px solid grey', padding: '5px', fontWeight: 'bold' }}>Total Deductions</td>
                  <td style={{ borderTop: '1px solid grey', padding: '5px', textAlign: 'right', fontWeight: 'bold' }}>₹{payEmp?.finalDeduction ? payEmp?.finalDeduction?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}</td>
                </tr>
              </tfoot>
            </table> */}

            <div className="footer" style={{
              width: '100%',
              marginTop: '10mm',
              padding: '10px',
              border: '2px dashed #74B1EF',
              borderRadius: '5px',
              textAlign: 'center'
            }}>
              <p style={{ fontWeight: 'bold' }}>Total Net Payable Rs.{payEmp?.netPaid ? payEmp?.netPaid?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0} (Rupees {payEmp?.words ? payEmp?.words : ''})</p>
            </div>
          </section>

          <p style={{ fontSize: "12px", fontStyle: "italic", marginTop: "50px", textAlign: "center" }}>--This is Computer Generated Payslip. No Signature required.--</p>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  const { salaryDetail, isLoading, salary } = state;
  return { salaryDetail, isLoading, salary };
};

export default connect(mapStateToProps, {
  fetchSalaryDetails,
  fetchSalary,
  fetchSalaryDetailsFilter,
  deleteSalaryDetails,
  fetchSalaryDetailsReportFilter,
  fetchCompanyConfig
})(Salary);
