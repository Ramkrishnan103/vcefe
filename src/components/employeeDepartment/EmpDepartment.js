import { connect } from "react-redux"
import TopProgressBar from "../../shared/components/loaders/TopProgressBar"
import MasterLayout from "../MasterLayout"
import { fetchEmpDepartment } from "../../store/action/empDepartmentAction"
import { useEffect, useState } from "react"
import TabTitle from "../../shared/tab-title/TabTitle"
import { getFormattedMessage, placeholderText } from "../../shared/sharedMethod"
import SearchComponent from "../../shared/components/SearchComponent"
import ReactDataTable from "../../shared/table/ReactDataTable"
import ActionButton from "../../shared/action-buttons/ActionButton"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button } from "react-bootstrap-v5"
import { useNavigate } from "react-router"
import EmpDepartmentCreate from "./EmpDepartmentCreate"
import EditEmpDepartment from "./EditEmpDepartment"
import DeleteEmpDepartment from "./DeleteEmpDepartment"

const EmpDepartment = (props) => {

    const {empDepartment,isLoading,fetchEmpDepartment}=props;
    const [importEmpDeaprtment, setimportEmpDeaprtment] = useState(false);

    console.log("Emp Department =>" ,empDepartment)
    const [editModel, setEditModel] = useState(false);
    const [empdepartment, setEmpDepartment] = useState();
    const [deleteModel, setDeleteModel] = useState(false);
    const [isDelete, setIsDelete] = useState(null);
    
  const [filterEmpDepartment, setFilterEmpDepartment] = useState([]);

  useEffect(() => {
    setEmpDepartment(empDepartment);
    setFilterEmpDepartment(empDepartment);
  }, [empDepartment]);


    const handleClose = (item) => {
        setEditModel(!editModel);
        setEmpDepartment(item);
        console.log("Item =>" ,item)
      };

      const onClickDeleteModel = (isDelete = null) => {
        setDeleteModel(!deleteModel);
        setIsDelete(isDelete);
      };

     
    useEffect(() => {
        fetchEmpDepartment();
    },[fetchEmpDepartment])

   
    const handleSearchData = (e) => {
        const { name, value } = e.target;
        console.log("hi name", name);
        console.log("hi value", value);
        const filtered_empDepartment =
          value.length > 0
            ? empdepartment.filter((item) =>
                item?.attributes?.departmentName
                  ?.toLowerCase()
                  ?.includes(value?.toLowerCase())
              )
            : empdepartment;
            setFilterEmpDepartment(filtered_empDepartment);
      };
    

    const itemsValue =
    filterEmpDepartment && 
    filterEmpDepartment.map(empDepartments => ({
        departmentId:empDepartments?.departmentId,
        departmentName:empDepartments?.attributes?.departmentName,
        remarks:empDepartments?.attributes?.remarks,
        isActive: empDepartments?.attributes?.isActive == true ? "Yes" : "No" ,
    }))  ;

    
    const columns = [
        {
            name: getFormattedMessage('departmentName.title'),
            selector: row => row.departmentName,
            sortField: 'departmentName',
            sortable: true,
        },
        {
            name: getFormattedMessage('globally.input.isActive.label'),
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
            <TabTitle title={placeholderText('empDepartment.title')} />

            <div>
                <h3 className="text-light fw-bolder">Listing Of Departments</h3>
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
<div className="col-md-3  d-flex justify-content-end" >
        <Button type="button" variant="primary" className="crt_product" onClick={onClick} >
              New Department
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

 {show?<EmpDepartmentCreate show={show} handleClose={handleCloseCreate}/>:""}

{/* <SearchComponent
        handleSearchData={handleSearchData}
        AddButton={<EmpDepartmentCreate />}
      />
      <ReactDataTable
        columns={columns}
        items={itemsValue}
        isLoading={isLoading}
        AddButton={<EmpDepartmentCreate />}
        title={getFormattedMessage("newDepartment.modal.input.product-group.label")}
        totalRows={itemsValue?.length}
        isUnitFilter
        subHeader={false}
      /> */}


{editModel?
<EditEmpDepartment
        handleClose={handleClose}
        show={editModel}
        empdepartment={empdepartment}
      /> : "" 
}     

<DeleteEmpDepartment
        onClickDeleteModel={onClickDeleteModel}
        deleteModel={deleteModel}
        onDelete={isDelete}
      />

{/* /* <EditEmpDepartment showEdit={showEdit} handleCloseEdit={handleCloseEdit}/>:""}  */}
        </MasterLayout>
        
    )
}

const mapStateToProps = (state) => {
    const {empDepartment,isLoading} = state
    return  {empDepartment,isLoading}
}

export default connect(mapStateToProps,{fetchEmpDepartment}) (EmpDepartment)