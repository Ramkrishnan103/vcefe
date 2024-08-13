import { connect, useSelector } from "react-redux";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import MasterLayout from "../MasterLayout";
import { useEffect, useState } from "react";
import TabTitle from "../../shared/tab-title/TabTitle";
import {
  getFormattedMessage,
  placeholderText,
} from "../../shared/sharedMethod";
import ReactDataTable from "../../shared/table/ReactDataTable";
import ActionButton from "../../shared/action-buttons/ActionButton";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "react-bootstrap-v5";
import {
  deleteSalaryDetails,
  fetchSalaryDetails,
  fetchSalaryDetailsFilter,
} from "../../store/action/SalaryStructureAction";
import SalaryPreparation from "./SalaryPreparation";
import { fetchSalary } from "../../store/action/salaryAction";
import { useNavigate } from "react-router";
import SalaryPreparationListPage from "./SalaryPreparationListPage";
import { filter } from "lodash";
import moment from "moment";
import { addToast } from "../../store/action/toastAction";
import DeleteModel from "../../shared/action-buttons/DeleteModel";

const Salary = (props) => {
  const {
    salaryDetail,
    isLoading,
    fetchSalaryDetails,
    // salary,
    fetchSalary,
    fetchSalaryDetailsFilter,
    deleteSalaryDetails
  } = props;
  const [importEmpDeaprtment, setimportEmpDeaprtment] = useState(false);

  console.log("Salary Details  =>", salaryDetail);
  const [editModel, setEditModel] = useState(false);
  const [viewModel, setViewModel] = useState(false);
  const salary = useSelector(state => state.salaryDetail);
  const [salarydetails, setSalarydetails] = useState();
  const [deleteModel, setDeleteModel] = useState(false);
  const [isDelete, setIsDelete] = useState(null);
  const [itemsValue,setItemsValue] =useState();

  const [filterSalaryDetails, setFilterSalaryDetails] = useState([]);

  useEffect(() => {
    setSalarydetails(salaryDetail);
    setFilterSalaryDetails(salaryDetail);
  }, [salaryDetail]);

  const navigate = useNavigate();

  const handleSalaryEdit = (item) => {
    setEditModel(!editModel);
    setSalarydetails(item);
    console.log("Item =>", item);
   // navigate("/app/salaryPreparationListPage", { state: { item } });
    let values = `?year=${item ? item?.year : ""}&month=${
      item ? item?.month : ""
    }&groupBy=''`;
    fetchSalaryDetailsFilter(values, filter, true, "edit");
  };

  const handleSalaryView = (salaryId) => {
    
    let dates = salaryId.split('-');
    let values = `?year=${dates ? dates[1] : ""}&month=${dates ? dates[0] : "" }&groupBy=''`;
    fetchSalaryDetailsFilter(values, filter, true, "view"); 

  };

  const onClickDeleteModel = (item) => {
    setDeleteModel(!deleteModel);
    setSalarydetails(item);
    setIsDelete(item)
    console.log("Item =>", item);
    // console.log("Salary Txno :",item?.salaryTxNo)
  };
  

  useEffect(() => {
    fetchSalaryDetails();
    fetchSalary();
  }, []);

  const handleSearchData = (e) => {
    const { name, value } = e.target;
    console.log("hi name", name);
    console.log("hi value", value);
    const filtered_salaryDetails =
      value.length > 0
        ? salarydetails.filter((item) =>
            item?.EmployeeList?.salaryMonth
              ?.toLowerCase()
              ?.includes(value?.toLowerCase())
          )
        : salarydetails;
    setFilterSalaryDetails(filtered_salaryDetails);
  };

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

  useEffect(() => {
    const items = salaryDetail
    ? salaryDetail?.data?.map((salarydetails, ind) => ({
        id: salarydetails?.attributes?.salaryMonth + '-' + salarydetails?.attributes?.salaryYear,
        year: salarydetails?.attributes?.salaryYear || [],
        month:
          moment()
            .month(salarydetails?.attributes?.salaryMonth - 1)
            .format("MMMM") || [],
        totalEarnings: salarydetails?.attributes?.totalEarnings,
        deductions: salarydetails?.attributes?.deductions,
        netPaid: salarydetails?.attributes?.netPaid,
        txNo:salarydetails?.attributes?.salaryTxNo
      }))
    : [];
    setItemsValue(items);
  },[salaryDetail]);


  useEffect(() => {
    itemsValue?.filter(item => item.status === 1).forEach(item => {
      const buttons = document.querySelectorAll(`#cell-6-${item.id} button`);
      buttons.forEach((btn, ind) => {
        if (ind === 1 || ind === 2) {
          btn.style.display = 'none';
        }
      });
    });
  }, [itemsValue]);
  

    //setViewItems(itemsValue)
  console.log("Item Value =>", itemsValue);

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
      selector: (row) => row.netPaid,
      sortField: "netPaid",
      sortable: true,
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
          onClickDeleteModel={onClickDeleteModel}
        />
      ),
    },
  ];

  const [show, setShow] = useState(false);
  const handleCloseCreate = () => setShow(!show);

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
      txNo:isDelete?.txNo,
      txnDate:moment(new Date()).format("YYYY-MM-DD"),
     salaryMonth:monthNumber,
     salaryYear:isDelete?.year,
     totalDays:31,
     updatedAt:1,
     remarks:"",
     salaryDetails2:[],
     xMode:"d" 
    }
deleteSalaryDetails(deleteSalary,navigate)
onClickDeleteModel(false);
};

  return (
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

      <div>
        <ReactDataTable
          columns={columns}
          items={itemsValue ? itemsValue : []}
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

{deleteModel  &&  <DeleteModel onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel}
                                       deleteUserClick={deleteSalaryClick} 
                                       title={getFormattedMessage('salaryDetails.title')}
                                     name={getFormattedMessage('salaryDetails.title')} /> }



      {/* {editModel && <SalaryPreparationListPage singleSalaryPreparation={itemsValue} />} */}
    </MasterLayout>
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
  deleteSalaryDetails
})(Salary);
