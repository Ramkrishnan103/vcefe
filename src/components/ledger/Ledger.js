import { useEffect } from "react";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar"
import MasterLayout from "../MasterLayout"
import { fetchLedger } from "../../store/action/ledgerAction";
import { connect } from "react-redux";
import { getFormattedMessage, placeholderText } from "../../shared/sharedMethod";
import ReactDataTable from "../../shared/table/ReactDataTable";
import ActionButton from "../../shared/action-buttons/ActionButton";
import { useNavigate } from "react-router";
import { useState } from "react";
import DeleteLedger from "./DeleteLedger";
import TabTitle from "../../shared/tab-title/TabTitle";

const Ledger = (props) => {
    const { fetchLedger, ledger, totalRecord, isLoading, allConfigData } = props;

    const [editModel, setEditModel] = useState(false)
    const [importLedger, setImportLedger] = useState(false);
    const [deleteModel, setDeleteModel] = useState(false);
    const [isDelete, setIsDelete] = useState(null);
    const [formcode, setFormCode] = useState("M04");

    const handleClose = () => {
        setEditModel(!editModel);
        setImportLedger(!importLedger);
    };

    const onClickDeleteModel = (isDelete = null) => {
        setDeleteModel(!deleteModel);
        setIsDelete(isDelete);
    };

    console.log("Ledger Listing => ", ledger)
    const navigate = useNavigate();

    useEffect(() => {
        fetchLedger();
    }, [])

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


    const goToEditLedger = (item) => {
        const id = item.id
        navigate(`/app/ledgers/edit/${id}`)
    };

    const itemsValue = ledger.length >= 0 && ledger.map(ledgers => ({
        ledgerName: ledgers?.attributes?.ledgerName,
        underGroup: ledgers?.attributes?.underGroup,
        mobileNo: ledgers?.attributes?.mobileNo1,
        email: ledgers?.attributes?.email,
        city: ledgers?.attributes?.city,
        id: ledgers?.id
    }));

    console.log(itemsValue)


    const columns = [
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
            name: getFormattedMessage('globally.input.MobileNo.label'),
            selector: row => row.mobileNo,
            sortField: 'mobileNo',
            sortable: true,
            cell: (row) => {
                return (
                    <span className="badge bg-light-info">
                        <span>{row.mobileNo}</span>
                    </span>
                );
            },
        },
        {
            name: getFormattedMessage('globally.input.email.label'),
            selector: row => row.email,
            sortField: 'email',
            sortable: true,
            wrap: true
        },
        {
            name: getFormattedMessage('globally.input.city.label'),
            selector: row => row.city,
            sortField: 'city',
            sortable: true,
        },
        {
            name: getFormattedMessage('react-data-table.action.column.label'),
            right: true,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            cell: row => <ActionButton item={row} goToEditProduct={goToEditLedger} isEditMode={true}
                onClickDeleteModel={onClickDeleteModel} />
        }
    ];


    return (
        <div>
            <MasterLayout>
                <TopProgressBar />
                <TabTitle title={placeholderText('ledger.title')} />
                <ReactDataTable
                    columns={columns} items={itemsValue} isLoading={isLoading}
                    ButtonValue={getFormattedMessage('Ledger.create.title')} totalRows={itemsValue?.length}
                    goToImport={handleClose} to='#/app/ledgers/create'
                />
                <DeleteLedger onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel} onDelete={isDelete} />

            </MasterLayout>
        </div>
    )
}

const mapStateToProps = (state) => {
    const { ledger, totalRecord, isLoading, allConfigData } = state
    return { ledger, totalRecord, isLoading, allConfigData }
}

export default connect(mapStateToProps, { fetchLedger })(Ledger)