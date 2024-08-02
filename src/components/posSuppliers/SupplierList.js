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

const SupplierList =(props) => {

    const {fetchSupplierList,posSupplier,isLoading} =props;

    const [editModel, setEditModel] = useState(false)
    const [importSupplier, setimportSupplier] = useState(false);
    const [deleteModel,setDeleteModel] =useState(false)
    const [isDelete,setIsDelete] =useState(null)
    

    const handleClose = () => {
        setEditModel(!editModel);
        setimportSupplier(!importSupplier);
    };

    const onClickDeleteModel = (isDelete = null) => {
        setDeleteModel(!deleteModel);
        setIsDelete(isDelete);
    };


    const navigate =useNavigate();
   
    const goToEditSuppliers = (item) => {
        const id = item.id
        navigate(`/app/suppliers/edit/${id}`)
    };

    console.log("suppliers",posSupplier)

    useEffect(() => {
        fetchSupplierList();
    }, []);

    const itemsValue = posSupplier.length > 0 
        ? posSupplier 
            .map(posSupplier => {
                if (posSupplier?.attributes?.underGroup === "SUPPLIERS") {
                    return {
                        supplierCode: posSupplier?.attributes?.ledgerCode,
                        supplierName: posSupplier?.attributes?.ledgerName,
                        city: posSupplier?.attributes?.city,
                        isactive: posSupplier?.attributes?.isActive == true ? "yes" : "No" ,
                        id :posSupplier?.id
                    }; 
                }
                return null;
            })
            .filter(item => item !== null) // Filter out null values
        : [];

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

             <div className="mt-5" ><SearchComponent 
                        ButtonValue={getFormattedMessage('supplier.create.title')} 
                        totalRows={itemsValue?.length}
                        goToImport={handleClose} 
                       to='#/app/suppliers/create'
             />
             </div>
<div style={{marginTop:"-20px"}} >
                <ReactDataTable 
                    columns={columns}
                    items={itemsValue}
                    isLoading={isLoading}
                    // ButtonValue={getFormattedMessage('supplier.create.title')} 
                    //  totalRows={itemsValue?.length}
                    //  goToImport={handleClose} 
                    // to='#/app/suppliers/create'
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
    const {posSupplier,isLoading} =state;
    return {posSupplier,isLoading};
}

export default connect(mapStateToProps,{fetchSupplierList}) (SupplierList)