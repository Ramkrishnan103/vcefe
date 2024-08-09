import React, { useEffect, useState, useRef } from 'react';
import moment, { monthsShort } from 'moment';
import { connect } from 'react-redux';
import { fetchMonthPurchase, fetchMonthPurchaseparam, } from '../../../store/action/monthlyPurchaseAction';
import { fetchFrontSetting } from '../../../store/action/frontSettingAction';

import { getFormattedMessage, placeholderText } from '../../../shared/sharedMethod';

import { InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint, faFileExcel, faFilePdf, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import ReactSelect from '../../../shared/select/reactSelect';
import { fetchAcYear } from "../../../store/action/acYearAction";
import { filter, stubString } from "lodash";
import {jsPDF} from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import {fetchCompanyConfig} from "../../../store/action/companyConfigAction";



const MonthlyPurchaseTab = (props) => {
 
  const {
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
    fetchAcYear,companyConfig,fetchCompanyConfig
  } = props;
 
  const searchRef = useRef();
  console.log("companyConfig",companyConfig)
  useEffect(() => {
    fetchFrontSetting();
  }, [warehouseValue]);
  console.log(acYear)
  
  useEffect(() => {
    fetchAcYear();
    fetchCompanyConfig()
  }, []);
  console.log("companyConfig",companyConfig)
  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.focus();
    }
  }, []);
  const [isClearDropdown, setIsClearDropdown] = useState(true);
  const [isDropdown, setIsDropdown] = useState(true);
  const [errors, setErrors] = useState();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [itemsRecord, setItemsRecord] = useState(false)
 
  console.log(monthlyPurchase)

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterItems(query);
  };

  const filterItems = (query) => {
    if (query === '') {
      setFilteredItems(itemsValue);
      setItemsRecord(false)
    } else {
      const filtered = itemsValue.filter(item =>
        item.monthYear.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredItems(filtered);
      setItemsRecord(true)
      console.log("filtered", filteredItems)
    }
  };
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const yearRange = `${currentYear}-${nextYear}`;

  const [selectedYearRange, setSelectedYearRange] = useState({
    value: yearRange,
    label: yearRange,
  });



  const [acYears, setAcYears] = useState({
    acFrom: 0,
    acTo: 0,
    acYear: "",
  });
  useEffect(() => {
    let values =
      `?fromDate='${selectedYearRange.label.substr(0, 4)}-04-01'&toDate='${selectedYearRange.label.substr(5, 9)}-03-31'`

    console.log("hi",values);
    fetchMonthPurchaseparam(values, filter, true);
  }, [fetchMonthPurchaseparam, selectedYearRange])



  const loadValues = (obj) => {

    const new_values = { value: obj?.value ?? 0, label: obj?.label };

    setIsClearDropdown(false);
    setIsDropdown(false);
    setAcYears({ ...acYears, acYear: new_values });
    setErrors("");
    let values =
      `?fromDate='${new_values.label.substr(0, 4)}-04-01'&toDate='${new_values.label.substr(5, 9)}-03-31'`

    console.log(values);
    fetchMonthPurchaseparam(values, filter, true);
  };

  const itemsValue =
    monthlyPurchase?.length >= 0 &&
    monthlyPurchase.map((monthPurchase) => {
      return {

        monthYear: monthPurchase.monthYear,

        purchaseValue: monthPurchase.attributes.purchaseValue,
      };
    });


  const acFrom = useRef();
  const companyDetails = {
    companyName: companyConfig?.companyName,
    address: `${companyConfig?.attributes?.address1} , ${companyConfig?.attributes?.address2}`,
    phoneNumber: companyConfig?.attributes?.phoneNo
  };

  const reportDetails = {
    title: " Monthly Purchase Report",
    yearRange:selectedYearRange.label 
  };
  

  const loadReport = () => {
    let acFrom1 = acFrom.current.value;

    console.log(acFrom1);
  };
  const generatePurchaseReportPDF = (companyDetails, reportDetails, itemsValue) => {
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
       
        head: [['Month', 'Purchase Value']],
        body: itemsValue.map(item => [item.monthYear, item.purchaseValue]),
        foot: [['Total', itemsValue.reduce((acc, curr) => acc + parseFloat(curr.purchaseValue), 0).toFixed(2)]],
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

    doc.save('MonthlyPurchases.pdf');
};

  const footers = [
    {
      name: getFormattedMessage("totalPurchase.title"),
      selector: (row) => row.totalValue,
      sortField: "totalValue",
      sortable: true,
    }
  ];

  console.log(footers)
  const totalPurchaseValue = (data) => {
    console.log("data", data)
    return new Intl.NumberFormat('en-IN', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(data.reduce((acc, curr) => acc + parseFloat(curr.purchaseValue), 0));
  };

  
  const printTable = () => {
  
    const doc = generatePurchaseReportPDF(companyDetails, reportDetails, itemsValue);
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const printWindow = window.open(pdfUrl);
    
    if (printWindow) {
        printWindow.onload = () => {
            printWindow.print();
        };
    }
};


  const XLSX = require('xlsx');
  const fs = require('fs');

const generatePurchaseReportExcel = (companyDetails, reportDetails, itemsValue) => {
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
};
const exportToExcel=()=>{
  generatePurchaseReportExcel (companyDetails, reportDetails, itemsValue)
}

  const exportToPDF = () => {
   generatePurchaseReportPDF(companyDetails, reportDetails, itemsValue)
  };


  return (
    <div className="warehouse_purchase_report_table">
      <div className="row">
        <div className="col-md-3">
          <input
            className="form-control wd-100"
            placeholder="Search" onChange={handleSearchChange} ref={searchRef} style={{ paddingLeft: '30px' }}
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
            ></FontAwesomeIcon>

            <FontAwesomeIcon
              icon={faFileExcel}
              className="fa-2x search-icon "
              style={{ color: "green", paddingLeft: "10px" }}
              onClick={exportToExcel}
            ></FontAwesomeIcon>

            <FontAwesomeIcon
              icon={faFilePdf}
              className="fa-2x search-icon"
              style={{ color: "red", paddingLeft: "10px" }}
              onClick={exportToPDF}
            ></FontAwesomeIcon>

          </button>
        </div>

      </div>

      <div className="row">

        <div className="col-md-12">
          {itemsValue.length > 0 &&


            <div className="fixTableHead">
              <table className='table-container'>
                <thead>
                  <tr >
                    <th style={{ textAlign: "left" }}>Month</th>
                    <th style={{ textAlign: "right" }}>Purchase Value</th>
                  </tr>
                </thead>



                <tbody>
                  {(itemsRecord ? filteredItems : itemsValue).map((month, index) => (
                    <tr key={index}>
                      <td >{month.monthYear}</td>
                      <td className="purchaseValue">{new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(parseFloat(month.purchaseValue).toFixed(2))}</td>
                    </tr>
                  ))}
                </tbody>


                <tfoot>
                  <tr >
                    {footers.map((footer) => (
                      <th>{footer.name}</th>
                    ))}
                    <th >{totalPurchaseValue(itemsRecord ? filteredItems : itemsValue)}</th>
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
  const { isLoading, totalRecord, monthlyPurchase, frontSetting, acYear ,companyConfig} = state;
  return { isLoading, totalRecord, monthlyPurchase, frontSetting, acYear,companyConfig }
};

export default connect(mapStateToProps, { fetchFrontSetting, fetchMonthPurchase, fetchMonthPurchaseparam, fetchAcYear,fetchCompanyConfig })(MonthlyPurchaseTab);
