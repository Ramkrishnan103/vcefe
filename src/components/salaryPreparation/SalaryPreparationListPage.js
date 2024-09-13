import { connect, useDispatch, useSelector } from "react-redux";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import MasterLayout from "../MasterLayout";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { Link, useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";
import React, { useEffect, useRef, useState } from 'react'
import { useMemo } from 'react';
import DateEditor from "react-tabulator/lib/editors/DateEditor";
import MultiValueFormatter from "react-tabulator/lib/formatters/MultiValueFormatter";
import "react-tabulator/lib/styles.css"; // default theme
import "react-tabulator/css/bootstrap/tabulator_bootstrap.min.css"; // use Theme(s)
// import 'react-tabulator/css/semantic-ui/tabulator_semantic-ui.css'; // Semantic UI theme
import { addSalaryDetails, lockSalaryDetails } from "../../store/action/SalaryStructureAction";
import { ReactTabulator, reactFormatter } from "react-tabulator";
import moment from "moment";
import { Button } from "react-bootstrap-v5";
import SweetAlert from "react-bootstrap-sweetalert";
import { addToast } from "../../store/action/toastAction";
import { toastType } from "../../constants";

// var data1 = {
//   "success": true,
//   "salaryMonth": 6,
//   "salaryYear": 2024,
//   "totalDays": 31,
//   "status": 1,
//   "data": [
//     {
//       "department": "IT",
//       "designation": "Developer",
//       "employeeList": [
//         {
//           "empId": 1,
//           "empName": "Mr.Raja",
//           "refNo": "123123",
//           "workDays": 22,
//           "leaveDays": "",
//           "totalEarnings": 10000,
//           "deductions": 750,
//           "netPaid": 0,
//           "remaks": "",
//           "isPaid": true
//         },
//         {
//           "empId": 2,
//           "empName": "Mr.Suresh",
//           "refNo": "6558",
//           "workDays": 22,
//           "leaveDays": "",
//           "totalEarnings": 15000,
//           "deductions": 750,
//           "netPaid": 0,
//           "remaks": "",
//           "isPaid": false
//         }
//       ]
//     },
//     {
//       "department": "IT",
//       "designation": "Quality Analysist",
//       "employeeList": [
//         {
//           "empId": 3,
//           "empName": "Mrs.Ramya",
//           "refNo": "45687",
//           "workDays": 22,
//           "leaveDays": "",
//           "totalEarnings": 20000,
//           "deductions": 750,
//           "netPaid": 0,
//           "remaks": "",
//           "isPaid": true
//         }
//       ]
//     }

//   ],
//   "message": "Data Fethced Successfully.!"
// }

let days;
const customInputEditorWithClass = (cell, onRendered, success, cancel) => {
  // Create and style the input element
  const input = document.createElement("input");
  input.type = "text";
  input.id = "leaveDays-inp";
  input.value = cell.getValue() || "";
  // if(cell.getValue() != ''){
  //   cell?.getElement()?.getElementsByTagName('span')[0]?.select();
  // }

  // Define the allowed characters
  const allowedCharacters = /^[0-9\b.]+$/; // Allows only numbers and backspace

  // Event listener to handle input restriction
  input.addEventListener("input", function (e) {
    const value = e.target.value;
    debugger
    if (parseInt(value) > days) {
      e.preventDefault();
      e.target.value = days;
    }

    const parts = e.target.value.split(".")[1];
    if (parts?.length > 1) {
      e.target.value = value?.split(".")[0] + "." + parts[1];
    }
    // Test if the current value matches the allowed characters pattern
    if (!allowedCharacters.test(value)) {
      e.target.value = value.replace(/[^0-9.]/g, ""); // Remove disallowed characters
    }
  });

  // Callback for when the editor is created
  onRendered(() => {
    input.focus();
    input.style.width = "100%";
    input.style.height = "100%";
  });

  // Commit the changes when the user hits enter or the input loses focus
  input.addEventListener("blur", () => success(input.value));
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      debugger
      e.preventDefault(); // Prevent the default action of the Enter key

      // Find the current table instance
      const table = cell.getTable();

      // Find the next row
      // const nextRow = table.getRow(cell.getRow().getIndex() + 1);
      // const nextRow = table.getRow(cell.getRow().getIndex());
      const nextRow = table.getRow(cell.getRow());
      if (nextRow) {
        // Find the next row's editable 'Leave Days' cell
        const leaveDaysCell = nextRow.getCell('variablePay');
        if (leaveDaysCell) {
          // Focus the 'Leave Days' cell
          leaveDaysCell.getElement().focus();

          const value = leaveDaysCell.getValue();
          if(value){
            leaveDaysCell.getElement().getElementsByTagName('input')[0].select();
          }
        }
      }
      success(input.value);
    } else if (e.key === "Escape") {
      cancel();
    }
  });
  return input;
};

let pay;
const customInputEditorWithClassPay = (cell, onRendered, success, cancel) => {
  // Create and style the input element
  const input = document.createElement("input");
  input.type = "text";
  input.id = "variablePay-inp";
  input.value = cell.getValue() || "";

  // Define the allowed characters
  const allowedCharacters = /^[0-9\b.]+$/; // Allows only numbers and backspace

  // Event listener to handle input restriction
  input.addEventListener("input", function (e) {
    const value = e.target.value;
    debugger
    if (parseInt(value) > pay) {
      e.preventDefault();
      e.target.value = pay;
    }

    const parts = e.target.value.split(".")[1];
    if (parts?.length > 2) {
      e.target.value = value?.split(".")[0] + "." + e.target.value?.split(".")[1]?.slice(0, 2);
    }
    // Test if the current value matches the allowed characters pattern
    if (!allowedCharacters.test(value)) {
      e.target.value = value.replace(/[^0-9.]/g, ""); // Remove disallowed characters
    }

  });

  // Callback for when the editor is created
  onRendered(() => {
    input.focus();
    input.style.width = "100%";
    input.style.height = "100%";
  });

  // Commit the changes when the user hits enter or the input loses focus
  input.addEventListener("blur", () => success(input.value));
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent the default action of the Enter key

      // Find the current table instance
      const table = cell.getTable();

      // Find the next row
      // const nextRow = table.getRow(cell.getRow().getIndex() + 1);
      const nextRow = table.getRow(cell.getRow().getNextRow());
      if (nextRow) {
        // Find the next row's editable 'Leave Days' cell
        const leaveDaysCell = nextRow.getCell('leaveDays');
        if (leaveDaysCell) {
          // Focus the 'Leave Days' cell
          leaveDaysCell.getElement().focus();
          const value = leaveDaysCell.getValue();
          if(value){
            leaveDaysCell?.getElement()?.getElementsByTagName('input')[0]?.select();
          }
        }
      }
      success(input.value);
    } else if (e.key === "Escape") {
      cancel();
    }
  });

  return input;
};

const SalaryPreparationListPage = (props) => {
  const { addSalaryDetails, salaryDetail, salaryListingall, lockSalaryDetails } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tabulatorRef = useRef(null);
  const details = useSelector((state) => state.salaryListingall);
  // State for selected rows
  const [selectedRows, setSelectedRows] = useState([]);
  const [data1, setData1] = useState(details);
  // State for form data changes
  const [formDataChanges, setFormDataChanges] = useState({});
  const [mode, setMode] = useState();
  let workloadsTableRef = useRef(null);
  const [columns, setColumns] = useState([
    // {
    //   title: "Select",
    //   field: "select",
    //   // headerSort: false,
    //   // resizable: false,
    //   // frozen: true,
    //   // headerHozAlign: "center",
    //   // hozAlign: "center",
    //   formatter: "rowSelection",
    //   titleFormatter: "rowSelection",
    //   width: 'auto',
    //   cellClick: (e, cell) => {
    //     cell.getRow().toggleSelect();
    //   },
    // },
    { title: "Department", field: "", headerSort: "false", headerSort: false },
    { title: "Designation", field: "", hozAlign: "left", headerSort: false },
    { title: "Emp.ID", field: "empId", hozAlign: "center", headerSort: false },
    { title: "Name", field: "empName", hozAlign: "left", headerSort: false },
    { title: "No.of.Days", field: "totalDays", hozAlign: "center", headerSort: false },
    {
      title: "Leave", field: "leaveDays", headerSort: false, hozAlign: "center", editor: customInputEditorWithClass, formatter: (cell) => {
        const value = cell.getValue();
        const color = "blue";
        const border = '1px solid darkgrey';
        const borderradius = '5px';
        const padding = '0px 22px'
        return `<span style="color: ${color}; ">${value}</span>`;
      }
    },
    {
      title: "Variable Pay", field: "variablePay", headerSort: false, hozAlign: "center", editor: customInputEditorWithClassPay, formatter: (cell) => {
        const value = cell.getValue();
        const color = "blue";
        const border = '1px solid darkgrey';
        const borderradius = '5px';
        const padding = '0px 22px'
        return `<span style="color: ${color}; ">${value != undefined ? value : ""}</span>`;
      }
    },
    { title: "Work Days", field: "workDays", hozAlign: "center", headerSort: false },
    { title: "Earnings", field: "totalEarnings", hozAlign: "right", headerSort: false },
    { title: "Deductions", field: "deductions", hozAlign: "right", headerSort: false },
    { title: "Net Pay", field: "netPaid", hozAlign: "right", headerSort: false }
  ]);
  const [footer, setFooter] = useState({
    totalEarnings: 0,
    deduction: 0,
    netPay: 0
  })
  const [data, setData] = useState([]);
  const [initialdata, setInitialData] = useState([]);
  const [userId, setUserId] = useState(null);
  const [saveAlert, setSaveAlert] = useState(false);
  const [lockAlert1, setLockAlert1] = useState(false);
  const [lockAlert2, setLockAlert2] = useState(false);
  const [backAlert, setBackAlert] = useState(false);
  const [updateAlert, setUpdateAlert] = useState(false);
  const to = "/app/salaryPreparation";

  useState(() => {
    let data = details?.data ?? [];
    console.log("DETAILS", details);
    debugger
    days = moment((data1?.salaryYear + "-" + data1?.salaryMonth)).daysInMonth();
    // let empdata =
    //   details?.data?.EmployeeList?.map((employee, id) => ({
    //     id: id, // Use the index of the departmentData as the id
    //     department: employee?.departmentName,
    //     designation: employee?.designationName,
    //     empId: employee?.empId,
    //     empNo: employee?.empNo,
    //     empName: employee?.empName,
    //     totalDays: moment((data1?.salaryYear + "-" + data1?.salaryMonth)).daysInMonth(),
    //     leaveDays: details?.mode != "undefined" && employee.isPaid ? employee?.leaveDays : employee?.leaveDays != 0 ? employee?.leaveDays : "",
    //     workDays: employee?.workDays != 0 ? employee?.workDays : moment((data1?.salaryYear + "-" + data1?.salaryMonth)).daysInMonth(),
    //     totalEarnings: details?.mode == "edit" ? parseFloat(employee?.totalEarnings).toFixed(2) : parseFloat(0).toFixed(2),
    //     hiddentotalEarnings: employee?.ctcMonthly,
    //     deductions: details?.mode == "edit" ? parseFloat(employee?.deductions).toFixed(2) : parseFloat(0).toFixed(2),
    //     hiddendeductions: ((employee?.ctcMonthly * (employee?.esiEmployeePercent / 100)) + (employee.ctcMonthly * (employee?.pfEmployeePercent / 100)) + (employee?.lwfPercent) + (employee.ctcMonthly * (employee?.taxDeductionPercent / 100))),
    //     select: true,
    //     salaryConfigId: employee?.salaryConfigId,
    //     netPaid: details?.mode == "edit" ? parseFloat(employee?.netPaid).toFixed(2) : parseFloat(0).toFixed(2),
    //     hiddennetPaid: employee?.netPaid
    //   }))

    let empdata =
      details?.data?.flatMap((employee) => {
        return employee.EmployeeList?.map((employee, id) => ({
          id: employee?.empId, // Use the index of the departmentData as the id
          slNo: id,
          department: employee?.departmentName,
          designation: employee?.designationName,
          empId: employee?.empId,
          empNo: employee?.empNo,
          empName: employee?.empName,
          totalDays: moment((data1?.salaryYear + "-" + data1?.salaryMonth)).daysInMonth(),
          leaveDays: details?.mode != "undefined" && employee.isPaid ? employee?.leaveDays : employee?.leaveDays != 0 ? employee?.leaveDays : "",
          workDays: employee?.workDays != 0 ? employee?.workDays : moment((data1?.salaryYear + "-" + data1?.salaryMonth)).daysInMonth(),
          totalEarnings: details?.mode == "edit" || details?.mode == "view" ? parseFloat(employee?.totalEarnings).toFixed(2) : parseFloat(0).toFixed(2),
          hiddentotalEarnings: employee?.ctcMonthly,
          deductions: details?.mode == "edit" || details?.mode == "view" ? parseFloat(employee?.deductions).toFixed(2) : parseFloat(0).toFixed(2),
          hiddendeductions: ((employee?.ctcMonthly * (employee?.esiEmployeePercent / 100)) + (employee.ctcMonthly * (employee?.pfEmployeePercent / 100)) + (employee?.lwfPercent) + (employee.ctcMonthly * (employee?.taxDeductionPercent / 100))),
          select: true,
          salaryConfigId: employee?.salaryConfigId,
          netPaid: details?.mode == "edit" || details?.mode == "view" ? parseFloat(employee?.netPaid).toFixed(2) : parseFloat(0).toFixed(2),
          hiddennetPaid: employee?.netPaid,
          variablePay: employee?.variablePay == 0 ? "" : employee?.variablePay
        }))
      })

    // );
    // setFooter({
    //   totalEarnings: empdata.reduce((total, item) => total + parseFloat(item.totalEarnings), 0),
    //   deduction: empdata.reduce((total, item) => total + parseFloat(item.deductions), 0),
    //   netPay: empdata.reduce((total, item) => total + parseFloat(item.netPaid), 0)
    // });
    console.log("empdata", empdata);
    setData(empdata);
    setInitialData(empdata);
    if (tabulatorRef.current) {
      tabulatorRef.selectRow();
    }
    setMode(details?.mode);
  }, [details]);

  useEffect(() => {
    console.log("MODE", mode);
  }, [mode])

  useEffect(() => {
    console.log("salaryDetail", salaryDetail);
    console.log("detail", details);
    console.log("salaryDet", salaryListingall)
    setData1(details);
  }, [details, salaryDetail]);

  useEffect(() => {
    formCalculation();
    let data = localStorage.getItem("loginUserArray");
    console.log(JSON.parse(data)['id']);
    setUserId(JSON.parse(data)['id']);
  }, []);

  useEffect(() => {
    console.log("selectedRows", selectedRows);
  }, [selectedRows]);

  useEffect(() => {
    console.log("formDataChanges", formDataChanges);
  }, [formDataChanges]);

  useEffect(() => {
    console.log("data", data);
    debugger
    setFooter({
      totalEarnings: data?.reduce((total, item) => total + parseFloat(item.totalEarnings), 0),
      deduction: data?.reduce((total, item) => total + parseFloat(item.deductions), 0),
      netPay: data?.reduce((total, item) => total + parseFloat(item.netPaid), 0)
    });
  }, [data]);

  const formCalculation = () => {
    debugger
    if (data?.length > 0) {
      let arr = [...data];
      console.log("arr", arr.filter((item) => item?.leaveDays >= 0 && item?.leaveDays != ""));
      arr.filter((item) => item?.leaveDays >= 0 && item?.leaveDays != "").map((item) => {
        item.workDays = item?.totalDays - item?.leaveDays;
        item.deductions = parseFloat(((item?.hiddentotalEarnings / item?.totalDays) * item?.leaveDays) + item?.hiddendeductions).toFixed(2);
        item.netPaid = parseFloat((item?.hiddentotalEarnings - item?.deductions) + parseFloat(item?.variablePay == "" ? 0 : item?.variablePay)).toFixed(2);
        item.totalEarnings = item?.leaveDays >= 0 ? parseFloat(item?.hiddentotalEarnings).toFixed(2) : 0;
        // item.hiddendeductions = parseFloat(((item?.hiddentotalEarnings / item?.totalDays) * item?.leaveDays) + item?.hiddendeductions);
        // item.hiddenNetPaid = parseFloat(item?.hiddentotalEarnings - item?.deductions);
        // item.hiddentotalEarnings = item?.leaveDays >= 0 ? parseFloat(item?.hiddentotalEarnings) : 0;
      });
      console.log("arr", arr);
      workloadsTableRef?.current?.updateData(arr);
      workloadsTableRef?.current?.setGroupHeader();
      setData(arr);
    }
  }

  const uniqueCalc = (data) => {
    // let arr = [...data];
    debugger
    let item = data;
    item.workDays = item?.totalDays - item?.leaveDays;
    item.deductions = item?.leaveDays.toString() != "" ? parseFloat(((item?.hiddentotalEarnings / item?.totalDays) * item?.leaveDays) + item?.hiddendeductions).toFixed(2) : parseFloat(0.00).toFixed(2);
    item.netPaid = item?.leaveDays.toString() != "" ? parseFloat((item?.hiddentotalEarnings - item?.deductions) + parseFloat(item?.variablePay == "" ? 0 : item?.variablePay)).toFixed(2) : parseFloat(0.00).toFixed(2);
    item.totalEarnings = item?.leaveDays.toString() != "" ? item?.leaveDays >= 0 ? parseFloat(item?.hiddentotalEarnings).toFixed(2) : 0 : parseFloat(0.00).toFixed(2);
    return item;
  }

  const footerCalc = () => {
    console.log("data", data);
    setFooter({
      totalEarnings: data.reduce((total, item) => total + parseFloat(item?.totalEarnings), 0),
      deduction: data.reduce((total, item) => total + parseFloat(item?.deductions), 0),
      netPay: data.reduce((total, item) => total + parseFloat(item?.netPaid), 0)
    });
  }

  const handleRowSelectionChanged = (data) => {
    console.log(data);
    setSelectedRows(data);
  };

  // Handle form data change
  const handleCellEdited = (cell) => {
    debugger
    let arr = [...data];
    // let arr = workloadsTableRef?.current?.getData();
    let selected = [...selectedRows];
    let row = cell.getData();
    let index = arr.findIndex(x => x.empId === row.empId);
    let selIndex = selected.findIndex(x => x.empId === row.empId);
    if (selIndex != -1) {
      selected[selIndex] = uniqueCalc(row);
      setSelectedRows(selected);
    }
    arr[index] = uniqueCalc(row);
    setFooter({
      totalEarnings: arr.filter((item) => item?.leaveDays >= 0 && item?.leaveDays != "").reduce((total, item) => total + parseFloat(item?.totalEarnings), 0),
      deduction: arr.filter((item) => item?.leaveDays >= 0 && item?.leaveDays != "").reduce((total, item) => total + parseFloat(item?.deductions), 0),
      netPay: arr.filter((item) => item?.leaveDays >= 0 && item?.leaveDays != "").reduce((total, item) => total + parseFloat(item?.netPaid), 0)
    });

    console.log("arr", arr);
    let table = workloadsTableRef?.current?.updateData(arr);
    workloadsTableRef?.current?.setGroupHeader(function (value, count, data) {
      const totalProgress = data.reduce((total, employee) => {
        return total + parseFloat(employee.netPaid);
      }, 0);

      return `${value} <span class='total-netpaid' style="font-size: 16px">${totalProgress.toFixed(2).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>`;
    });

   
    setData(arr);
    // formCalculation();
    // footerCalc();
  };

  const handleSave = () => {
    let empdetails =
    {
      txNo: details?.salaryTxNo ? details?.salaryTxNo : 0,
      txnDate: moment(new Date()).format("YYYY-MM-DD"),
      salaryMonth: data1?.salaryMonth,
      salaryYear: data1?.salaryYear,
      totalDays: moment((data1?.salaryYear + "-" + data1?.salaryMonth)).daysInMonth(),
      updatedAt: userId,
      remarks: "",
      salaryDetails2: prepareData(),
      xMode: mode == "edit" ? "u" : "s"
    }
    console.log("details", details);
    debugger
    if (empdetails.salaryDetails2.length > 0) {
      addSalaryDetails(empdetails, navigate);
    } else {
      dispatch(
        addToast({
          text: "Select the Employee.!",
          type: toastType.ERROR,
        })
      );
    }

    setSaveAlert(false);
    setUpdateAlert(false);
  };

  const prepareData = () => {
    let arr = data?.filter(item => item.leaveDays >= 0 && item.leaveDays !== "")?.map(item => {
      return {
        txNo: details?.salaryTxNo ? details?.salaryTxNo : 0,
        // slNo: item.id,
        slNo: item.slNo,
        empNo: item?.empNo,
        salaryConfigId: item?.salaryConfigId,
        workDays: item?.workDays,
        leaveDays: item?.leaveDays,
        totalEarnings: item?.totalEarnings,
        deductions: item?.deductions,
        netPaid: item?.netPaid,
        remarks: "",
        variablePay: item?.variablePay != "" ? item?.variablePay : 0
      }
    });
    return arr;
  };

  const handleLock = () => {
    let empdetails = {
      txNo: details?.salaryTxNo,
      status: 1
    }
    // handleSave();
    let empdetails1 =
    {
      txNo: details?.salaryTxNo ? details?.salaryTxNo : 0,
      txnDate: moment(new Date()).format("YYYY-MM-DD"),
      salaryMonth: data1?.salaryMonth,
      salaryYear: data1?.salaryYear,
      totalDays: moment((data1?.salaryYear + "-" + data1?.salaryMonth)).daysInMonth(),
      updatedAt: userId,
      remarks: "",
      salaryDetails2: prepareData(),
      xMode: mode == "edit" ? "u" : "s"
    }
    console.log("details", details);
    debugger
    if (empdetails1.salaryDetails2.length > 0) {
      // addSalaryDetails(empdetails, navigate);
    } else {
      dispatch(
        addToast({
          text: "Select the Employee.!",
          type: toastType.ERROR,
        })
      );
    }
    lockSalaryDetails(empdetails, navigate, empdetails1);
    setLockAlert2(false);
  };

  const saveModal = () => {
    if (mode == 'edit') {
      setUpdateAlert(true);
    } else {
      setSaveAlert(true);
    }
  };

  const lockModal = () => {
    setLockAlert1(true);
  };

  const onCancel = () => {
    setSaveAlert(false);
    setLockAlert1(false);
    setLockAlert2(false);
    setBackAlert(false);
    setUpdateAlert(false);
  };

  return (
    <div>
      <MasterLayout>
        <TopProgressBar />
        <div className="d-md-flex align-items-center justify-content-between mb-5">
          <h1 className="mb-0 create-title">Salary Preparation</h1>
          <div className="text-end mt-4 mt-md-0 d-flex">
            <button
              className={mode == 'view' ? "btn btn-light me-3 d-none" : "btn btn-light me-3 d-flex"}
              style={mode != 'view' ? {
                width: "110px",
                height: "45px",
                color: "orange",
                fontSize: "16px",
                fontWeight: "600",
                borderRadius: "10px",
                backgroundColor: "white",
              } : {
                width: "110px",
                height: "45px",
                color: "orange",
                fontSize: "16px",
                fontWeight: "600",
                borderRadius: "10px",
                backgroundColor: "white",
                display: "none"
              }}
              onClick={() => { lockModal() }}
              disabled={mode == undefined ? true : false}
            >
              <img
                src="https://www.figma.com/file/XWgAlnz1HciGf0k6nBySr8/image/91c3ca6b2ab867a81e39302693d3610e3130edda"
                alt="lock icon"
                style={{ width: "25px", height: "22px" }}
              />
              {getFormattedMessage("globally.lock-btn")}
            </button>
            <Button
              // to={to}
              className="btn btn-primary me-3 save-btn"
              style={mode != 'view' ? { width: "110px", height: "45px", textAlign: "center" } : { width: "110px", height: "45px", textAlign: "center", display: "none" }}
              onClick={() => { saveModal() }}
            >
              {mode == 'edit' ? 'Update' : getFormattedMessage("globally.save-btn")}
            </Button>
            <Button
              // to={to}
              className="btn btn-primary me-3 back-btn"
              style={{ width: "110px", height: "45px", textAlign: "center" }}
              onClick={() => { setBackAlert(true) }}
            >
              {getFormattedMessage("Back")}
            </Button>
            {/* {to && (
              <Link
                to={to}
                className="btn btn-outline-primary back-btn"
                style={{ width: "110px", height: "45px", textAlign: "center" }}
              >
                {getFormattedMessage("Back")}
              </Link>
            )} */}
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <Form>
              <div className="row">
                <div className="col-md-10">
                  <h3>Salary for the month of {moment(data1?.salaryMonth + "-" + data1?.salaryYear, 'MM-YYYY').format("MMM-YYYY")}</h3>
                </div>
              </div>
              <div className="salaryListing">
                <ReactTabulator
                  // ref={tabulatorRef}
                  onRef={(r) => (workloadsTableRef = r)}
                  // data={data}
                  data={initialdata}
                  columns={columns}
                  // layout={"fitData"}
                  // footerElement={

                  // }
                  options={{
                    // selectable: true,
                    groupBy: function (data) {
                      return data.department + " - " + data.designation;
                      // return data.department;
                    },
                    groupHeader: function (value, count, data, group) {
                      // const totalProgress = data.reduce((total, employee) => {
                      const totalProgress = data.reduce((total, employee) => {
                        return total + parseFloat(employee.netPaid);
                      }, 0);
                      console.log(data, '<=data');
                      // return value ;
                      return value + `<span class='total-netpaid' style="font-size: 16px">${(parseFloat(totalProgress)?.toFixed(2))?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>`;
                    },
                    rowSelected: handleRowSelectionChanged,
                    cellEdited: handleCellEdited,
                    rowSelection: true,
                    selectableRowCount: 'multiple',
                    placeholder: "No records found",
                  }}
                  events={{
                    rowSelectionChanged: (data, rows) => {
                      console.log("Selected rows:", rows);
                      // let data = row.getData();
                      handleRowSelectionChanged(data);
                    },
                    cellEdited: (e) => {
                      handleCellEdited(e);
                    },
                  }}
                  groupValues={[["IT"]]}
                  layout="fitColumns"
                  resizableColumnFit={true}
                />
                <>
                  <div style={{ display: "flex", justifyContent: "space-between" }} className="payroll-footer">
                    <div style={{ flex: 1, flexGrow: 7 }}>
                      <span style={{
                        width: '100%',
                        display: 'block',
                        marginLeft: '31%'
                      }}>Total: {data?.filter((item) => item.leaveDays >= 0 && item.leaveDays !== "").length}<span>{` (out of ${data?.length}) Employees`}</span>  </span>
                    </div>
                    <div style={{ flex: 1, textAlign: 'end' }}>
                      <span style={{ marginRight: '7%' }} id="total">{data?.reduce((total, item) => total + parseFloat(item?.totalEarnings), 0)?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div style={{ flex: 1, textAlign: 'end' }}>
                      <span style={{ marginRight: '7%' }} id="deductions">{data?.reduce((total, item) => total + parseFloat(item?.deductions), 0)?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div style={{ flex: 1, textAlign: 'end' }}>
                      <span style={{ marginRight: '7%' }} id="netpaid">{data?.reduce((total, item) => total + parseFloat(item?.netPaid), 0)?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </>
              </div>
            </Form>
          </div>
        </div>
        {saveAlert && (
          <SweetAlert
            confirmBtnBsStyle='success mb-3 fs-5 rounded'
            cancelBtnBsStyle='secondary mb-3 fs-5 rounded text-white'
            confirmBtnCssClass='alert_yes'
            confirmBtnText={"Yes,It's Ok"}
            cancelBtnText={"Cancel"}
            title={"Proceed to Save Payroll.?"}
            // onConfirm={onConfirm}
            // onCancel={onCancel}
            showCancel
            focusCancelBtn
            customButtons={
              <>
                <button id="cancel-button" onClick={() => onCancel()} className="btn btn-secondary">
                  Cancel
                </button>

                <button id="confirm-button" className="btn btn-success" style={{ marginRight: "5%" }} autoFocus={true} onClick={() => handleSave()}>
                  Yes
                </button>

              </>
            }
          // customIcon={remove} 
          />
        )}

        {updateAlert && (
          <SweetAlert
            confirmBtnBsStyle='success mb-3 fs-5 rounded'
            cancelBtnBsStyle='secondary mb-3 fs-5 rounded text-white'
            confirmBtnCssClass='alert_yes'
            confirmBtnText={"Yes,It's Ok"}
            cancelBtnText={"Cancel"}
            title={"Proceed to Update Payroll.?"}
            // onConfirm={onConfirm}
            // onCancel={onCancel}
            showCancel
            focusCancelBtn
            customButtons={
              <>
                <button id="cancel-button" onClick={() => onCancel()} className="btn btn-secondary">
                  Cancel
                </button>

                <button id="confirm-button" className="btn btn-success" style={{ marginRight: "5%" }} autoFocus={true} onClick={() => handleSave()}>
                  Yes
                </button>
              </>
            }
          // customIcon={remove} 
          />
        )}

        {lockAlert1 && (
          <SweetAlert
            confirmBtnBsStyle='success mb-3 fs-5 rounded'
            cancelBtnBsStyle='secondary mb-3 fs-5 rounded text-white'
            confirmBtnCssClass='alert_yes'
            confirmBtnText={"Yes,It's Ok"}
            cancelBtnText={"Cancel"}
            title={"Confirm to lock this month's salary details?"}
            // onConfirm={onConfirm}
            // onCancel={onCancel}
            showCancel
            focusCancelBtn
            customButtons={
              <>
                <button id="cancel-button" onClick={() => onCancel()} className="btn btn-secondary">
                  Cancel
                </button>

                <button id="confirm-button" className="btn btn-success" style={{ marginRight: "5%" }} autoFocus={true} onClick={() => { setLockAlert2(true); setLockAlert1(false) }}>
                  Yes
                </button>
              </>
            }
          // customIcon={remove} 
          />
        )}

        {lockAlert2 && (
          <SweetAlert
            confirmBtnBsStyle='success mb-3 fs-5 rounded'
            cancelBtnBsStyle='secondary mb-3 fs-5 rounded text-white'
            confirmBtnCssClass='alert_yes'
            confirmBtnText={"Yes,It's Ok"}
            cancelBtnText={"Cancel"}
            title={" Further edits will be disabled. Confirm.?"}
            // onConfirm={onConfirm}
            // onCancel={onCancel}
            showCancel
            focusCancelBtn
            customButtons={
              <>
                <button id="cancel-button" onClick={() => onCancel()} className="btn btn-secondary">
                  Cancel
                </button>

                <button id="confirm-button" className="btn btn-success" style={{ marginRight: "5%" }} autoFocus={true} onClick={() => handleLock()}>
                  Yes
                </button>

              </>
            }
          // customIcon={remove} 
          />
        )}

        {backAlert && (
          <SweetAlert
            confirmBtnBsStyle='success mb-3 fs-5 rounded'
            cancelBtnBsStyle='secondary mb-3 fs-5 rounded text-white'
            confirmBtnCssClass='alert_yes'
            confirmBtnText={"Yes,It's Ok"}
            cancelBtnText={"Cancel"}
            title={"Back to Salary Preparation Listing Page.?"}
            // onConfirm={onConfirm}
            // onCancel={onCancel}
            showCancel
            focusCancelBtn
            customButtons={
              <>
                <button id="cancel-button" onClick={() => onCancel()} className="btn btn-secondary">
                  Cancel
                </button>

                {/* <button id="confirm-button" className="btn btn-success" style={{ marginRight: "5%" }} autoFocus={true}> */}
                {to && (
                  <Link
                    to={to}
                    className="btn btn-success"
                    style={{ width: "100px", height: "40px", textAlign: "center", marginRight: "4%", backgroundColor: "#29ad26" }}
                  >
                    {getFormattedMessage("Yes")}
                  </Link>
                )}
                {/* </button> */}

              </>
            }
          // customIcon={remove} 
          />
        )}

        {saveAlert && (
          <SweetAlert
            confirmBtnBsStyle='success mb-3 fs-5 rounded'
            cancelBtnBsStyle='secondary mb-3 fs-5 rounded text-white'
            confirmBtnCssClass='alert_yes'
            confirmBtnText={"Yes,It's Ok"}
            cancelBtnText={"Cancel"}
            title={"Proceed to Save Payroll.?"}
            // onConfirm={onConfirm}
            // onCancel={onCancel}
            showCancel
            focusCancelBtn
            customButtons={
              <>
                <button id="cancel-button" onClick={() => onCancel()} className="btn btn-secondary">
                  Cancel
                </button>

                <button id="confirm-button" className="btn btn-success" style={{ marginRight: "5%" }} autoFocus={true} onClick={() => handleSave()}>
                  Yes
                </button>

              </>
            }
          // customIcon={remove} 
          />
        )}
      </MasterLayout>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { isLoading: state.isLoading };
};

export default connect(mapStateToProps, { addSalaryDetails, lockSalaryDetails })(SalaryPreparationListPage);