import { useEffect } from "react";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar"
import MasterLayout from "../MasterLayout"
import { fetchLedger } from "../../store/action/ledgerAction";
import { connect } from "react-redux";
import { getFormattedMessage, placeholderText } from "../../shared/sharedMethod";
import SearchComponent from "../../shared/components/SearchComponent";
import HeaderTitle from "../header/HeaderTitle";
import ReactDataTable from "../../shared/table/ReactDataTable";
import ActionButton from "../../shared/action-buttons/ActionButton";
import { useNavigate } from "react-router";
import { useState } from "react";
import DeleteLedgerDemo from "./DeleteLedgerDemo";
import TabTitle from "../../shared/tab-title/TabTitle";

const LegerDemo = (props) => {
    const { fetchLedger, ledger, totalRecord, isLoading, allConfigData } = props;

    const [editModel, setEditModel] = useState(false)
    const [importLedger, setImportLedger] = useState(false);
    const [deleteModel, setDeleteModel] = useState(false);
    const [isDelete, setIsDelete] = useState(null);
    const [filterLedger,setFilteredLedger]=useState([])
    const handleClose = () => {
        setEditModel(!editModel);
        setImportLedger(!importLedger);
    };

    const onClickDeleteModel = (isDelete = null) => {
        setDeleteModel(!deleteModel);
        setIsDelete(isDelete);
    };

    console.log("LegerDemo Listing => ", ledger)
    const navigate = useNavigate();

    useEffect(() => {
        fetchLedger();
    }, [])
    useEffect(()=>{
        setFilteredLedger(ledger)
        },[ledger])

    const goToEditLedger = (item) => {
        const id = item.id;
        navigate(`/app/ledgers/edit/${id}`);
    };
    const handleSearchData = (e) => {
        const {  value } = e.target;
       
        console.log("hi value", value);
        const filtered_ledgers=
          value.length > 0
            ? ledger.filter((item) =>
                item?.attributes?.ledgerName
                  ?.toLowerCase()
                  ?.includes(value?.toLowerCase())
              )
            : ledger;
            setFilteredLedger(filtered_ledgers);
            };

  
  
    const itemsValue = ledger
        .filter(ledgers => ledgers?.attributes?.underGroup !== "CUSTOMERS" && ledgers?.attributes?.underGroup !== "SUPPLIERS")
        .map(ledgers => ({
            ledgerCode: ledgers?.attributes?.ledgerCode,
            ledgerName: ledgers?.attributes?.ledgerName,
            underGroup: ledgers?.attributes?.underGroup,
            isActive: ledgers?.attributes?.isActive === true ? "Yes" : "No",
            id: ledgers?.id
        }))
       
       
    console.log(itemsValue);
    
  
    console.log(itemsValue)


    const columns = [
        {
            name: getFormattedMessage( "globally.input.LedgerCode.label"),
            selector: row => row.ledgerCode,
            sortField: 'ledgerCode',
            sortable: true,
        },
        {
            name: getFormattedMessage('ledger.title'),
            selector: row => row.ledgerName,
            sortField: 'ledgerName',
            sortable: true,
        },
        {
            name: getFormattedMessage('globally.input.underGroup.label'),
            selector: row => row.underGroup,
            sortField: 'underGroup',
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
            cell: row => <ActionButton item={row} goToEditProduct={goToEditLedger} isEditMode={true}
            isViewIcon={true}
                onClickDeleteModel={onClickDeleteModel} />
        }
    ];


    return (
        <div>
            <MasterLayout>
                <TopProgressBar />
                <TabTitle title={placeholderText('ledger.title')} />
                <HeaderTitle
        title={getFormattedMessage( "ledgerList.create.title")}/>
     <SearchComponent
        handleSearchData={handleSearchData}
      
        autoComplete="off"
        ButtonValue={getFormattedMessage("ledger.create.title")}
        to="#/app/ledgers/create"
        totalRows={itemsValue?.length}
        goToImport={handleClose} 
       
      />
                <ReactDataTable
                    columns={columns} items={itemsValue} isLoading={isLoading}
                    
                />
                <DeleteLedgerDemo onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel} onDelete={isDelete} />

            </MasterLayout>
        </div>
    )
}

const mapStateToProps = (state) => {
    const { ledger, totalRecord, isLoading, allConfigData } = state
    return { ledger, totalRecord, isLoading, allConfigData }
}

export default connect(mapStateToProps, { fetchLedger })(LegerDemo)
