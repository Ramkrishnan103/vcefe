import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import TopProgressBar from "../../shared/components/loaders/TopProgressBar"
import SearchComponent from "../../shared/components/SearchComponent"
import { getFormattedMessage, placeholderText } from "../../shared/sharedMethod"
import TabTitle from "../../shared/tab-title/TabTitle"
import HeaderTitle from "../header/HeaderTitle"
import MasterLayout from "../MasterLayout"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import TableButton from "../../shared/action-buttons/TableButton"
import ReactDataTable from "../../shared/table/ReactDataTable"
import ActionButton from "../../shared/action-buttons/ActionButton"
import { connect } from "react-redux"
import { useEffect, useState } from "react"
import { fetchPosPurchaseListing } from "../../store/action/purchaseAction"
import { Button } from "react-bootstrap-v5"
import { useNavigate } from "react-router";
import DeletePurchase from "./DeletePurchase";
import { fetchSinglePurchase } from '../../store/action/purchaseAction';
import { Container, Modal } from "react-bootstrap"
import { fetchCompanyConfig } from '../../store/action/companyConfigAction';
import moment from "moment"
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Purchases = (props) => {
    const { companyConfig, fetchCompanyConfig, fetchPosPurchaseListing, purchases, allConfigData, totalRecord, isLoading, fetchSinglePurchase, purchaseSingle } = props;
    console.log("Pos Purchase Listing :", purchases)
    const navigate = useNavigate();
    const [pospurchase, setPosPurchase] = useState();
    const [filterPurchase, setFilterPurchase] = useState([]);
    const [isDelete, setIsDelete] = useState(null);
    const [deleteModel, setDeleteModel] = useState(false);
    const [formcode, setFormCode] = useState("T01");

    useEffect(() => {
        fetchPosPurchaseListing();
    }, [])

    useEffect(() => {
        setPosPurchase(purchases);
        setFilterPurchase(purchases);
    }, [purchases]);

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


    const handleSearchData = (e) => {
        const { name, value } = e.target;
        console.log("hi name", name);
        console.log("hi value", value);
        const filtered_Purchase = value.length > 0
            ? pospurchase?.filter((item) => {
                const supplierName = item?.attributes?.supplierName?.toLowerCase() || "";
                const entryNo = item?.attributes?.slNo?.toString().toLowerCase() || "";
                const invNo = item?.attributes?.invNo?.toString().toLowerCase() || "";

                return supplierName.includes(value.toLowerCase()) ||
                    entryNo.includes(value.toLowerCase()) ||
                    invNo.includes(value.toLowerCase());
            })
            : pospurchase;

        setFilterPurchase(filtered_Purchase);
    };

    const itemsValue = filterPurchase?.length > 0 &&
        filterPurchase?.map(item => ({
            id: item?.txNo,
            entryNo: item?.attributes?.slNo,
            invNo: item?.attributes?.invNo,
            supplierName: item?.attributes?.supplierName,
            supplierMobile: item?.attributes?.mobileNo,
            city: item?.attributes?.city,
            paymentType: item?.attributes?.paymentMode,
            billAmount: parseFloat(item?.attributes?.billAmount).toFixed(2)
        }));

    const goToEditProduct = (item) => {
        const id = item.id
        console.log(id);
        navigate(`/app/purchases/edit/${id}`);
    };

    const onClickDeleteModel = (isDelete = null) => {
        setDeleteModel(!deleteModel);
        setIsDelete(isDelete);
    };

    const columns = [
        {
            name: getFormattedMessage('entryNo.title'),
            selector: row => row.entryNo,
            sortField: 'entryNo',
            sortable: true,
        },
        {
            name: getFormattedMessage('inv.No.title'),
            selector: row => row.invNo,
            sortField: 'invNo',
            sortable: true,
        },
        {
            name: getFormattedMessage('globally.input.supplierName.label'),
            selector: row => row.supplierName,
            sortField: 'supplierName',
            sortable: true,
        },
        {
            name: getFormattedMessage('globally.input.supplierMobile.label'),
            selector: row => row.supplierMobile,
            sortField: 'supplierMobile',
            sortable: true,
        },
        {
            name: getFormattedMessage('globally.input.city.label'),
            selector: row => row.city,
            sortField: 'city',
            sortable: true,
        },
        {
            name: getFormattedMessage('globally.input.paymentType.label'),
            selector: row => row.paymentType,
            sortField: 'paymentType',
            sortable: true,
        },
        {
            name: getFormattedMessage('globally.input.billAmount.label'),
            selector: row => row.billAmount,
            sortField: 'billAmount',
            sortable: true,
        },
        {
            name: getFormattedMessage('react-data-table.action.column.label'),
            right: true,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            cell: row => <ActionButton item={row}
                // isViewIcon={true}
                // isPrint={true}
                goToEditProduct={goToEditProduct}
                onClickDeleteModel={onClickDeleteModel}
            //goToEditProduct={goToEditSuppliers} isEditMode={true}
            // onClickDeleteModel={onClickDeleteModel} 
            />
        }
    ];

    const ButtonValue = getFormattedMessage('Purchase.create.title')
    const to = '#/app/purchases/create'


    return (
        <div>
            <MasterLayout>
                <TopProgressBar />
                <TabTitle title={placeholderText('purchase.title')} />

                <div>
                    <h3 className="text-light fw-bolder">Listing Of Purchases</h3>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3 searchBox">
                        <div className="position-relative d-flex width-320">

                            <input
                                className="form-control ps-8"
                                type="search"
                                name="searchData"
                                id="search"
                                placeholder={placeholderText(
                                    "react-data-table.searchbarInv.placeholder"
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
                    <div className="col-md-6 text-end order-2 ">
                        <Button type='button' variant='primary' className='crt_product' href={to}>{ButtonValue}</Button>
                    </div>

                </div>

                <ReactDataTable

                    columns={columns}
                    items={itemsValue ? itemsValue : []}
                    totalRows={itemsValue?.length}
                    isLoading={isLoading}
                    isUnitFilter
                    subHeader={false}

                />
            <DeletePurchase onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel} onDelete={isDelete} />
            </MasterLayout>
        </div>
    )
};

const mapStateToProps = (state) => {
    const { purchases, isLoading, allConfigData, totalRecord, purchaseSingle, companyConfig } = state;
    return { purchases, isLoading, allConfigData, totalRecord, purchaseSingle, companyConfig }
}

export default connect(mapStateToProps, { fetchPosPurchaseListing, fetchSinglePurchase, fetchCompanyConfig })(Purchases)