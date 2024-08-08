import { connect } from "react-redux"
import TopProgressBar from "../../shared/components/loaders/TopProgressBar"
import MasterLayout from "../MasterLayout"
import { useEffect, useState } from "react"
import TabTitle from "../../shared/tab-title/TabTitle"
import { getFormattedMessage, placeholderText } from "../../shared/sharedMethod"
import ReactDataTable from "../../shared/table/ReactDataTable"
import ActionButton from "../../shared/action-buttons/ActionButton"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button } from "react-bootstrap-v5"
// import {fetchSalaryDetails} from "../../store/action/SalaryStructureAction"
import SalaryPreparation from "./SalaryPreparation"

const Salary = (props) => {

    const {salaryDetail,isLoading,fetchSalaryDetails}=props;
    const [importEmpDeaprtment, setimportEmpDeaprtment] = useState(false);

    // console.log("Emp Department =>" ,empDepartment)
    const [editModel, setEditModel] = useState(false);
    const [salarydetails, setSalarydetails] = useState();
    const [deleteModel, setDeleteModel] = useState(false);
    const [isDelete, setIsDelete] = useState(null);
    
  const [filterSalaryDetails, setFilterSalaryDetails] = useState([]);

  useEffect(() => {
    setSalarydetails(salaryDetail);
    setFilterSalaryDetails(salaryDetail);
  }, [salaryDetail]);


    const handleClose = (item) => {
        setEditModel(!editModel);
        setSalarydetails(item);
        console.log("Item =>" ,item)
      };

      const onClickDeleteModel = (isDelete = null) => {
        setDeleteModel(!deleteModel);
        setIsDelete(isDelete);
      };

     
    // useEffect(() => {
    //     fetchSalaryDetails();
    // },[fetchSalaryDetails])

   
    const handleSearchData = (e) => {
        const { name, value } = e.target;
        console.log("hi name", name);
        console.log("hi value", value);
        const filtered_salaryDetails =
          value.length > 0
            ? salarydetails.filter((item) =>
                item?.attributes?.departmentName
                  ?.toLowerCase()
                  ?.includes(value?.toLowerCase())
              )
            : salarydetails;
            setFilterSalaryDetails(filtered_salaryDetails);
      };
    

    const itemsValue =[];
    // filterSalaryDetails && 
    // filterSalaryDetails.map(empDepartments => ({
    //     departmentId:empDepartments?.departmentId,
    //     departmentName:empDepartments?.attributes?.departmentName,
    //     remarks:empDepartments?.attributes?.remarks,
    //     isActive: empDepartments?.attributes?.isActive == true ? "Yes" : "No" ,
    // }))  ;

    

    const columns = [
        {
            name: getFormattedMessage('Year.title'),
            selector: row => row.year,
            sortField: 'year',
            sortable: true,
        },
        {
            name: getFormattedMessage('month.title'),
            selector: row => row.month,
            sortField: 'month',
            sortable: true,
        },
        {
          name: getFormattedMessage('totalEarnings.title'),
          selector: row => row.totalEarnings,
          sortField: 'totalEarnings',
          sortable: true,
      },
      {
          name: getFormattedMessage('totalDeduction.title'),
          selector: row => row.totalDeduction,
          sortField: 'totalDeduction',
          sortable: true,
      },
      {
        name: getFormattedMessage('netPaidAmount.title'),
        selector: row => row.netPaidAmount,
        sortField: 'netPaidAmount',
        sortable: true,
    },
        {
            name: getFormattedMessage('react-data-table.action.column.label'),
            right: true,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            cell: row => <ActionButton item={row} 
            goToEditProduct={handleClose}
          isEditMode={true}
             onClickDeleteModel={onClickDeleteModel} 
                 />
        }
    ];

    const [show, setShow] = useState(false);
    const handleCloseCreate = () => setShow(!show);

    const  onClick = () => {
        setShow(true)
    }


    return (
        <MasterLayout>
            <TopProgressBar/>
            <TabTitle title={placeholderText('salary.create.title')} />

            <div>
                <h3 className="text-light fw-bolder">Listing Of Salaries</h3>
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
<div className="col-md-3  d-flex justify-content-end" >
        <Button type="button" variant="primary" className="crt_product" onClick={onClick} >
              Prepare New 
        </Button>
</div>
</div>

            <div  >
                <ReactDataTable 
                     columns={columns}
                    items={itemsValue ? itemsValue : []}
                    isLoading={isLoading}
                     totalRows={itemsValue?.length}
                    isUnitFilter
                    subHeader={false}
                />
            </div>

 {show?<SalaryPreparation show={show} handleClose={handleCloseCreate} title={getFormattedMessage("SalaryPreparation.title")} />:""}


        </MasterLayout>
        
    )
}

const mapStateToProps = (state) =>  {
    const {salaryDetail,isLoading} =state;
    return {salaryDetail,isLoading}
}

export default connect(mapStateToProps,{}) (Salary)
