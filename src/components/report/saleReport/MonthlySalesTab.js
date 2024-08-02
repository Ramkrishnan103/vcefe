import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
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
import { Button, Form, InputGroup } from "react-bootstrap-v5";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
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
  } = props;
  const currencySymbol =
    frontSetting && frontSetting.value && frontSetting.value.currency_symbol;
  const [isWarehouseValue, setIsWarehouseValue] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  console.log(monthlySales)


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

 
  useEffect(() => {
    fetchAcYear();
  }, []);

  

  const totalSalesValue = (data) => {
    console.log("data",data)
    return new Intl.NumberFormat('en-IN', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(data.reduce((acc, curr) => acc + parseFloat(curr.salesValue), 0));
  };
  

  return (
    <div className="warehouse_sale_report_table">
     
      {/* <br></br> */}

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
          {/* <select className='w-100 h-100  rounded text-align-center border-0 align-items-center '>
           */}
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
            ></FontAwesomeIcon>
          
         
            <FontAwesomeIcon
              icon={faFileExcel}
              className="fa-2x search-icon "
              style={{ color: "green",paddingLeft:"10px"}}
            ></FontAwesomeIcon>
         
            
          
            <FontAwesomeIcon
              icon={faFilePdf}
              className="fa-2x search-icon"
              style={{ color: "red" ,paddingLeft:"10px"}}
            ></FontAwesomeIcon>

          </button>
        </div>
        
      </div>

<div className="row">

<div className="col-md-12">
       {itemsValue.length>0 && 

<div className="fixTableHead">
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
      <th >{totalSalesValue(isFiltered ? filteredItems : itemsValue)}</th>
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
  const { isLoading, totalRecord, monthlySales, frontSetting, acYear } = state;
  return { isLoading, totalRecord, monthlySales, frontSetting, acYear };
};

export default connect(mapStateToProps, {
  fetchFrontSetting,
  saleExcelAction,
  fetchAcYear,
  fetchMonthSalesparam,
})(MonthlySalesTab);
