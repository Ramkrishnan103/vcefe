import { useEffect, useState } from "react"
import TopProgressBar from "../../shared/components/loaders/TopProgressBar"
import { getFormattedMessage, placeholderText } from "../../shared/sharedMethod"
import TabTitle from "../../shared/tab-title/TabTitle"
import MasterLayout from "../MasterLayout"
import { connect } from "react-redux"
import { fetchSupplierList } from "../../store/action/PosSupplierAction"
import ReactDataTable from "../../shared/table/ReactDataTable"
import { filter } from "lodash"
import ActionButton from "../../shared/action-buttons/ActionButton"
import { useNavigate } from "react-router"
import PosDeleteSupplier from "./PosDeleteSupplier"
import SearchComponent from "../../shared/components/SearchComponent"
import HeaderTitle from "../header/HeaderTitle"
import { Button } from "react-bootstrap-v5"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import TableButton from "../../shared/action-buttons/TableButton"

const SupplierList =(props) => {

    const {fetchSupplierList,posSupplier,isLoading,allConfigData} =props;

    const [editModel, setEditModel] = useState(false)
    const [importSupplier, setimportSupplier] = useState(false);
    const [deleteModel,setDeleteModel] =useState(false)
    const [isDelete,setIsDelete] =useState(null)
    const [formcode, setFormCode] = useState("M03");
    const [possupplier,setPosSupplier] =useState();
    const [filterPosSupplier, setFilterPosSupplier] = useState([]);

    useEffect(() => {
      setPosSupplier(posSupplier);
      setFilterPosSupplier(posSupplier);
    }, [posSupplier]);
  
    

    const handleClose = () => {
        setEditModel(!editModel);
        setimportSupplier(!importSupplier);
    };

    const onClickDeleteModel = (isDelete = null) => {
        setDeleteModel(!deleteModel);
        setIsDelete(isDelete);
    };

    useEffect(() => {
        debugger;
        const storedFormData = localStorage.getItem("UserFormCode");
    
        if (storedFormData) {
          const parsedFormData = JSON.parse(storedFormData);
    
          console.log("Parsed Form Data:", parsedFormData);
          if (parsedFormData.length > 0) {
            const formCodeItems = parsedFormData.filter((item) => item?.attributes?.formCode == formcode && item?.attributes?.visibility );
            console.log("Form Code Items:", formCodeItems);
          } else {
            navigate("/app/dashboard");
          }
        } else {
          navigate("/app/dashboard");
        }
      }, []);

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



    const navigate =useNavigate();
   
    const goToEditSuppliers = (item) => {
        const id = item.id
        navigate(`/app/suppliers/edit/${id}`)
    };

    console.log("suppliers",posSupplier)

    useEffect(() => {
        fetchSupplierList();
    }, []);

    const handleSearchData = (e) => {
        const { name, value } = e.target;
        console.log("hi name", name);
        console.log("hi value", value);
        const filtered_posSuppliers=
          value.length > 0
            ? possupplier.filter((item) =>
                item?.attributes?.ledgerName
                  ?.toLowerCase()
                  ?.includes(value?.toLowerCase())
              )
            : possupplier;
            setFilterPosSupplier(filtered_posSuppliers);            
      };


    const itemsValue = filterPosSupplier 
        && filterPosSupplier 
            .map(posSupplier => {
                if (posSupplier?.attributes?.underGroup === "SUPPLIERS") {
                    return {
                        supplierCode: posSupplier?.attributes?.ledgerCode,
                        supplierName: posSupplier?.attributes?.ledgerName,
                        city: posSupplier?.attributes?.city,
                        isactive: posSupplier?.attributes?.isActive == true ? "Yes" : "No" ,
                        id :posSupplier?.id
                    }; 
                }
                return null;
            })
            .filter(item => item !== null) // Filter out null values
        ;

    console.log("Items Value =>", itemsValue);   

    
    console.log("Items Value =>",itemsValue)


    const columns = [
        {
            name: getFormattedMessage('supplierCode.title'),
            selector: row => row.supplierCode,
            sortField: 'supplierCode',
            sortable: true,
        },
        {
            name: getFormattedMessage('globally.input.supplierName.label'),
            selector: row => row.supplierName,
            sortField: 'supplierName',
            sortable: true,
        },
        {
            name: getFormattedMessage('globally.input.city.label'),
            selector: row => row.city,
            sortField: 'city',
            sortable: true,
        },
        {
            name: getFormattedMessage('globally.input.isActive.label'),
            selector: row => row.isactive,
            sortField: 'isactive',
            sortable: true,
        },
        {
            name: getFormattedMessage('react-data-table.action.column.label'),
            right: true,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            cell: row => <ActionButton item={row} 
            isViewIcon={true}
            goToEditProduct={goToEditSuppliers} isEditMode={true}
            onClickDeleteModel={onClickDeleteModel} 
                 />
        }
    ];   


    return(
        <div>
            <MasterLayout>
                <TopProgressBar/>
                <TabTitle title={placeholderText('supplier.title')} />
<HeaderTitle title={placeholderText('Listsupplier.title')}/>
             {/* <div className="mt-5" >
                <SearchComponent 
                        ButtonValue={getFormattedMessage('supplier.create.title')} 
                        totalRows={itemsValue?.length}
                        goToImport={handleClose} 
                       to='#/app/suppliers/create'
                       onChange={(e) => handleSearchData(e)}
                />
             </div> */}

<div className="row">
    <div className="col-md-6 mb-3 searchBox">
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
      <div className="col-md-6">
          <TableButton ButtonValue={getFormattedMessage('supplier.create.title')} to='#/app/suppliers/create' />
      </div> 

</div>

<div  >
                <ReactDataTable 
                    columns={columns}
                    items={itemsValue}
                    isLoading={isLoading}
                    // ButtonValue={getFormattedMessage('supplier.create.title')} 
                     totalRows={itemsValue?.length}
                    // goToImport={handleClose} 
                    // to='#/app/suppliers/create'
                    isUnitFilter
                    subHeader={false}

                />
</div>
                <PosDeleteSupplier 
                     onClickDeleteModel={onClickDeleteModel} 
                     deleteModel={deleteModel} 
                     onDelete={isDelete}
                />

                
            </MasterLayout>
        </div>
    ) 
}

const  mapStateToProps =(state) => {
    const {posSupplier,isLoading,allConfigData,totalRecord} =state;
    return {posSupplier,isLoading,allConfigData,totalRecord};
}

export default connect(mapStateToProps,{fetchSupplierList}) (SupplierList)