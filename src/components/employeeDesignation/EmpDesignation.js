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
import { fetchEmpDesignation } from "../../store/action/empDesignationAction"
import CreateEmpDesignation from "./CreateEmpDesignation"
import EditEmpDesignation from "./EditEmpDesignation"
import DeleteEmpDesignation from "./DeleteEmpDesignation"

const EmpDesignation = (props) => {

    const {empDesignation,isLoading,fetchEmpDesignation}=props;
    const [importEmpDeaprtment, setimportEmpDeaprtment] = useState(false);

    console.log("Emp Designation =>" ,empDesignation)
    const [editModel, setEditModel] = useState(false);
    const [empdesignation, setEmpdesignaiton] = useState();
    const [deleteModel, setDeleteModel] = useState(false);
    const [isDelete, setIsDelete] = useState(null);

    const [filterEmpDesignation, setFilterEmpDesignation] = useState([]);

  useEffect(() => {
    setEmpdesignaiton(empDesignation);
    setFilterEmpDesignation(empDesignation);
  }, [empDesignation]);


    const handleClose = (item) => {
        setEditModel(!editModel);
        setEmpdesignaiton(item);
        console.log("Item =>" ,item)
      };

      const onClickDeleteModel = (isDelete = null) => {
        setDeleteModel(!deleteModel);
        setIsDelete(isDelete);
      };

     
    useEffect(() => {
        fetchEmpDesignation();
    },[fetchEmpDesignation])

   
    
    const handleSearchData = (e) => {
        const { name, value } = e.target;
        console.log("hi name", name);
        console.log("hi value", value);
        const filtered_empDesignation =
          value.length > 0
            ? empdesignation.filter((item) =>
                item?.attributes?.designationName
                  ?.toLowerCase()
                  ?.includes(value?.toLowerCase())
              )
            : empdesignation;
            setFilterEmpDesignation(filtered_empDesignation);
      };
    

    const itemsValue =filterEmpDesignation && filterEmpDesignation.map(empDesignations => ({
        designationId:empDesignations?.designationId,
        designationName:empDesignations?.attributes?.designationName,
        remarks:empDesignations?.attributes?.remarks,
        isActive: empDesignations?.attributes?.isActive == true ? "Yes" : "No" ,
    }))  ;

    
    const columns = [
        {
            name: getFormattedMessage('designationName.title'),
            selector: row => row.designationName,
            sortField: 'designationName',
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
            <TabTitle title={placeholderText('empDesignation.title')} />

            <div>
                <h3 className="text-light fw-bolder">Listing Of Designations</h3>
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
              New Designation
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

{show?<CreateEmpDesignation show={show} handleClose={handleCloseCreate}/>:""}

{editModel?
<EditEmpDesignation
        handleClose={handleClose}
        show={editModel}
        empdesignation={empdesignation}
      /> : "" 
}     
 
<DeleteEmpDesignation
        onClickDeleteModel={onClickDeleteModel}
        deleteModel={deleteModel}
        onDelete={isDelete}
      /> 

        </MasterLayout>
        
    )
}

const mapStateToProps = (state) => {
    const {empDesignation,isLoading} = state
    return  {empDesignation,isLoading}
}

export default connect(mapStateToProps,{fetchEmpDesignation}) (EmpDesignation)