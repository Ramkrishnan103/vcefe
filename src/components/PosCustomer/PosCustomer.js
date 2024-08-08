import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { Button, Image } from "react-bootstrap-v5";
import MasterLayout from "../MasterLayout";
import ReactDataTable from "../../shared/table/ReactDataTable";
import { fetchCustomers } from "../../store/action/PosCustomerAction";
import TabTitle from "../../shared/tab-title/TabTitle";
import HeaderTitle from "../header/HeaderTitle";
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
import DeletePosCustomer from "./DeletePosCustomer";

 
const PosCustomer=(props)=>{
  const navigate = useNavigate();
  const [deleteModel, setDeleteModel] = useState(false);
  const [isDelete, setIsDelete] = useState(null);
  const [editModel, setEditModel] = useState(false)
  const {fetchCustomers,posCustomer,isLoading}=props
  const [importCustomer, setimportCustomer] = useState(false);
  const [filterPosCustomer,setFilterPosCustomer]=useState([])
  console.log("posCustomer",posCustomer);
  useEffect(() => {
  fetchCustomers();
}, [])
const handleClose = () => {
  setEditModel(!editModel);
  setimportCustomer(!importCustomer);
};

const goToEditCustomer = (item) => {
  const id = item.id
  console.log("id",id)
  navigate(`/app/posCustomer/edit/${id}`)
};
const onClickDeleteModel = (isDelete = null) => {
  setDeleteModel(!deleteModel);
  setIsDelete(isDelete);
};
useEffect(()=>{
setFilterPosCustomer(posCustomer)
},[posCustomer])

  const columns = [
    {
        name: getFormattedMessage("customerCode.title"),
        selector: row => row.customerCode,
        sortField: 'customerCode',
        sortable: true,
    },
    {
        name: getFormattedMessage("globally.input.customerName.label"),
        selector: row => row.customerName,
        sortField: 'customerName',
        sortable: true,
    },
    {
        name: getFormattedMessage('globally.input.MobileNo.label'),
        selector: row => row.mobileNo,
        sortField: 'mobileNo',
        sortable: true,
       
      },
   
    {
        name: getFormattedMessage('globally.input.city.label'),
        selector: row => row.city,
        sortField: 'city',
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
        goToEditProduct={goToEditCustomer} isEditMode={true}
        isViewIcon={true}
            onClickDeleteModel={onClickDeleteModel}
            />
    }
];
const handleSearchData = (e) => {
  const { name, value } = e.target;
  console.log("hi name", name);
  console.log("hi value", value);
  const filtered_posCustomers=
    value.length > 0
      ? posCustomer.filter((item) =>
          item?.attributes?.ledgerName
            ?.toLowerCase()
            ?.includes(value?.toLowerCase())
        )
      : posCustomer;
      setFilterPosCustomer(filtered_posCustomers);
      };
const itemsValue = filterPosCustomer&&
filterPosCustomer
            .map(posCustomer => {
                if (posCustomer?.attributes?.underGroup === "CUSTOMERS") {
                  console.log('hi')
                    return {
                        customerCode: posCustomer?.attributes?.ledgerCode,
                        customerName: posCustomer?.attributes?.ledgerName,
                        mobileNo:posCustomer?.attributes?.mobileNo1,
                        city: posCustomer?.attributes?.city,
                        isActive: posCustomer?.attributes?.isActive == true ? "Yes" : "No", 
                       id:posCustomer?.id
                    }; 
                }
                return null;
            })
            .filter(item => item !== null)
       ;

return(
 

    <MasterLayout>
      <TopProgressBar/>
      <TabTitle title={placeholderText("customer.create.title")}/>
      <HeaderTitle
        title={getFormattedMessage("customerList.create.title")}/>
     <SearchComponent
        handleSearchData={handleSearchData}
      
        autoComplete="off"
        ButtonValue={getFormattedMessage("customer.create.title")}
        to="#/app/posCustomer/create"
        totalRows={itemsValue?.length}
        goToImport={handleClose} 
       
      />
   
      <ReactDataTable  columns={columns} items={itemsValue} isLoading={isLoading}/>
     <DeletePosCustomer onClickDeleteModel={onClickDeleteModel} deleteModel={deleteModel} onDelete={isDelete} />

    </MasterLayout>
  )

  
}
const mapStateToProps=(state)=>{
  const {posCustomer,isLoading}=state;
  return {posCustomer,isLoading}
}
export default connect(mapStateToProps,{fetchCustomers})(PosCustomer)