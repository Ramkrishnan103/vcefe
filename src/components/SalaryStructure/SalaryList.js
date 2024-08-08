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
import { fetchSalary } from "../../store/action/salaryAction";



const SalaryList=(props)=>{
  
  const {fetchSalary,salary,isLoading}=props;
  console.log("salary",salary)
  const navigate=useNavigate()
useEffect(()=>{
fetchSalary()
},[])
const itemsValue=salary.length>=0&&salary.map(salary=>({
  department:salary?.attributes?.departmentId,
  designation:salary?.attributes?.designationId,
  isActive:salary?.attributes?.isActive,
  
}))

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
      selector: row => row.isActive,
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
        // onClickDeleteModel={onClickDeleteModel}
        />
    }
];

const handleClick=()=>{
  navigate("/app/salary/create")
}


return(
 

    <MasterLayout>
      <TopProgressBar/>
      <HeaderTitle title={getFormattedMessage("salarylist.title")} />
      <TabTitle title={placeholderText("salary.create.title")}/>
    
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
            // onChange={(e) => handleSearchData(e)}
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
      
   
      <ReactDataTable  columns={columns} items={itemsValue} isLoading={isLoading}
     />
     {/* <DeleteCustomer onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel} onDelete={isDelete} /> */}

    </MasterLayout>
  )

  
}
const mapStateToProps=(state)=>{
  const {salary,isLoading}=state;
  return {salary,isLoading}
}
export default connect(mapStateToProps,{fetchSalary})(SalaryList)