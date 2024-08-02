import React, {useEffect, useRef, useState} from 'react';
import moment from 'moment';
import {connect} from 'react-redux';
import { fetchDailySales } from '../../../store/action/dailySalesAction';
import { fetchFrontSetting } from '../../../store/action/frontSettingAction';
import { saleExcelAction } from '../../../store/action/salesExcelAction';
import { getFormattedMessage, placeholderText } from '../../../shared/sharedMethod';
import ReactDataTable from '../../../shared/table/ReactDataTable';
import { InputGroup } from 'react-bootstrap';
import ReactSelect from 'react-select';
import { address, date } from 'faker/lib/locales/az';
import { apiBaseURL } from '../../../constants';
import loader from 'sass-loader';
import { filter } from 'lodash';
import CommonTable from '../../../shared/table/CommonTable';

// import "../../assets/css/frontend.css";

const DailySalesTab = (props) => {
    const {
        isLoading,
        totalRecord,
        fetchDailySales,
        dailySales,
        frontSetting,
        fetchFrontSetting,
        warehouseValue,
        saleExcelAction, allConfigData
    } = props;
    const currencySymbol = frontSetting && frontSetting.value && frontSetting.value.currency_symbol
    const [isWarehouseValue, setIsWarehouseValue] = useState(false);

    console.log(dailySales)

    useEffect(() => {
        fetchFrontSetting();
    }, [warehouseValue]);

    const itemsValue = dailySales?.length >= 0 && dailySales.map(dailysale => {
        return (
            {
                date:dailysale.date=== null ? null : moment( dailysale.date).format("YYYY-MM-DD"),
                invno:dailysale.attributes.invNo,
                // counterName:dailysale.attributes.counterName,
                customerName: dailysale.attributes.customerName,
                paymentType: dailysale.attributes.paymentType,
                address:dailysale.attributes.customerAddress,
                salesValue:dailysale.attributes.salesValue,
            }
        )
    });

    console.log(itemsValue)

   

    const footers = [
        {
          name: getFormattedMessage("totalSales.title"),
            
           selector: (row) => row.totalValue,
           sortField: "totalValue",
           sortable: true, 
        }
      ];

      
  const totalSalesValue = (data) => {
    console.log("data",data)
    return new Intl.NumberFormat('en-IN', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(data.reduce((acc, curr) => acc + parseFloat(curr.salesValue), 0));
  };
  

    const today=new Date();
    const numOfDaysAdded=0;
    const date=today.setDate(today.getDate() + numOfDaysAdded);
    const defaultValue=new Date(date).toISOString().split('T')[0];  // YYYY-MM-dd


    const fromDate=useRef();
    const tooDate=useRef();
    const paymode=useRef();
    const search=useRef();


    // const [selectPayMode,setSelectPayMode] =useState('')
    // const [fromDate1,setFromDate1] =useState('')
    // const [todate,setToDate] =useState('')
    const loadValues=(filter)=>{
        let values="?fromDate="+fromDate.current.value +"&toDate="+tooDate.current.value 
        + "&counterId=0&paymentType="+paymode.current.value+"&particular="+search.current.value
        console.log(values);
        fetchDailySales(values,filter,true);
        // setSelectPayMode(paymode.current.value);
        // setFromDate1(fromDate.current.value);
        // setToDate(tooDate.current.value);
    }

// console.log("fromDate =>" ,fromDate1)

    const onExcelClick = () => {
        setIsWarehouseValue(true);
    };

    return (
        <div className='warehouse_sale_report_table'>

             <div className='row'>
                <div className='col-md-2'> 
                        <h4 className='mt-2'>From Date</h4>
                </div>

                 <div className='col-md-2'>
                        <input id1='dateInput' type='date' ref={fromDate}  defaultValue={defaultValue}
                  className=' form-control rounded text-align-center ml-2 align-item-center mr-15 mb-5' sty></input>
                </div>

                <div className='col-md-1'></div>

                <div className='col-md-2 mt-2'>
                        <h4>To Date</h4>
                </div>

                <div className='col-md-2'>
                        <input id2='dateRequired2' type='date' ref={tooDate} defaultValue={defaultValue}  className='form-control  rounded text-align-center  align-items-center mr-15 mb-5'></input>
                </div>

                <div className='col-md-1'></div>

               
                <div className='col-md-2' style={{marginTop:"-30px"}}>
                        <h4 >Select Pay Mode</h4>
             
                    <select className='w-100 p-3 flex-nowrap dropdown-side-btn- boder-0 form-control ml-2' ref={paymode}
                     name='DropDownValue' >
                        <option value=''>All</option>
                        <option value='Cash'>Cash</option>
                        <option value='Upi'>Upi</option>
                        <option value='Bank'>Bank</option>
                    </select>
                </div>
            </div>  
            <div className='row'>

                <div className='col-md-2 mt-2'>
                    <h4>Search</h4>
                </div>

                <div className='col-md-7'>
                     <input type='text' ref={search}  placeholder='Customer Name Or Mobile No Or Inv. No' className=' form-control rounded text-align-center  align-items-center mr-15 mb-5'></input>
                </div>

                <div className='col-md-1'></div>

                <div className='col-md-2'>
                    <button className=' form-control border-0 bg-success text-white' onClick={loadValues}>Generate</button>
                </div>
            </div>

{/* <div className='row'>
        <div className='col-md-3'>
            <h4 style={{color:"green"}}>From Date = {fromDate1?fromDate1:defaultValue}</h4>
        </div>
        <div className='col-md-3'>
            <h4 style={{color:"green"}}>To Date = {todate?todate:defaultValue}</h4>
        </div>
        <div className='col-md-3'>
            <h4 style={{color:"green"}} >Payment Type ={selectPayMode?selectPayMode:"All"}</h4>
        </div>
</div> */}

<div className="row">

<div className="col-md-12">
       {itemsValue.length>0 && 

<div className="fixTableHead">
<table className='table-container'>
  <thead>
    <tr >
      <th style={{fontWeight:"bold",fontSize:"16px"}}>Date</th>
      <th style={{fontWeight:"bold",fontSize:"16px"}}>Inv No</th>
      <th style={{fontWeight:"bold",fontSize:"16px"}}>Customer Name</th>
      { paymode.current.value=='' &&
        <th style={{fontWeight:"bold",fontSize:"16px"}}>Payment Type</th>
        }
      <th style={{fontWeight:"bold",fontSize:"16px"}}>Address</th>
      <th style={{fontWeight:"bold",textAlign:"right",fontSize:"16px"}}> Sales Value</th>
    </tr>
  </thead>


 
  <tbody>
    {itemsValue.map((month, index) => (
      <tr key={index}>
        <td >{month.date}</td>
        <td >{month.invno}</td>
        <td >{month.customerName}</td>
        { paymode.current.value=='' &&
        <td >{month.paymentType}</td>
        }
        <td >{month.address}</td>
        <td className="salesvalue">{
            new Intl.NumberFormat('en-IN', {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(parseFloat(month.salesValue), 0)
            }
        </td>
      </tr>
    ))}
  </tbody>

  
  <tfoot>
    <tr >
      {footers.map((footer) => (
        <th colSpan="4">{footer.name}</th>
      ))}
      <th colSpan="5">{totalSalesValue(itemsValue)}</th>
    </tr>
  </tfoot>
  </table>
</div>
}
</div>
</div> 

                        
        </div>
    )
};

const mapStateToProps = (state) => {
    const {dailySales,isLoading, totalRecord, frontSetting} = state;
    return {dailySales,isLoading, totalRecord, frontSetting}
};

export default connect(mapStateToProps, {fetchFrontSetting, fetchDailySales, saleExcelAction})(DailySalesTab);
