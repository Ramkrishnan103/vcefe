import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import TopProgressBar from "../../shared/components/loaders/TopProgressBar"
import TabTitle from "../../shared/tab-title/TabTitle"
import ReactDataTable from "../../shared/table/ReactDataTable"
import MasterLayout from "../MasterLayout"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { Button } from "react-bootstrap-v5"
import { connect } from "react-redux"
import { useEffect, useState } from "react"
import { fetchPosSalesListing } from "../../store/action/SalesListingAction"
import ActionButton from "../../shared/action-buttons/ActionButton"
import { getFormattedMessage, placeholderText } from "../../shared/sharedMethod"

const PosSalesListing =(props) => {

    const {fetchPosSalesListing,posSales,isLoading,allConfigData,totalRecord} =props;

    const [possales, setPosSales] = useState();
    const [filterSales, setFilterSales] = useState([]);

    useEffect(() => {
        fetchPosSalesListing();
    },[])


    useEffect(() => {
        setPosSales(posSales);
        setFilterSales(posSales);
      }, [posSales]);
    
    
      const handleSearchData = (e) => {
        const { name, value } = e.target;
        console.log("hi name", name);
        console.log("hi value", value);
        const filtered_Sales = value.length > 0
        ? possales.filter((item) => {
            const customerName = item?.attributes?.customerName?.toLowerCase() || "";
            const invNo = item?.attributes?.invNo?.toString().toLowerCase() || "";
            const mobileNo = item?.attributes?.mobileNo?.toString().toLowerCase() || "";

            return customerName.includes(value.toLowerCase()) ||
                   invNo.includes(value.toLowerCase()) ||
                   mobileNo.includes(value.toLowerCase());
          })
        : possales;
    
    setFilterSales(filtered_Sales);
      };
    
   const itemsValue = filterSales &&
   filterSales.map(item => ({
    //    entryNo: item?.attributes?.slNo,
       invNo: item?.attributes?.invNo,
       customerName: item?.attributes?.customerName,
       supplierMobile: item?.attributes?.mobileNo,
       city: item?.attributes?.city,
       paymentType: item?.attributes?.paymentMode,
       billAmount: item?.attributes?.billAmount
   })) ;

    const columns = [
        
        {
            name: getFormattedMessage('inv.No.title'),
            selector: row => row.invNo,
            sortField: 'invNo',
            sortable: true,
        },
        {
            name: getFormattedMessage('globally.input.customerName.label'),
            selector: row => row.customerName,
            sortField: 'customerName',
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
            isViewIcon={true}
            //goToEditProduct={goToEditSuppliers} isEditMode={true}
           // onClickDeleteModel={onClickDeleteModel} 
                 />
        }
    ];   

  const  ButtonValue=getFormattedMessage('Sales.create.title')
 const  to='#/app/suppliers/create'

    return(
        <MasterLayout>
            <TopProgressBar/>
            <TabTitle title={placeholderText('sales.title')} />

            <div>
                <h3 className="text-light fw-bolder">Listing Of Sales</h3>
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
        items={itemsValue?itemsValue : [] }
        totalRows={itemsValue?.length}
        isLoading={isLoading}
        isUnitFilter
        subHeader={false}
            
        /> 

        </MasterLayout>
    )
}

const mapStateToProps =(state) => {
    const { posSales,isLoading,allConfigData,totalRecord} = state;
    return { posSales,isLoading,allConfigData,totalRecord}
}

export default connect(mapStateToProps,{fetchPosSalesListing}) (PosSalesListing)

