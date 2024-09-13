import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { Button, Image } from "react-bootstrap-v5";
import MasterLayout from "../MasterLayout";
import ReactDataTable from "../../shared/table/ReactDataTable";
import HeaderTitle from "../header/HeaderTitle";
import TabTitle from "../../shared/tab-title/TabTitle";
import {
  getFormattedDate,
  getFormattedMessage,
  placeholderText,
  currencySymbolHendling,
} from "../../shared/sharedMethod";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import SearchComponent from "../../shared/components/SearchComponent";
import ActionButton from "../../shared/action-buttons/ActionButton";
import { useNavigate } from "react-router";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fetchSalary, editSalary } from "../../store/action/salaryAction";
import { fetchDepartment } from "../../store/action/departmentAction";
import { fetchDesignation } from "../../store/action/designationAction";
import SweetAlert from "react-bootstrap-sweetalert";

const SalaryList = (props) => {
  const { fetchSalary, fetchDesignation, fetchDepartment, despartments, designations, salary, isLoading, editSalary } = props;
  console.log("salary", salary);
  const [searchData, setSearchData] = useState([]);
  const [rateAlert, setRateAlert] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [userId, setUserId] = useState(null);
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
    fetchSalary();
    fetchDepartment();
    fetchDesignation();
  }, []);

  console.log(despartments, designations);
  const itemsValue = (salary.length >= 0 && salary.length != undefined) && salary.filter(item => item?.attributes?.isActive).map(salary => ({
    designation: designations?.length >= 0 && designations?.find(item => item?.designationId === salary?.attributes?.designationId)?.attributes?.designationName || salary?.attributes?.designationId,
    department: despartments?.length >= 0 && despartments?.find(item => item?.departmentId === salary?.attributes?.departmentId)?.attributes?.departmentName || salary?.attributes?.departmentId,
    isActive: salary?.attributes?.isActive,
    id: salary?.id
  }));

  const columns = [
    {
      name: getFormattedMessage("department.title"),
      selector: row => row.department,
      sortField: 'department',
      sortable: true,
    },
    {
      name: getFormattedMessage("globally.input.designation.label"),
      selector: row => row.designation,
      sortField: 'designation',
      sortable: true,
    },
    {
      name: getFormattedMessage("globally.input.isactive.label"),
      selector: row => row.isActive == true ? 'Yes' : 'No',
      sortField: 'isActive',
      sortable: true,
    },

    {
      name: getFormattedMessage('react-data-table.action.column.label'),
      right: true,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      cell: row =>
        <ActionButton item={row}
          isViewIcon={true}
          isEditMode={false}
          isEditIcon={false}
          isDeleteMode={false}
          isCancel={true}
          goToDetailScreen={goToViewScreen}
          onClickDeleteModel={onClickDeleteModel}
        />
    }
  ];

  const onClickDeleteModel = (item) => {
    setDeleteId(item.id);
    setRateAlert(true);
  };

  useEffect(() => {
    let data = localStorage.getItem("loginUserArray");
    console.log(JSON.parse(data)['id']);
    setUserId(JSON.parse(data)['id']);
  },[]);

  const handleSearchData = (e) => {
    console.log("e", e.target.value);
    let search = itemsValue.filter(item => item?.designation?.toLowerCase().includes(e.target.value.toLowerCase()) || item?.department?.toLowerCase().includes(e.target.value.toLowerCase()));
    setSearchData(search);
  };

  const goToViewScreen = (item) => {
    debugger
    console.log("item", item);
    window.location.href = "#/app/salary/detail/" + item;
  };

  const handleClick = () => {
    navigate("/app/salary/create")
  };

  const onCancel = () => {
    setRateAlert(false);
  }

  const deActivate = (id) => {
    let data = {
      "id": deleteId,
      "createdBy": userId,
      "isActive": false
    }
    editSalary(data);
    setDeleteId(null);
    setRateAlert(false);
  };
  return (
    <MasterLayout>
      <TopProgressBar />
      <HeaderTitle title={getFormattedMessage("salary.title")} />
      <TabTitle title={placeholderText("salary.create.title")} />

      <div className="row">
        <div className="col-md-9 mb-3 searchBox">
          <div className="position-relative d-flex width-320">
            <input
              className="form-control ps-8"
              type="search"
              name="searchData"
              id="search"
              placeholder={placeholderText(
                "searchSalary.placeholder"
              )}
              aria-label="Search"
            onChange={(e) => handleSearchData(e)}
            />
            <span className="position-absolute d-flex align-items-center top-0 bottom-0 left-0 text-gray-600 ms-3">
              <FontAwesomeIcon icon={faSearch} />
            </span>
          </div>
        </div>
        <div className="col-md-3 d-flex justify-content-end">
          <Button type='button' variant='primary' className='imp_product' onClick={handleClick}>New Salary</Button>
        </div>
      </div>


      <ReactDataTable columns={columns} items={itemsValue ? (searchData?.length > 0 ? searchData : itemsValue) : []} isLoading={isLoading}
                totalRows={searchData?.length > 0 ? searchData?.length : itemsValue?.length}
      />
      {/* <DeleteCustomer onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel} onDelete={isDelete} /> */}
      {rateAlert && (
        <SweetAlert
          confirmBtnBsStyle='success mb-3 fs-5 rounded'
          cancelBtnBsStyle='secondary mb-3 fs-5 rounded text-white'
          confirmBtnCssClass='alert_yes'
          confirmBtnText={"Yes,It's Ok"}
          cancelBtnText={"Cancel"}
          title={"Are you sure to cancel this Salary Structure.?"}
          // onConfirm={onConfirm}
          // onCancel={onCancel}
          showCancel
          focusCancelBtn
          customButtons={
            <>
              <button id="cancel-button" onClick={() => onCancel()} className="btn btn-secondary">
                Cancel
              </button>

              <button id="confirm-button" className="btn btn-success" style={{ marginRight: "5%" }} autoFocus={true} onClick={() => deActivate()}>
                Yes
              </button>

            </>
          }
        // customIcon={remove} 
        />
      )}
    </MasterLayout>
  )


}
const mapStateToProps = (state) => {
  const { salary, isLoading, despartments, designations, } = state;
  return { salary, isLoading, despartments, designations, }
}
export default connect(mapStateToProps, { fetchSalary, fetchDesignation, fetchDepartment, editSalary })(SalaryList)
